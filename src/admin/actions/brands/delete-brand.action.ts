import {BrandError, toBrandError} from '@/admin/errors/brand.error';
import {supabase} from '@/supabase/supabase';

export const deleteBrandAction = async (id: string): Promise<void> => {
	const {data, error} = await supabase
		.from('brands')
		.delete()
		.eq('id', id)
		.select('id');

	if (error) throw toBrandError(error);

	// Si el id no existe o RLS lo bloquea, Supabase devuelve 0 filas
	if (data.length === 0) throw new BrandError('not_found');
};
