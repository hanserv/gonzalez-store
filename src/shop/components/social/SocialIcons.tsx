import type {ComponentType} from 'react';
import type {SocialName} from '@/shop/lib/social-links';

interface IconProps {
	className?: string;
}

// lucide-react dropped brand icons, so the three social marks live here as
// inline SVGs with the same stroke look used across the rest of the UI
const InstagramIcon = ({className}: IconProps) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
		aria-hidden='true'
	>
		<rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
		<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
		<path d='M17.5 6.5h.01' />
	</svg>
);

const WhatsAppIcon = ({className}: IconProps) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
		aria-hidden='true'
	>
		<path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
	</svg>
);

// The TikTok note: a stem with an open loop and the small flag on top
const TikTokIcon = ({className}: IconProps) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
		aria-hidden='true'
	>
		<path d='M14 2.5v12.25a3.75 3.75 0 1 1-3.75-3.75' />
		<path d='M14 2.5c.3 1.9 1.8 3.1 4 3.2' />
	</svg>
);

export const SOCIAL_ICONS: Record<SocialName, ComponentType<IconProps>> = {
	Instagram: InstagramIcon,
	WhatsApp: WhatsAppIcon,
	TikTok: TikTokIcon,
};
