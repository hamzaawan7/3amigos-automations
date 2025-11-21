/**
 * Theme utility for dynamic branding
 * Generates Tailwind CSS classes based on company configuration
 */

export const getThemeClasses = (company) => {
    const primary = company?.colors?.primary || 'indigo';
    const secondary = company?.colors?.secondary || 'purple';
    const accent = company?.colors?.accent || 'blue';

    return {
        // Button styles
        button: {
            primary: `bg-${primary}-600 hover:bg-${primary}-700 focus:ring-${primary}-500 text-white`,
            secondary: `bg-${secondary}-600 hover:bg-${secondary}-700 focus:ring-${secondary}-500 text-white`,
            accent: `bg-${accent}-600 hover:bg-${accent}-700 focus:ring-${accent}-500 text-white`,
            outline: `border-${primary}-300 text-${primary}-700 hover:bg-${primary}-50 focus:ring-${primary}-500`,
        },

        // Text colors
        text: {
            primary: `text-${primary}-600`,
            secondary: `text-${secondary}-600`,
            accent: `text-${accent}-600`,
            primaryDark: `text-${primary}-700`,
        },

        // Background colors
        bg: {
            primary: `bg-${primary}-600`,
            primaryLight: `bg-${primary}-50`,
            primaryDark: `bg-${primary}-700`,
            secondary: `bg-${secondary}-600`,
            secondaryLight: `bg-${secondary}-50`,
            accent: `bg-${accent}-50`,
            gradient: `bg-gradient-to-r from-${primary}-500 to-${secondary}-600`,
        },

        // Border colors
        border: {
            primary: `border-${primary}-500`,
            secondary: `border-${secondary}-500`,
            primaryLight: `border-${primary}-200`,
        },

        // Badge/Status colors
        badge: {
            primary: `bg-${primary}-100 text-${primary}-800 border-${primary}-200`,
            success: `bg-green-100 text-green-800 border-green-200`,
            warning: `bg-yellow-100 text-yellow-800 border-yellow-200`,
            danger: `bg-red-100 text-red-800 border-red-200`,
        },

        // Ring/Focus colors
        ring: {
            primary: `ring-${primary}-500`,
            secondary: `ring-${secondary}-500`,
        },
    };
};

/**
 * Get inline style for custom hex colors
 */
export const getCustomStyles = (company) => {
    return {
        primaryColor: company?.colors?.primary_hex || '#6366f1',
        secondaryColor: company?.colors?.secondary_hex || '#9333ea',
        accentColor: company?.colors?.accent_hex || '#3b82f6',
    };
};

/**
 * Generate dynamic button style
 */
export const getButtonStyle = (company, variant = 'primary') => {
    const styles = getCustomStyles(company);

    const variants = {
        primary: {
            backgroundColor: styles.primaryColor,
            borderColor: styles.primaryColor,
        },
        secondary: {
            backgroundColor: styles.secondaryColor,
            borderColor: styles.secondaryColor,
        },
        accent: {
            backgroundColor: styles.accentColor,
            borderColor: styles.accentColor,
        },
    };

    return variants[variant] || variants.primary;
};

