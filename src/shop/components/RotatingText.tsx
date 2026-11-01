import {useEffect, useRef, useState} from 'react';
import {TextGenerateEffect} from '@/components/ui/text-generate-effect';
import {cn} from '@/lib/utils';
import {
	DEFAULT_HOLD_MS,
	DURATION_S,
	EXIT_MS,
	STAGGER_S,
	getPhraseBuildMs,
} from '@/shop/lib/rotating-text';

interface RotatingTextProps {
	phrases: string[];
	holdMs?: number; // tiempo quieta, con la frase ya armada
	startDelayMs?: number; // retraso solo de la primera frase
	onStart?: () => void; // aviso cuando la primera frase empieza a mostrarse
	className?: string;
}

type Phase = 'waiting' | 'in' | 'out';

export const RotatingText = ({
	phrases,
	holdMs = DEFAULT_HOLD_MS,
	startDelayMs = 0,
	onStart,
	className,
}: RotatingTextProps) => {
	const [index, setIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>(
		startDelayMs > 0 ? 'waiting' : 'in',
	);

	const phrase = phrases[index] ?? '';
	const onStartRef = useRef(onStart);

	useEffect(() => {
		onStartRef.current = onStart;
	}, [onStart]);

	// 1. Espera inicial (solo la primera vez)
	useEffect(() => {
		if (phase !== 'waiting') return;
		const id = setTimeout(() => {
			onStartRef.current?.();
			setPhase('in');
		}, startDelayMs);
		return () => clearTimeout(id);
	}, [phase, startDelayMs]);

	// 2. La frase se arma; cuando termina, espera holdMs y empieza la salida
	useEffect(() => {
		if (phase !== 'in' || phrases.length < 2) return;
		const buildMs = getPhraseBuildMs(phrase);
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
				'select-none transition-all ease-out motion-reduce:transition-none',
				phase === 'out' ? 'opacity-0 blur-md' : 'opacity-100 blur-0',
			)}
			onCopy={(event) => event.preventDefault()}
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
