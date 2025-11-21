import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateWithDay, formatDate } from '@/utils/dateFormat';
import { formatCurrency } from '@/utils/currency';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Show({ employee, attendances, activeLoan }) {
    return (
        <AppLayout>
            <Head title={`Employee: ${employee.name}`} />

            <div className="mb-6">
                <Link href="/employees" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Employees
                </Link>
            </div>

            {/* Employee Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{employee.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Employee Information</p>
                    </div>
                    <Link
                        href={`/employees/${employee.id}/edit`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Edit
                    </Link>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.email || 'Not set'}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.phone}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">WhatsApp ID</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.whatsapp_id || 'Not synced'}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Leave Balance</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="text-lg font-semibold">{employee.leave_balance}</span>
                                <span className="text-gray-500"> / {employee.annual_leave_quota} days</span>
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Salary</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatCurrency(employee.currency, employee.salary)}
                                <span className="text-gray-500"> ({employee.salary_type})</span>
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.start_time || '12:00:00'}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Current Streak</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="text-lg font-semibold">🔥 {employee.current_streak} days</span>
                                <span className="text-gray-500"> (Longest: {employee.longest_streak})</span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Active Loan */}
            {activeLoan && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">💰 Active Loan</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Current loan details and repayment progress</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Total Loan Amount</label>
                                <p className="mt-1 text-xl font-bold text-gray-900">
                                    {formatCurrency(activeLoan.currency, activeLoan.total_amount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Monthly Deduction</label>
                                <p className="mt-1 text-xl font-bold text-red-600">
                                    -{formatCurrency(activeLoan.currency, activeLoan.monthly_deduction)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Amount Paid</label>
                                <p className="mt-1 text-xl font-semibold text-green-600">
                                    {formatCurrency(activeLoan.currency, activeLoan.amount_paid)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Remaining Balance</label>
                                <p className="mt-1 text-xl font-semibold text-orange-600">
                                    {formatCurrency(activeLoan.currency, activeLoan.remaining_amount)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Repayment Progress</span>
                                <span className="text-sm font-bold text-indigo-600">{activeLoan.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-indigo-600 h-3 rounded-full transition-all"
                                    style={{ width: `${activeLoan.progress_percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance History */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance History</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Last 30 attendance records</p>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {attendances.map((attendance, index) => (
                            <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {attendance.check_in ? (
                                            attendance.is_late ? (
                                                <ClockIcon className="h-5 w-5 text-orange-500 mr-3" />
                                            ) : (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                                            )
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDateWithDay(attendance.date)}
                                                </p>
                                                {attendance.is_wfh && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        WFH
                                                    </span>
                                                )}
                                            </div>
                                            {attendance.check_in && (
                                                <p className="text-sm text-gray-500">
                                                    Check-in: {attendance.check_in}
                                                    {attendance.is_late && (
                                                        <span className="text-orange-600 ml-2">
                                                            (Late by {attendance.late_by_minutes} min)
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            attendance.check_in
                                                ? attendance.is_late
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {attendance.check_in
                                                ? attendance.is_late ? 'Late' : 'On Time'
                                                : 'Absent'}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}

