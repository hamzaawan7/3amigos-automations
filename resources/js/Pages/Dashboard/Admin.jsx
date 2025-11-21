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

export default function Admin({ stats, recent_activity, low_leave_balance }) {
    const { company, auth } = usePage().props;
    const customStyles = getCustomStyles(company);

    const getAttendanceRateColor = (rate) => {
        if (rate >= 90) return { bg: '#10b981', text: '#ffffff' };
        if (rate >= 75) return { bg: '#f59e0b', text: '#ffffff' };
        return { bg: '#ef4444', text: '#ffffff' };
    };

    const rateColors = getAttendanceRateColor(stats.attendance_rate_today);

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
                                    {stats.today_wfh > 0 && (
                                        <dd className="text-xs text-gray-400 mt-1">
                                            {stats.today_wfh} working from home
                                        </dd>
                                    )}
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
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-8">
                {/* This Week */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">This Week</h3>
                                <p className="text-3xl font-bold" style={{ color: customStyles.primaryColor }}>
                                    {stats.week_attendances}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Total check-ins</p>
                            </div>
                            <div className="p-3 rounded-full" style={{ backgroundColor: customStyles.primaryColor + '20' }}>
                                <CalendarDaysIcon className="h-8 w-8" style={{ color: customStyles.primaryColor }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* This Month */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">This Month</h3>
                                <p className="text-3xl font-bold" style={{ color: customStyles.secondaryColor }}>
                                    {stats.month_attendances}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Total check-ins</p>
                            </div>
                            <div className="p-3 rounded-full" style={{ backgroundColor: customStyles.secondaryColor + '20' }}>
                                <ArrowTrendingUpIcon className="h-8 w-8" style={{ color: customStyles.secondaryColor }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Exceptions */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Pending</h3>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {stats.pending_exceptions}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Work exceptions</p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-100">
                                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        {stats.pending_exceptions > 0 && (
                            <Link
                                href="/admin/work-exceptions"
                                className="mt-3 text-sm font-medium inline-flex items-center"
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
                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: customStyles.primaryColor + '10' }}>
                        <h3 className="text-lg font-semibold" style={{ color: customStyles.primaryColor }}>
                            Recent Check-ins
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recent_activity.length > 0 ? (
                            recent_activity.map((activity, index) => (
                                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.employee_name}
                                                </p>
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
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                            <h3 className="text-lg font-semibold text-yellow-900">
                                Low Leave Balance
                            </h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {low_leave_balance.length > 0 ? (
                            low_leave_balance.map((employee) => (
                                <div key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
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
                                            {employee.leave_balance} {employee.leave_balance === 1 ? 'day' : 'days'} left
                                        </span>
                                    </div>
                                </div>
                            ))
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

