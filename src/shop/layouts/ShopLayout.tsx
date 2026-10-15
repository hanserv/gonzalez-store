import {Outlet} from 'react-router';
import {ShopHeader} from '../components/ShopHeader';

export const ShopLayout = () => {
	return (
		<>
			<ShopHeader
				backgroundColor='#000000'
				textColor='#ffffff'
				position='absolute'
			/>
			<Outlet />
		</>
	);
};
