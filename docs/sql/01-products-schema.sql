/*
	Products schema: products, product_variants, variant_images, variant_sizes.

	Assumes the old public.product_images and public.products tables are already
	dropped, and that brands.id and categories.id are uuid.

	Run the whole script in the Supabase SQL Editor. It is wrapped in a transaction,
	so if anything fails nothing is created.
*/

begin;

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

create table public.products (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	brand_id uuid not null references public.brands (id) on delete restrict,
	category_id uuid not null references public.categories (id) on delete restrict,
	created_at timestamptz not null default now(),
	constraint products_brand_id_name_key unique (brand_id, name)
);

create table public.product_variants (
	id uuid primary key default gen_random_uuid(),
	product_id uuid not null references public.products (id) on delete cascade,
	name text not null,
	slug text not null,
	description text,
	price numeric(10, 2) not null,
	discount_percentage smallint not null default 0,
	is_active boolean not null default true,
	display_order integer not null default 0,
	created_at timestamptz not null default now(),
	constraint product_variants_slug_key unique (slug),
	constraint product_variants_product_id_name_key unique (product_id, name),
	constraint product_variants_price_check check (price >= 0),
	constraint product_variants_discount_check check (discount_percentage between 0 and 100)
);

create table public.variant_images (
	id uuid primary key default gen_random_uuid(),
	variant_id uuid not null references public.product_variants (id) on delete cascade,
	path text not null,
	display_order integer not null default 0,
	created_at timestamptz not null default now(),
	constraint variant_images_path_key unique (path)
);

create table public.variant_sizes (
	id uuid primary key default gen_random_uuid(),
	variant_id uuid not null references public.product_variants (id) on delete cascade,
	size text not null,
	stock integer not null default 0,
	created_at timestamptz not null default now(),
	constraint variant_sizes_variant_id_size_key unique (variant_id, size),
	constraint variant_sizes_stock_check check (stock >= 0)
);

/* ------------------------------------------------------------------ */
/* Indexes                                                             */
/* Unique constraints already index products.brand_id,                 */
/* product_variants.product_id and variant_sizes.variant_id.           */
/* ------------------------------------------------------------------ */

create index products_category_id_idx
	on public.products (category_id);

create index variant_images_variant_id_display_order_idx
	on public.variant_images (variant_id, display_order);

/* ------------------------------------------------------------------ */
/* Row level security                                                  */
/* ------------------------------------------------------------------ */

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_images enable row level security;
alter table public.variant_sizes enable row level security;

/* products: public read, authenticated write */

create policy "Enable read access for all users"
on public.products
for select
to anon, authenticated
using (true);

create policy "Authenticated can insert products"
on public.products
for insert
to authenticated
with check (true);

create policy "Authenticated can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete products"
on public.products
for delete
to authenticated
using (true);

/* product_variants: anon reads active only, authenticated reads all and writes */

create policy "Anon can read active variants"
on public.product_variants
for select
to anon
using (is_active = true);

create policy "Authenticated can read all variants"
on public.product_variants
for select
to authenticated
using (true);

create policy "Authenticated can insert variants"
on public.product_variants
for insert
to authenticated
with check (true);

create policy "Authenticated can update variants"
on public.product_variants
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete variants"
on public.product_variants
for delete
to authenticated
using (true);

/* variant_images: anon reads images of active variants only */

create policy "Anon can read images of active variants"
on public.variant_images
for select
to anon
using (
	exists (
		select 1
		from public.product_variants v
		where v.id = variant_images.variant_id
			and v.is_active = true
	)
);

create policy "Authenticated can read all variant images"
on public.variant_images
for select
to authenticated
using (true);

create policy "Authenticated can insert variant images"
on public.variant_images
for insert
to authenticated
with check (true);

create policy "Authenticated can update variant images"
on public.variant_images
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete variant images"
on public.variant_images
for delete
to authenticated
using (true);

/* variant_sizes: anon reads sizes of active variants only */

create policy "Anon can read sizes of active variants"
on public.variant_sizes
for select
to anon
using (
	exists (
		select 1
		from public.product_variants v
		where v.id = variant_sizes.variant_id
			and v.is_active = true
	)
);

create policy "Authenticated can read all variant sizes"
on public.variant_sizes
for select
to authenticated
using (true);

create policy "Authenticated can insert variant sizes"
on public.variant_sizes
for insert
to authenticated
with check (true);

create policy "Authenticated can update variant sizes"
on public.variant_sizes
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete variant sizes"
on public.variant_sizes
for delete
to authenticated
using (true);

commit;
