/*
	Storage policies for the product images bucket.

	IMPORTANT: replace 'product-images' with the real bucket name in the four
	policies below before running.

	The bucket must be public, because the app builds public URLs from the
	stored path. Public read does not need a SELECT policy on storage.objects.

	The SELECT policy below is required so that deleting an image works:
	depending on the Storage version, removing an object first locates the row
	in storage.objects. Without SELECT permission the batch delete silently
	removes nothing and returns an empty result (no error), which would leave
	orphaned files in the bucket.

	If the bucket already has policies, review them in Storage > Policies first
	to avoid duplicates or conflicts.
*/

create policy "Authenticated can read product images"
on storage.objects
for select
to authenticated
using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "Authenticated can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "Authenticated can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');
