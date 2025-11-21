import { usePage } from '@inertiajs/react';
import { getButtonStyle } from '@/utils/theme';

export default function BrandedButton({
    children,
    variant = 'primary',
    type = 'button',
    disabled = false,
    className = '',
    icon: Icon,
    ...props
}) {
    const { company } = usePage().props;
    const buttonStyle = getButtonStyle(company, variant);

    const baseClasses = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            style={{
                backgroundColor: disabled ? '#9ca3af' : buttonStyle.backgroundColor,
                borderColor: disabled ? '#9ca3af' : buttonStyle.borderColor,
            }}
            {...props}
        >
            {Icon && <Icon className="h-5 w-5 mr-2" />}
            {children}
        </button>
    );
}

