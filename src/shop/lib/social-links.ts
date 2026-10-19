export type SocialName = 'Instagram' | 'WhatsApp' | 'TikTok';

export interface SocialLink {
	name: SocialName;
	href: string;
}

// They come from the environment so the handles are never hardcoded in the repo
const instagramUser = String(import.meta.env.VITE_INSTAGRAM_USER ?? '').trim();
const tiktokUser = String(import.meta.env.VITE_TIKTOK_USER ?? '').trim();
// wa.me only accepts digits, so spaces, dashes and the country plus are dropped
const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(
	/\D/g,
	'',
);

export const SOCIAL_LINKS: SocialLink[] = [
	...(instagramUser
		? [{name: 'Instagram' as SocialName, href: `https://www.instagram.com/${instagramUser}/`}]
		: []),
	...(whatsappNumber
		? [{name: 'WhatsApp' as SocialName, href: `https://wa.me/${whatsappNumber}`}]
		: []),
	...(tiktokUser
		? [{name: 'TikTok' as SocialName, href: `https://www.tiktok.com/@${tiktokUser}`}]
		: []),
];
