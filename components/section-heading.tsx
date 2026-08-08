export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
	return (
		<div className="mb-8 max-w-xl animate-fade-in">
			<p className="eyebrow">{eyebrow}</p>
			<h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{title}</h2>
			{copy && <p className="mt-3 text-sm leading-6 text-ink/60 dark:text-white/60">{copy}</p>}
		</div>
	);
}
