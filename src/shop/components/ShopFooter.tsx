import {Link} from 'react-router';
import {CustomLogo} from '@/components/custom/CustomLogo';
import {navItems} from '@/shop/lib/nav-items';
import {SOCIAL_LINKS} from '@/shop/lib/social-links';
import {SOCIAL_ICONS} from '@/shop/components/social/SocialIcons';

const CURRENT_YEAR = new Date().getFullYear();

const columnTitleClassName =
	'text-xs font-semibold uppercase tracking-[0.2em] text-gonzalez-golden';
const linkClassName =
	'text-sm text-white/70 transition-colors hover:text-white';

export const ShopFooter = () => {
	return (
		<footer className='bg-black px-6 text-white'>
			<div className='mx-auto max-w-6xl py-14'>
				<div className='grid gap-10 md:grid-cols-[1.5fr_auto_auto] md:gap-16'>
					{/* Brand */}
					<div>
						<CustomLogo title='Gonzalez Peña' logoSrc='/gonzalez-logo-white.png' />
						<div className='mt-4 h-1 w-12 bg-gonzalez-red' />
						<p className='mt-4 max-w-xs text-sm font-semibold uppercase leading-relaxed tracking-wide text-white/80'>
							Pasos pequeños. Huellas gigantes.
						</p>
						<p className='mt-1 text-sm font-semibold uppercase tracking-wide text-white/50'>
							Persiste e Insiste.
						</p>
					</div>

					{/* Navigation */}
					<nav aria-label='Navegación del pie de página'>
						<h2 className={columnTitleClassName}>Navegación</h2>
						<ul className='mt-4 space-y-2'>
							{navItems.map(({label, to}: {label: string; to: string}) => (
								<li key={to}>
									<Link to={to} className={linkClassName}>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Social */}
					{SOCIAL_LINKS.length > 0 && (
						<div>
							<h2 className={columnTitleClassName}>Síguenos</h2>
							<ul className='mt-4 flex items-center gap-3'>
								{SOCIAL_LINKS.map(({name, href}) => {
									const Icon = SOCIAL_ICONS[name];

									return (
										<li key={name}>
											<a
												href={href}
												target='_blank'
												rel='noopener noreferrer'
												aria-label={name}
												className='inline-flex rounded-full border border-white/15 p-2.5 text-white/70 transition-colors hover:border-gonzalez-golden hover:text-gonzalez-golden'
											>
												<Icon className='size-5' />
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</div>

				{/* Bottom bar */}
				<div className='mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row'>
					<p>
						© {CURRENT_YEAR} Gonzalez Peña. Todos los derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
};
