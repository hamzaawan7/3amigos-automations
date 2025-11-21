import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-6 flex justify-center gap-2" aria-label="Pagination">
            {links.map((link, index) => {
                const isDisabled = !link.url;
                const isActive = link.active;

                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        disabled={isDisabled}
                        preserveScroll
                        className={`
                            px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        aria-label={
                            link.label.includes('Previous') ? 'Previous page' :
                            link.label.includes('Next') ? 'Next page' :
                            `Page ${link.label}`
                        }
                        aria-current={isActive ? 'page' : undefined}
                    />
                );
            })}
        </nav>
    );
}

