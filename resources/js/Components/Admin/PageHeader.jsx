export default function PageHeader({ title, subtitle, icon, actions, customStyles }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1
                    className="text-3xl font-bold flex items-center gap-2"
                    style={{ color: customStyles?.primaryColor }}
                >
                    {icon && <span aria-hidden="true">{icon}</span>}
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}

