import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			boxShadow: {
				'pixel': 'var(--shadow-pixel)',
				'heavy': 'var(--shadow-heavy)',
				'glow': 'var(--shadow-glow)',
				'subtle': 'var(--shadow-subtle)'
			},
			fontFamily: {
				'pixel': ['Press Start 2P', 'monospace'],
				'sans': ['Inter', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pixel-bounce': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-3px)' }
				},
				'pixel-pulse': {
					'0%, 100%': { boxShadow: 'var(--shadow-pixel)' },
					'50%': { boxShadow: 'var(--shadow-glow)' }
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'10%': { transform: 'translate(-2px, 1px)' },
					'20%': { transform: 'translate(2px, -1px)' },
					'30%': { transform: 'translate(-1px, 2px)' },
					'40%': { transform: 'translate(1px, -1px)' },
					'50%': { transform: 'translate(0)' }
				},
				'scan-line': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100vw)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'pixel-bounce': 'pixel-bounce 0.8s ease-in-out infinite',
				'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite',
				'glitch': 'glitch 0.3s ease-in-out',
				'scan-line': 'scan-line 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
