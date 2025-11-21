import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { getCustomStyles } from '@/utils/theme';
import { useRewardActions } from '@/Hooks/useRewardActions';
import PageHeader from '@/Components/Admin/PageHeader';
import RewardTable from '@/Components/Admin/RewardTable';
import Pagination from '@/Components/Admin/Pagination';

/**
 * Rewards Page Component
 *
 * Displays earned rewards and allows admins to mark them as paid.
 * Follows SOLID principles with separated concerns:
 * - Single Responsibility: Each component handles one specific task
 * - Open/Closed: Easy to extend without modifying existing code
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 */
export default function Rewards({ rewards }) {
    const { company } = usePage().props;
    const customStyles = getCustomStyles(company);
    const { markAsPaid } = useRewardActions();

    const rewardsList = rewards?.data || [];
    const paginationLinks = rewards?.links || [];

    const renderBackButton = () => (
        <Link
            href={route('admin.milestones.index')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
            ← Back to Milestones
        </Link>
    );

    return (
        <AppLayout>
            <Head title="Earned Rewards" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader
                    title="Earned Rewards"
                    subtitle="Track and manage employee bonus payments"
                    icon="💰"
                    actions={renderBackButton()}
                    customStyles={customStyles}
                />

                <RewardTable
                    rewards={rewardsList}
                    onMarkPaid={markAsPaid}
                />

                <Pagination links={paginationLinks} />
            </div>
        </AppLayout>
    );
}

