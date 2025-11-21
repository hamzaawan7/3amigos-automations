import { CheckIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/currency';

export default function RewardTableRow({ reward, onMarkPaid }) {
    const renderPaymentStatus = () => {
        if (reward.is_paid) {
            return (
                <div>
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{reward.paid_date}</div>
                </div>
            );
        }

        return (
            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
            </span>
        );
    };

    const renderActionButton = () => {
        if (reward.is_paid) {
            return null;
        }

        return (
            <button
                onClick={() => onMarkPaid(reward.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                aria-label={`Mark reward for ${reward.employee_name} as paid`}
            >
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark Paid
            </button>
        );
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {reward.employee_name}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                        {reward.milestone_icon}
                    </span>
                    <span className="text-sm text-gray-900">
                        {reward.milestone_name}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{reward.achieved_date}</div>
                <div className="text-xs text-gray-500">
                    Value: {reward.achieved_value}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-green-600">
                    {formatCurrency(reward.currency, reward.bonus_amount)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {renderPaymentStatus()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {renderActionButton()}
            </td>
        </tr>
    );
}

