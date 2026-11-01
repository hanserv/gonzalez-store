import {Crown, Home, MapPin, ShoppingBag, Tags} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export interface MenuItem {
	icon: LucideIcon;
	label: string;
	to: string;
	end?: boolean;
}

export const menuItems: MenuItem[] = [
	{icon: Home, label: 'Dashboard', to: '/admin', end: true},
	{icon: Tags, label: 'Categorías', to: '/admin/categories'},
	{icon: Crown, label: 'Marcas', to: '/admin/brands'},
	{icon: ShoppingBag, label: 'Productos', to: '/admin/products'},
	{icon: MapPin, label: 'Ventas por provincia', to: '/admin/sales'},
];
