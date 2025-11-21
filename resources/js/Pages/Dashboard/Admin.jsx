import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { getCustomStyles } from '@/utils/theme';
import { formatDate } from '@/utils/dateFormat';
import {
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    HomeIcon,
    ClockIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function Admin({ stats, recent_activity, low_leave_balance, top_streaks }) {
    const { company, auth } = usePage().props;
    const customStyles = getCustomStyles(company);

    const getAttendanceRateColor = (rate) => {
        if (rate >= 90) return { bg: '#10b981', text: '#ffffff' };
        if (rate >= 75) return { bg: '#f59e0b', text: '#ffffff' };
        return { bg: '#ef4444', text: '#ffffff' };
    };

    const rateColors = getAttendanceRateColor(stats.attendance_rate_today);
    const weekRateColors = getAttendanceRateColor(stats.week_attendance_rate);
    const monthRateColors = getAttendanceRateColor(stats.month_attendance_rate);

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading" style={{ color: customStyles.primaryColor }}>
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {company?.name || '3Amigos'} - Overview & Management
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, {auth.user.name}
                </p>
                {stats.is_weekend && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-300">
                        <span className="text-xs font-medium text-blue-800">
                            📅 Weekend Mode - Attendance tracking paused
                        </span>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Total Employees */}
                <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow border-t-4" style={{ borderTopColor: customStyles.primaryColor }}>
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: customStyles.primaryColor + '20' }}>
                                <UserGroupIcon className="h-8 w-8" style={{ color: customStyles.primaryColor }} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Employees
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {stats.total_employees}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Present Today */}
                <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Present Today
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-3xl font-bold text-green-600">
                                            {stats.present_today}
                                        </div>
                                        <div className="ml-2 text-sm text-gray-500">
                                            / {stats.total_employees}
                                        </div>
                                    </dd>
                                    <dd className="text-xs text-gray-400 mt-1 space-y-0.5">
                                        {stats.today_office > 0 && (
                                            <div>🏢 {stats.today_office} office</div>
                                        )}
                                        {stats.today_wfh > 0 && (
                                            <div>🏠 {stats.today_wfh} work from home</div>
                                        )}
                                        {stats.today_late > 0 && (
                                            <div className="text-orange-500">⚠️ {stats.today_late} late arrivals</div>
                                        )}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Absent Today */}
                <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-lg bg-red-100">
                                <XCircleIcon className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Absent Today
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-3xl font-bold text-red-600">
                                            {stats.absent_today}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Rate */}
                <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow border-t-4" style={{ borderTopColor: customStyles.accentColor }}>
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: customStyles.accentColor + '20' }}>
                                <ChartBarIcon className="h-8 w-8" style={{ color: customStyles.accentColor }} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Today's Rate
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-3xl font-bold" style={{ color: rateColors.bg }}>
                                            {stats.attendance_rate_today}%
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 mb-8">
                {/* This Week */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">This Week (Weekdays)</h3>
                                <p className="text-3xl font-bold mt-1" style={{ color: weekRateColors.bg }}>
                                    {stats.week_attendance_rate}%
                                </p>
                            </div>
                            <div className="p-3 rounded-full" style={{ backgroundColor: customStyles.primaryColor + '20' }}>
                                <CalendarDaysIcon className="h-8 w-8" style={{ color: customStyles.primaryColor }} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <div>{stats.week_attendances} check-ins</div>
                            <div>{stats.weekday_count_this_week} weekdays so far</div>
                            {stats.week_late_count > 0 && (
                                <div className="text-orange-500">{stats.week_late_count} late arrivals</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* This Month */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">This Month (Weekdays)</h3>
                                <p className="text-3xl font-bold mt-1" style={{ color: monthRateColors.bg }}>
                                    {stats.month_attendance_rate}%
                                </p>
                            </div>
                            <div className="p-3 rounded-full" style={{ backgroundColor: customStyles.secondaryColor + '20' }}>
                                <ArrowTrendingUpIcon className="h-8 w-8" style={{ color: customStyles.secondaryColor }} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <div>{stats.month_attendances} check-ins</div>
                            <div>{stats.weekday_count_this_month} weekdays so far</div>
                        </div>
                    </div>
                </div>

                {/* WFH Pending Tasks */}
                {stats.wfh_pending_tasks > 0 && (
                    <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-orange-400">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">WFH Tasks Pending</h3>
                                    <p className="text-3xl font-bold text-orange-600 mt-1">
                                        {stats.wfh_pending_tasks}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-orange-100">
                                    <HomeIcon className="h-8 w-8 text-orange-600" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">Awaiting task submission</p>
                        </div>
                    </div>
                )}

                {/* Pending Exceptions */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">
                                    {stats.pending_exceptions}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-100">
                                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        {stats.pending_exceptions > 0 && (
                            <Link
                                href="/admin/work-exceptions"
                                className="text-xs font-medium inline-flex items-center"
                                style={{ color: customStyles.primaryColor }}
                            >
                                Review now →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6 mb-8" style={{ borderLeft: `4px solid ${customStyles.primaryColor}` }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/employees"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <UserGroupIcon className="h-6 w-6 mr-3" style={{ color: customStyles.primaryColor }} />
                        <span className="font-medium text-gray-900">Manage Employees</span>
                    </Link>
                    <Link
                        href="/admin/work-exceptions"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <CalendarDaysIcon className="h-6 w-6 mr-3" style={{ color: customStyles.secondaryColor }} />
                        <span className="font-medium text-gray-900">Work Exceptions</span>
                    </Link>
                    <Link
                        href="/employees"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChartBarIcon className="h-6 w-6 mr-3" style={{ color: customStyles.accentColor }} />
                        <span className="font-medium text-gray-900">View Reports</span>
                    </Link>
                    <Link
                        href="/employees/create"
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <UserGroupIcon className="h-6 w-6 mr-3 text-green-600" />
                        <span className="font-medium text-gray-900">Add Employee</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performers */}
                {top_streaks && top_streaks.length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 shadow-lg rounded-lg overflow-hidden border-2 border-orange-300">
                        <div className="px-6 py-4 border-b border-orange-200 bg-orange-100">
                            <div className="flex items-center">
                                <FireIcon className="h-6 w-6 text-orange-600 mr-2" />
                                <h3 className="text-lg font-semibold text-orange-900">
                                    Top Performers (Active Streaks)
                                </h3>
                            </div>
                        </div>
                        <div className="divide-y divide-orange-100">
                            {top_streaks.map((employee, index) => (
                                <div key={employee.id} className="px-6 py-4 hover:bg-white transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔥'}
                                            </span>
                                            <Link
                                                href={`/employees/${employee.id}`}
                                                className="text-sm font-medium text-gray-900 hover:underline"
                                            >
                                                {employee.name}
                                            </Link>
                                        </div>
                                        <span className="px-3 py-1 text-sm font-bold rounded-full bg-orange-200 text-orange-900">
                                            {employee.streak} days 🔥
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: customStyles.primaryColor + '10' }}>
                        <h3 className="text-lg font-semibold" style={{ color: customStyles.primaryColor }}>
                            Recent Check-ins
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {recent_activity.length > 0 ? (
                            recent_activity.map((activity, index) => (
                                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {activity.is_late ? (
                                                <ClockIcon className="h-5 w-5 text-orange-500 mr-3" />
                                            ) : (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                                            )}
                                            <div>
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {activity.employee_name}
                                                    </p>
                                                    {activity.is_wfh && (
                                                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                            WFH
                                                        </span>
                                                    )}
                                                    {activity.is_late && (
                                                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                                                            Late {activity.late_by_minutes}m
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(activity.date)} at {activity.check_in}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Leave Balance Alert */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                                <h3 className="text-lg font-semibold text-yellow-900">
                                    Low Leave Balance
                                </h3>
                            </div>
                            <span className="text-xs text-yellow-700">
                                {low_leave_balance.length} employees
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {low_leave_balance.length > 0 ? (
                            low_leave_balance.map((employee) => {
                                const percentage = employee.annual_leave_quota > 0
                                    ? Math.round((employee.leave_balance / employee.annual_leave_quota) * 100)
                                    : 0;
                                return (
                                    <div key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <Link
                                                href={`/employees/${employee.id}`}
                                                className="text-sm font-medium text-gray-900 hover:underline"
                                            >
                                                {employee.name}
                                            </Link>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                employee.leave_balance === 0 ? 'bg-red-100 text-red-800' :
                                                employee.leave_balance === 1 ? 'bg-orange-100 text-orange-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {employee.leave_balance} / {employee.annual_leave_quota}
                                        </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    percentage === 0 ? 'bg-red-600' :
                                                    percentage < 15 ? 'bg-orange-500' : 'bg-yellow-500'
                                                }`}
                                                style={{ width: `${Math.max(5, percentage)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{percentage}% remaining</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                All employees have sufficient leave balance
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

