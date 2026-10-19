import {useQuery} from '@tanstack/react-query';
import {getVariantBySlugAction} from '@/shop/actions/variants/get-variant-by-slug.action';

export const useVariantBySlug = (slug: string | undefined) =>
	useQuery({
		queryKey: ['shop', 'variant', slug],
		queryFn: () => getVariantBySlugAction(slug ?? ''),
		enabled: Boolean(slug),
	});
