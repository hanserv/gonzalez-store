import {Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface DashboardErrorCardProps {
	message: string;
	onRetry: () => void;
	isRetrying?: boolean;
}

export const DashboardErrorCard = ({
	message,
	onRetry,
	isRetrying,
}: DashboardErrorCardProps) => (
	<div className='rounded-xl border border-gray-200 bg-white p-10 text-center'>
		<p className='mb-3 text-sm text-muted-foreground'>{message}</p>
		<Button
			variant='outline'
			size='sm'
			onClick={onRetry}
			disabled={isRetrying}
		>
			{isRetrying && <Loader2 className='animate-spin' />}
			Reintentar
		</Button>
	</div>
);
