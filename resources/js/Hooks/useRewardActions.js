import { router } from '@inertiajs/react';
import { useCallback } from 'react';

export function useRewardActions() {
    const markAsPaid = useCallback((rewardId) => {
        if (!rewardId) {
            console.error('Invalid reward ID');
            return;
        }

        const confirmed = confirm(
            'Are you sure you want to mark this reward as paid? This action cannot be undone.'
        );

        if (!confirmed) {
            return;
        }

        router.post(
            route('admin.rewards.mark-paid', rewardId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Success message will be shown via flash message
                },
                onError: (errors) => {
                    console.error('Failed to mark reward as paid:', errors);
                    alert('Failed to update reward status. Please try again.');
                },
            }
        );
    }, []);

    return {
        markAsPaid,
    };
}

