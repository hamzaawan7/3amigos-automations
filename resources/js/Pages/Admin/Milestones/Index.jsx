import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import { getCustomStyles } from '@/utils/theme';
import { formatCurrency } from '@/utils/currency';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ milestones }) {
    const { company } = usePage().props;
    const customStyles = getCustomStyles(company);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this milestone?')) {
            router.delete(route('admin.milestones.destroy', id));
        }
    };

    const handleToggle = (id) => {
        router.post(route('admin.milestones.toggle', id));
    };

    const getTypeLabel = (type) => {
        const labels = {
            'streak': 'Consecutive Days',
            'total_days': 'Total Days Worked',
            'attendance_rate': 'Attendance Rate %',
            'on_time_rate': 'On-Time Rate %'
        };
        return labels[type] || type;
    };

    return (
        <AppLayout>
            <Head title="Milestones & Rewards" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: customStyles.primaryColor }}>
                            🏆 Performance Milestones
                        </h1>
                        <p className="text-gray-600 mt-1">Manage employee reward milestones and bonuses</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={route('admin.rewards.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            View Rewards
                        </Link>
                        <Link
                            href={route('admin.milestones.create')}
                            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90"
                            style={{ backgroundColor: customStyles.primaryColor }}
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Milestone
                        </Link>
                    </div>
                </div>

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.id}
                            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                                milestone.is_active ? 'border-green-300' : 'border-gray-300'
                            }`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-4xl mr-3">{milestone.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{milestone.name}</h3>
                                            <p className="text-xs text-gray-500">{getTypeLabel(milestone.type)}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            milestone.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {milestone.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Target:</span>
                                        <span className="font-semibold text-gray-900">{milestone.target_value}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Bonus:</span>
                                        <span className="font-bold text-green-600">
                                            {formatCurrency(milestone.currency, milestone.bonus_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Earned by:</span>
                                        <span className="font-semibold text-blue-600">{milestone.earned_count} employees</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => handleToggle(milestone.id)}
                                        className={`flex-1 inline-flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium ${
                                            milestone.is_active
                                                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                        }`}
                                    >
                                        {milestone.is_active ? (
                                            <>
                                                <XMarkIcon className="h-4 w-4 mr-1" />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-1" />
                                                Enable
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href={route('admin.milestones.edit', milestone.id)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(milestone.id)}
                                        disabled={milestone.earned_count > 0}
                                        className={`px-3 py-2 border border-red-300 rounded-md text-sm font-medium ${
                                            milestone.earned_count > 0
                                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                : 'text-red-700 bg-white hover:bg-red-50'
                                        }`}
                                        title={milestone.earned_count > 0 ? 'Cannot delete - already earned by employees' : 'Delete milestone'}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {milestones.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">No milestones created yet</p>
                        <Link
                            href={route('admin.milestones.create')}
                            className="inline-flex items-center px-6 py-3 rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90"
                            style={{ backgroundColor: customStyles.primaryColor }}
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Your First Milestone
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

