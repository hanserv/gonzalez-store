import {useEffect, useState} from 'react';
import {TextGenerateEffect} from '@/components/ui/text-generate-effect';
import {cn} from '@/lib/utils';

interface RotatingTextProps {
	phrases: string[];
	holdMs?: number; // tiempo quieta, con la frase ya armada
	startDelayMs?: number; // retraso solo de la primera frase
	className?: string;
}

type Phase = 'waiting' | 'in' | 'out';

const DURATION_S = 0.5; // cuánto tarda cada letra en enfocarse
const STAGGER_S = 0.2; // desfase entre letras
const EXIT_MS = 500; // desvanecimiento al cambiar de frase

export const RotatingText = ({
	phrases,
	holdMs = 5000,
	startDelayMs = 0,
	className,
}: RotatingTextProps) => {
	const [index, setIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>(
		startDelayMs > 0 ? 'waiting' : 'in',
	);

	const phrase = phrases[index] ?? '';

	// 1. Espera inicial (solo la primera vez)
	useEffect(() => {
		if (phase !== 'waiting') return;
		const id = setTimeout(() => setPhase('in'), startDelayMs);
		return () => clearTimeout(id);
	}, [phase, startDelayMs]);

	// 2. La frase se arma; cuando termina, espera holdMs y empieza la salida
	useEffect(() => {
		if (phase !== 'in' || phrases.length < 2) return;
		const letterCount = phrase.replace(/\s/g, '').length;
		const buildMs = (DURATION_S + (letterCount - 1) * STAGGER_S) * 1000;
		const id = setTimeout(() => setPhase('out'), buildMs + holdMs);
		return () => clearTimeout(id);
	}, [phase, phrase, phrases.length, holdMs]);

	// 3. Se desvanece y cambia a la siguiente frase
	useEffect(() => {
		if (phase !== 'out') return;
		const id = setTimeout(() => {
			setIndex((prev) => (prev + 1) % phrases.length);
			setPhase('in');
		}, EXIT_MS);
		return () => clearTimeout(id);
	}, [phase, phrases.length]);

	return (
		<div
			className={cn(
				'transition-all ease-out motion-reduce:transition-none',
				phase === 'out' ? 'opacity-0 blur-md' : 'opacity-100 blur-0',
			)}
			// Solo la salida se anima; al entrar, la frase nueva aparece de inmediato
			style={{transitionDuration: phase === 'out' ? `${EXIT_MS}ms` : '0ms'}}
		>
			{phase === 'waiting' ? (
				// Reserva el espacio sin mostrarse, para que no salte el diseño
				<div className={cn('invisible', className)}>{phrase}</div>
			) : (
				<TextGenerateEffect
					key={index}
					words={phrase}
					duration={DURATION_S}
					staggerDelay={STAGGER_S}
					className={className}
				/>
			)}
		</div>
	);
};
