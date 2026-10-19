import type {ShopFilterOption} from '@/shop/interfaces/catalog.interface';
import {supabase} from '@/supabase/supabase';

export const getShopBrandsAction = async (): Promise<ShopFilterOption[]> => {
	const {data, error} = await supabase.from('brands').select('id,name').order('name');

	if (error) throw error;

	return data;
};
