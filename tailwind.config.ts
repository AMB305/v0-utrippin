
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
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
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
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Lovable color palette
				lovable: {
					coral: 'hsl(var(--lovable-coral))',
					'coral-light': 'hsl(var(--lovable-coral-light))',
					peach: 'hsl(var(--lovable-peach))',
					lavender: 'hsl(var(--lovable-lavender))',
					mint: 'hsl(var(--lovable-mint))',
					sage: 'hsl(var(--lovable-sage))',
					cream: 'hsl(var(--lovable-cream))',
					'warm-gray': 'hsl(var(--lovable-warm-gray))'
				},
				travel: {
					blue: 'hsl(var(--travel-blue))',
					'blue-dark': 'hsl(var(--travel-blue-dark))',
					'blue-light': 'hsl(var(--travel-blue-light))',
					gold: 'hsl(var(--travel-gold))',
					navy: 'hsl(var(--travel-navy))',
					gray: 'hsl(var(--travel-gray))',
					light: 'hsl(var(--travel-light))'
				},
				// Mobile dark theme colors for hotel search
				mobile: {
					dark: '#1a1a1c',
					'card-bg': '#1c1c1e',
					'dark-grey': '#2c2c2e',
					'primary-teal': '#00bcd4',
					'text-primary': '#ffffff',
					'text-secondary': '#bdbdbd',
					'border-color': '#4a4a4c',
					'section-bg': '#1a1a1c'
				},
				tinderOrange: '#FF5864',
				uttippPurple: '#8A2BE2',
				sunsetYellow: '#FFB400',
				backgroundDark: '#121212'
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-warm': 'var(--gradient-warm)',
				'gradient-cool': 'var(--gradient-cool)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-overlay': 'var(--gradient-overlay)',
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-subtle': 'var(--gradient-subtle)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'large': 'var(--shadow-large)',
				'glow': 'var(--shadow-glow)',
				'elegant': 'var(--shadow-elegant)',
				'2xl-soft': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
			},
			transitionTimingFunction: {
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Inter', 'system-ui', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif']
			},
			fontSize: {
				'display-1': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
				'display-2': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem'
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
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'bounce-in': {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(275 85% 60% / 0.3)' },
					'50%': { boxShadow: '0 0 30px hsl(275 85% 60% / 0.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 1.5s infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'spin-slow': 'spin 6s linear infinite',
				'bounce-slow': 'bounce 4s infinite',
				'float': 'float 6s ease-in-out infinite'
			},
			utilities: {
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				}
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			addUtilities({
				'.hover-scale': {
					'@apply transition-transform duration-200 hover:scale-105': {},
				},
				'.border-b-3': {
					'border-bottom-width': '3px',
				}
			});
		}
	],
} satisfies Config;
