interface Props {
	title: string;
	subtitle: string;
}

export const AdminTitle = ({title, subtitle}: Props) => {
	return (
		<div className='mb-0'>
			<h1 className='text-2xl font-bold'>{title}</h1>
			<p className='text-sm text-muted-foreground'>{subtitle}</p>
		</div>
	);
};
