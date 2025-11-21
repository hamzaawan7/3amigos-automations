import { Link, usePage } from '@inertiajs/react';
import { getCustomStyles } from '@/utils/theme';

export default function BrandedNavLink({ href, children, icon: Icon }) {
    const { company } = usePage().props;
    const customStyles = getCustomStyles(company);
    const isActive = window.location.pathname === href || window.location.pathname.startsWith(href + '/');

    return (
        <Link
            href={href}
            className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
            style={{
                borderBottomColor: isActive ? customStyles.primaryColor : 'transparent',
                color: isActive ? customStyles.primaryColor : undefined
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = customStyles.primaryColor;
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                }
            }}
        >
            {Icon && <Icon className="h-5 w-5 mr-2" />}
            {children}
        </Link>
    );
}

