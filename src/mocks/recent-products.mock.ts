import type {RecentProduct} from '@/admin/interfaces/dashboard.interface';

export const recentProductsMock: RecentProduct[] = [
	{
		id: '1',
		name: 'Lamelo ball',
		category: 'Calzado',
		price: 3500,
		isActive: true,
		createdAt: '2026-10-10T14:30:00Z',
	},
	{
		id: '2',
		name: 'Camiseta Oversize Negra',
		category: 'Camisetas',
		price: 1200,
		isActive: true,
		createdAt: '2026-10-09T09:15:00Z',
	},
	{
		id: '3',
		name: 'Jogger Cargo Beige',
		category: 'Pantalones',
		price: 2400,
		isActive: false,
		createdAt: '2026-10-08T18:00:00Z',
	},
	{
		id: '4',
		name: 'Gorra Clásica Roja',
		category: 'Accesorios',
		price: 850,
		isActive: true,
		createdAt: '2026-10-07T11:45:00Z',
	},
	{
		id: '5',
		name: 'Sandalias Confort',
		category: 'Calzado',
		price: 1800,
		isActive: true,
		createdAt: '2026-10-06T16:20:00Z',
	},
];
