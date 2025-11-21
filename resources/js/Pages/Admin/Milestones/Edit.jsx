import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import { getCustomStyles } from '@/utils/theme';

export default function Edit({ milestone }) {
    const { company } = usePage().props;
    const customStyles = getCustomStyles(company);

    const { data, setData, put, processing, errors } = useForm({
        name: milestone.name,
        description: milestone.description,
        type: milestone.type,
        target_value: milestone.target_value,
        bonus_amount: milestone.bonus_amount,
        currency: milestone.currency,
        is_active: milestone.is_active,
        icon: milestone.icon || '🏆',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.milestones.update', milestone.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Milestone" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        href={route('admin.milestones.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Milestones
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold" style={{ color: customStyles.primaryColor }}>
                            Edit Milestone
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Update milestone details and bonus amounts</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Milestone Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Milestone Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="streak">Consecutive Days Streak</option>
                                <option value="total_days">Total Days Worked</option>
                                <option value="attendance_rate">Attendance Rate (%)</option>
                                <option value="on_time_rate">On-Time Rate (%)</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        {/* Target Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Value <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.target_value}
                                onChange={(e) => setData('target_value', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                min="1"
                            />
                            {errors.target_value && <p className="mt-1 text-sm text-red-600">{errors.target_value}</p>}
                        </div>

                        {/* Bonus Amount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bonus Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.bonus_amount}
                                    onChange={(e) => setData('bonus_amount', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    min="0"
                                />
                                {errors.bonus_amount && <p className="mt-1 text-sm text-red-600">{errors.bonus_amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="PKR">PKR (Rs)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                                {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
                            </div>
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon (Emoji)
                            </label>
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                maxLength="10"
                            />
                            {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Active
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Link
                                href={route('admin.milestones.index')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: customStyles.primaryColor }}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

