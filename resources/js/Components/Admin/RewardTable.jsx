import RewardTableRow from './RewardTableRow';

const TABLE_HEADERS = [
    { label: 'Employee', key: 'employee' },
    { label: 'Milestone', key: 'milestone' },
    { label: 'Achievement', key: 'achievement' },
    { label: 'Bonus', key: 'bonus' },
    { label: 'Status', key: 'status' },
    { label: 'Action', key: 'action' },
];

export default function RewardTable({ rewards, onMarkPaid }) {
    const hasRewards = rewards && rewards.length > 0;

    if (!hasRewards) {
        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-12 text-center">
                    <p className="text-gray-500 text-lg">No rewards earned yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Rewards will appear here when employees achieve milestones
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {TABLE_HEADERS.map((header) => (
                                <th
                                    key={header.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rewards.map((reward) => (
                            <RewardTableRow
                                key={reward.id}
                                reward={reward}
                                onMarkPaid={onMarkPaid}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

