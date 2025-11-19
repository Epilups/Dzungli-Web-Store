/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Green color palette - professional and easy on the eyes
				primary: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#145231'
				},
				accent: {
					50: '#f0fef9',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#134e4a',
					900: '#0f3431'
				},
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717'
				},
				success: '#36b37e',
				warning: '#f5cd47',
				error: '#f87462'
			},
			spacing: {
				'128': '32rem',
				'144': '36rem'
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem'
			},
			boxShadow: {
				'sm-atlassian': '0 1px 1px rgba(9, 30, 66, 0.13), 0 0 1px rgba(9, 30, 66, 0.15)',
				'atlassian': '0 1px 1px rgba(9, 30, 66, 0.13), 0 4px 8px -2px rgba(9, 30, 66, 0.13)',
				'lg-atlassian': '0 4px 8px -2px rgba(9, 30, 66, 0.13), 0 12px 24px -4px rgba(9, 30, 66, 0.13)',
				'xl-atlassian': '0 20px 40px -8px rgba(9, 30, 66, 0.25)'
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif']
			},
			fontSize: {
				'xs': ['12px', '16px'],
				'sm': ['14px', '20px'],
				'base': ['16px', '24px'],
				'lg': ['18px', '28px'],
				'xl': ['20px', '28px'],
				'2xl': ['24px', '32px'],
				'3xl': ['29px', '36px'],
				'4xl': ['35px', '40px']
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in',
				'slide-in': 'slideIn 0.3s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideIn: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			}
		}
	},
	plugins: []
};
