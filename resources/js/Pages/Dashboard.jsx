import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import BrandedButton from '@/Components/BrandedButton';
import { formatDateWithDay } from '@/utils/dateFormat';
import { getCustomStyles } from '@/utils/theme';
import {
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FireIcon,
    ChartBarIcon,
    UserGroupIcon,
    DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ employee, stats, recent_attendances, rewards, milestone_progress }) {
    const { company } = usePage().props;
    const customStyles = getCustomStyles(company);

    const getLeaveStatusColor = (percentage) => {
        if (percentage >= 70) return 'text-green-600';
        if (percentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getAttendanceColor = (rate) => {
        if (rate >= 90) return 'bg-green-100 text-green-800';
        if (rate >= 75) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="px-4 sm:px-0">
                <h1 className="text-3xl font-bold font-heading" style={{ color: customStyles.primaryColor }}>
                    Welcome back, {employee.name}!
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {company?.name || '3Amigos'} Attendance Dashboard
                </p>
                {(stats.checked_in_today || stats.wfh_pending_tasks || stats.show_attendance_warning) && (
                    <p className="mt-1 text-sm font-medium" style={{
                        color: stats.checked_in_today ? '#10b981' :
                               stats.wfh_pending_tasks ? '#f59e0b' : '#ef4444'
                    }}>
                        {stats.checked_in_today ? (
                            stats.check_in_type === 'office' ?
                                `✓ Checked in (Office) at ${stats.today_check_in_time}` :
                                `✓ Checked in (WFH) at ${stats.today_check_in_time} - Tasks submitted`
                        ) : stats.wfh_pending_tasks ? (
                            `⏰ Checked in (WFH) at ${stats.today_check_in_time} - Tasks pending`
                        ) : (
                            '⚠ You haven\'t checked in today'
                        )}
                    </p>
                )}
            </div>

            {/* Today's Status Banner */}
            {stats.wfh_pending_tasks ? (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DocumentChartBarIcon className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">
                                    WFH Tasks Pending
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Submit your daily tasks after 6:00 PM to complete attendance
                                </p>
                            </div>
                        </div>
                        <a href="/attendance">
                            <BrandedButton variant="primary" className="ml-4 flex-shrink-0 transition-all transform hover:scale-105">
                                Submit Tasks
                            </BrandedButton>
                        </a>
                    </div>
                </div>
            ) : !stats.checked_in_today && stats.show_attendance_warning && (
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-800">
                                    You haven't checked in today!
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Check in before 11:00 PM to avoid leave deduction
                                </p>
                            </div>
                        </div>
                        <a href="/attendance">
                            <BrandedButton variant="primary" className="ml-4 flex-shrink-0 transition-all transform hover:scale-105">
                                Check In
                            </BrandedButton>
                        </a>
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* This Week */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-green-500 shadow-lg">
                                <CheckCircleIcon className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-green-600">
                                {stats.week_present_days}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">This Week</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.week_total_days > 0 && stats.week_present_days === stats.week_total_days
                                ? 'Perfect attendance! 🎉'
                                : `${stats.week_present_days} of ${stats.week_total_days} days present`}
                        </p>
                    </div>
                </div>

                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-orange-500 shadow-lg">
                                <FireIcon className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-orange-600">
                                {stats.current_streak}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Streak</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.current_streak >= 10 ? '🔥 On fire!' : stats.current_streak >= 5 ? 'Keep going!' : 'Consecutive days'}
                        </p>
                    </div>
                </div>

                {/* Total Days Worked */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: customStyles.primaryColor }}>
                                <ChartBarIcon className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold" style={{ color: customStyles.primaryColor }}>
                                {stats.total_present}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Present</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Days worked overall
                        </p>
                    </div>
                </div>

                {/* Leave Balance */}
                <div className={`bg-gradient-to-br ${stats.leave_percentage >= 70 ? 'from-purple-50 to-pink-50' : stats.leave_percentage >= 40 ? 'from-yellow-50 to-orange-50' : 'from-red-50 to-pink-50'} overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl shadow-lg ${stats.leave_percentage >= 70 ? 'bg-purple-500' : stats.leave_percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                <CalendarIcon className="h-8 w-8 text-white" />
                            </div>
                            <span className={`text-3xl font-bold ${stats.leave_percentage >= 70 ? 'text-purple-600' : stats.leave_percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {employee.leave_balance}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Leave Balance</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.leave_percentage}% of {employee.annual_leave_quota} days
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Info Card */}
            <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">On-Time Check-ins</p>
                                <p className="text-2xl font-bold text-green-600">{stats.on_time_count}</p>
                                <p className="text-xs text-gray-500 mt-1">{stats.on_time_percentage}% on time</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Late Arrivals</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.late_count}</p>
                                <p className="text-xs text-gray-500 mt-1">{stats.late_count === 0 ? 'Perfect!' : 'Resets streak'}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <ClockIcon className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Longest Streak</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.longest_streak}</p>
                                <p className="text-xs text-gray-500 mt-1">Personal best</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FireIcon className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Best Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.current_streak} days</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <FireIcon className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earned Rewards */}
            {rewards && rewards.length > 0 && (
                <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-xl rounded-xl overflow-hidden border-2 border-yellow-300">
                    <div className="p-6 border-b border-yellow-200">
                        <h3 className="text-xl font-bold text-yellow-900 flex items-center">
                            🏆 Your Rewards & Achievements
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rewards.map((reward) => (
                                <div key={reward.id} className="bg-white rounded-lg p-4 shadow-md border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-4xl mr-3">{reward.milestone_icon}</span>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{reward.milestone_name}</h4>
                                                <p className="text-sm text-gray-500">{reward.achieved_date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">${reward.bonus_amount}</p>
                                            {reward.is_paid ? (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Paid</span>
                                            ) : (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Total Earned: <span className="font-bold text-green-600">${rewards.reduce((sum, r) => sum + parseFloat(r.bonus_amount), 0).toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Milestone Progress */}
            {milestone_progress && milestone_progress.length > 0 && (
                <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            🎯 Your Progress Towards Rewards
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Keep working to unlock these bonuses!</p>
                        {employee.employment_type !== 'full_time' || employee.employment_status !== 'permanent' ? (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-700">
                                    ℹ️ <strong>Note:</strong> Rewards are automatically earned for full-time permanent employees only.
                                    Keep up the great work and these will be available when you transition to permanent status!
                                </p>
                            </div>
                        ) : null}
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {milestone_progress.map((milestone) => (
                                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-3">{milestone.icon}</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                                                <p className="text-sm text-gray-500">{milestone.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-green-600">${milestone.bonus_amount}</p>
                                            <p className="text-xs text-gray-500">{milestone.currency}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Progress:</span>
                                            <span className="font-semibold" style={{ color: customStyles.primaryColor }}>
                                                {milestone.current_value} / {milestone.target_value}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${milestone.percentage}%`,
                                                    backgroundColor: milestone.percentage >= 80 ? '#10b981' :
                                                                   milestone.percentage >= 50 ? customStyles.primaryColor : '#6b7280'
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">{milestone.percentage}% complete</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Attendance */}
            <div className="mt-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Recent Attendance
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Last 10 days attendance record
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {recent_attendances.map((attendance, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {attendance.status === 'Present' ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDateWithDay(attendance.date)}
                                                </p>
                                                {attendance.check_in && (
                                                    <p className="text-sm text-gray-500">
                                                        Check-in: {attendance.check_in}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    attendance.status === 'Present'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {attendance.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

