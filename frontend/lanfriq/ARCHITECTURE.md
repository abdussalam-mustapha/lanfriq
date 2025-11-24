# Lanfriq Landing Page - Architecture Overview

## Project Structure

```
src/
├── assets/              # All images and static assets
├── components/
│   ├── layout/          # Layout components (Header, Footer)
│   ├── sections/        # Page sections (Hero, Features, etc.)
│   └── ui/              # Reusable UI components (Button, Card, Section)
├── context/             # React Context (ThemeContext)
├── App.jsx              # Main application component
├── App.css              # App-level styles
├── index.css            # Global styles and design tokens
└── main.jsx             # Application entry point
```

## Key Features

### 🎨 Global Theming System
- **ThemeContext**: Centralized theme management with light/dark modes
- **CSS Variables**: All colors, spacing, and design tokens defined in `index.css`
- **Persistent Theme**: User preference saved to localStorage
- **Seamless Switching**: All components automatically adapt to theme changes

### 🎯 Design Tokens (CSS Variables)
All design tokens are defined in `:root` and `:root[data-theme="dark"]`:
- Colors: `--color-primary`, `--color-background`, `--color-text-*`
- Spacing: `--spacing-xs` to `--spacing-3xl`
- Border Radius: `--radius-sm` to `--radius-xl`
- Transitions: `--transition-fast`, `--transition-base`, `--transition-slow`
- Shadows: `--shadow-sm` to `--shadow-xl`

### 🧩 Component Architecture

#### UI Components (Reusable)
- **Button**: Primary, secondary, ghost variants with multiple sizes
- **Card**: Default, elevated, and feature variants
- **Section**: Wrapper with consistent spacing and container management

#### Layout Components
- **Header**: Sticky navigation with theme toggle and navigation links
- **Footer**: Comprehensive footer with branding, links, and social media

#### Section Components
- **Hero**: Main landing section with CTA and partner logos
- **Features**: 6-card grid showcasing platform benefits
- **TargetAudience**: Three alternating sections for different user types
- **Statistics**: Key metrics display
- **HowItWorks**: Step-by-step process cards
- **CTA**: Final call-to-action section

## Theme Implementation

### How to Use Theme in Components
```jsx
import { useTheme } from '../../context/ThemeContext'

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  // Use theme-specific assets
  const image = theme === 'light' ? lightImage : darkImage
  
  return <div>...</div>
}
```

### Adding New Theme Variables
1. Add to `:root` in `index.css` for light mode
2. Add to `:root[data-theme="dark"]` for dark mode
3. Use `var(--your-variable)` in component CSS

## Responsive Design

All components are fully responsive with breakpoints:
- Desktop: > 968px
- Tablet: 768px - 968px
- Mobile: < 768px

## Performance Optimizations

- CSS custom properties for efficient theme switching
- Optimized image loading
- Smooth transitions with GPU acceleration
- Minimal re-renders with Context API

## Future Enhancements

- Add animations on scroll (AOS library)
- Implement mobile menu for navigation
- Add form validation for CTAs
- Integrate with backend API
- Add internationalization (i18n)

## Running the Project

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Design System

The entire design system is maintainable through CSS variables in `index.css`. To modify colors, spacing, or other design elements across the entire application, simply update the variables in the `:root` declarations.

## Best Practices Implemented

✅ Component-based architecture
✅ Separation of concerns
✅ Reusable UI components
✅ Global theme management
✅ CSS variables for maintainability
✅ Responsive design
✅ Semantic HTML
✅ Accessibility considerations
✅ Clean folder structure
✅ Consistent naming conventions
