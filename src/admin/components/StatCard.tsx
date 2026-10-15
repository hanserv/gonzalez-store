// src/admin/pages/dashboard/components/StatCard.tsx
import type {LucideIcon} from 'lucide-react';
import {Card} from '@/components/ui/card';

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: number;
	hint?: string;
}

export const StatCard = ({icon: Icon, label, value, hint}: StatCardProps) => (
	<Card className='gap-3 py-5 shadow-none'>
		<div className='flex items-center justify-between gap-3 px-5'>
			<p className='truncate text-sm font-medium text-muted-foreground'>
				{label}
			</p>
			<Icon className='size-4 shrink-0 text-black' />
		</div>

		<div className='px-5'>
			<p className='text-3xl font-semibold tabular-nums tracking-tight'>
				{value.toLocaleString('es-DO')}
			</p>
			{hint && <p className='mt-1 text-xs text-muted-foreground'>{hint}</p>}
		</div>
	</Card>
);
