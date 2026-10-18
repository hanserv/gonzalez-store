import type {ShopFilterOption} from '@/shop/interfaces/catalog.interface';
import {supabase} from '@/supabase/supabase';

export const getShopCategoriesAction = async (): Promise<ShopFilterOption[]> => {
	const {data, error} = await supabase
		.from('categories')
		.select('id,name')
		.order('name');

	if (error) throw error;

	return data;
};
