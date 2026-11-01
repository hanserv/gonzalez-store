import {supabase} from '@/supabase/supabase';
import {toProvinceSalesError} from '@/province-sales/errors/province-sales.error';
import type {ProvinceSalesEntryInput} from '@/province-sales/interfaces/province-sales.interface';
import {prepareProvinceSalesEntryForSave} from '@/province-sales/mappers/province-sales.mapper';

export const createProvinceSalesEntryAction = async (
	input: ProvinceSalesEntryInput,
): Promise<void> => {
	const {error} = await supabase
		.from('province_sales_entries')
		.insert(prepareProvinceSalesEntryForSave(input));

	if (error) throw toProvinceSalesError(error);
};
