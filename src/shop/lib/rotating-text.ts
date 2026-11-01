export const DURATION_S = 0.5; // cuánto tarda cada letra en enfocarse
export const STAGGER_S = 0.2; // desfase entre letras
export const EXIT_MS = 500; // desvanecimiento al cambiar de frase
export const DEFAULT_HOLD_MS = 5000;

export const getPhraseBuildMs = (phrase: string) => {
	const letterCount = phrase.replace(/\s/g, '').length;

	return (DURATION_S + Math.max(letterCount - 1, 0) * STAGGER_S) * 1000;
};

// Tiempo hasta que la última frase del primer ciclo termina de escribirse
export const getRevealDelayMs = (
	phrases: string[],
	holdMs = DEFAULT_HOLD_MS,
) =>
	phrases.reduce((total, phrase, index) => {
		const isLast = index === phrases.length - 1;

		return total + getPhraseBuildMs(phrase) + (isLast ? 0 : holdMs + EXIT_MS);
	}, 0);
