import {RotatingText} from '@/shop/components/RotatingText';

const leftPhrases = ['Pasos pequeños.', 'Huellas gigantes.'];
const rightPhrases = ['Persiste e Insiste.'];

const phraseClassName =
	'text-2xl font-extrabold uppercase leading-tight tracking-tight text-neutral-950 sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl';

export const HeroSection = () => (
	<section className='flex min-h-svh flex-col bg-gray-50 px-6 pt-28 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:pt-0'>
		{/* Móvil y tablet: las dos frases juntas. En escritorio el contenedor desaparece y cada frase es una columna */}
		<div className='flex flex-1 flex-col items-center justify-center gap-1 text-center lg:contents'>
			{/* Izquierda */}
			<div className='flex flex-col items-center justify-center lg:order-1 lg:items-end lg:text-right'>
				<div role='heading' aria-level={2}>
					<RotatingText phrases={leftPhrases} className={phraseClassName} />
				</div>
				<div className='hidden h-1 w-12 bg-gonzalez-red lg:mt-4 lg:block' />
			</div>

			{/* Derecha */}
			<div className='flex flex-col items-center justify-center lg:order-3 lg:items-start lg:text-left'>
				<div role='heading' aria-level={2}>
					<RotatingText
						phrases={rightPhrases}
						className={phraseClassName}
						startDelayMs={2600}
					/>
				</div>
				<div className='mt-3 h-1 w-12 bg-gonzalez-red lg:mt-4' />
			</div>
		</div>

		{/* Foto: altura fija, anclada al borde inferior */}
		<div className='flex h-[50svh] items-end justify-center sm:h-[56svh] lg:order-2 lg:h-[88vh] lg:self-end'>
			<img
				src='/samuel-no-background.png'
				alt='Dueño de la tienda sosteniendo unos tenis'
				draggable={false}
				onDragStart={(event) => event.preventDefault()}
				onMouseDown={(event) => {
					if (event.button === 0) event.preventDefault();
				}}
				className='h-full w-auto max-w-full select-none object-contain object-bottom'
			/>
		</div>
	</section>
);
