'use client';

import { ArrowRight } from 'lucide-react';

type GoogleAuthButtonProps = {
	href: string;
	label: string;
	subtitle?: string;
};

export function GoogleAuthButton({ href, label, subtitle }: GoogleAuthButtonProps) {
	return (
		<a
			href={href}
			className="group relative flex w-full flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 text-left text-[#3c4043] shadow-[0_10px_28px_rgba(60,64,67,.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#dadce0] hover:shadow-[0_14px_34px_rgba(60,64,67,.16)] dark:border-white/10 dark:bg-white/5 dark:text-white sm:flex-nowrap"
		>
			<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(60,64,67,.08)]">
				<svg viewBox="0 0 48 48" aria-hidden="true" className="h-6 w-6">
					<path fill="#4285F4" d="M24 9.5c3.7 0 7.1 1.3 9.7 3.7l7.3-7.3C36.5 2.7 30.7 0 24 0 14.8 0 6.9 5.2 3 12.8l8.5 6.6C13.2 14.3 18.1 9.5 24 9.5z" />
					<path fill="#34A853" d="M46.4 24.5c0-1.5-.1-2.6-.4-3.8H24v7.1h12.8c-.3 2-1.6 5-4.6 7l7.1 5.5c4.2-3.9 7.1-9.7 7.1-15.8z" />
					<path fill="#FBBC05" d="M11.5 28.6c-1-2.9-1-6.1 0-9l-8.5-6.6C.5 17.6 0 20.7 0 24c0 3.3.5 6.4 3 11l8.5-6.4z" />
					<path fill="#EA4335" d="M24 48c6.7 0 12.3-2.2 16.4-6l-7.1-5.5c-2 1.4-4.8 2.4-9.3 2.4-5.9 0-10.8-4.8-12.5-10.8l-8.5 6.6C6.9 42.8 14.8 48 24 48z" />
				</svg>
			</span>
			<span className="min-w-0 flex-1">
				<span className="block text-sm font-medium tracking-[.01em] text-[#3c4043] dark:text-white">{label}</span>
				{subtitle && <span className="mt-1 block text-xs leading-5 text-[#5f6368] dark:text-white/55">{subtitle}</span>}
			</span>
			<span className="grid h-10 w-10 place-items-center rounded-full border border-transparent bg-[#f8f9fa] text-[#5f6368] transition group-hover:bg-[#f1f3f4] dark:bg-white/5 dark:text-white/80">
				<ArrowRight size={16} />
			</span>
		</a>
	);
}