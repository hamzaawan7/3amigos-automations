import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDate } from '@/utils/dateFormat';
import { formatCurrency } from '@/utils/currency';
import { UserCircleIcon, KeyIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function Edit({ user, employee }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: employee?.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put('/profile');
    }

    return (
        <AppLayout>
            <Head title="Edit Profile" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Update your account's profile information and email address.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="flex items-center mb-4">
                                        <UserCircleIcon className="h-6 w-6 text-indigo-400 mr-2" />
                                        <h4 className="text-md font-medium text-gray-900">Personal Details</h4>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="+92 300 1234567"
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Section */}
                            <div className="shadow sm:rounded-md sm:overflow-hidden mt-6">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="flex items-center mb-4">
                                        <KeyIcon className="h-6 w-6 text-indigo-400 mr-2" />
                                        <h4 className="text-md font-medium text-gray-900">Change Password</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Leave blank if you don't want to change your password.</p>

                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            value={data.current_password}
                                            onChange={e => setData('current_password', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.current_password && <div className="text-red-500 text-sm mt-1">{errors.current_password}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employee Information (Read-only) */}
                            {employee && (
                                <div className="shadow sm:rounded-md sm:overflow-hidden mt-6">
                                    <div className="px-4 py-5 bg-gray-50 space-y-6 sm:p-6">
                                        <div className="flex items-center mb-4">
                                            <BriefcaseIcon className="h-6 w-6 text-indigo-400 mr-2" />
                                            <h4 className="text-md font-medium text-gray-900">Employment Information</h4>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Salary</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {formatCurrency(employee.currency, employee.salary)} <span className="text-gray-500">({employee.salary_type})</span>
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Last Increment</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {employee.last_increment_date || 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">KPI Score</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {employee.kpi_score}/100
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Annual Leave Quota</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {employee.annual_leave_quota} days
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Leave Balance</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {employee.leave_balance} days remaining
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                                            <p className="text-sm text-blue-700">
                                                <strong>Note:</strong> Salary and leave information are managed by administration and cannot be edited here.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Loan Information */}
                            {employee?.active_loan && (
                                <div className="shadow sm:rounded-md sm:overflow-hidden mt-6">
                                    <div className="px-4 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 space-y-6 sm:p-6">
                                        <div className="flex items-center mb-4">
                                            <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <h4 className="text-md font-medium text-gray-900">💰 Active Loan</h4>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Total Loan Amount</label>
                                                <p className="mt-1 text-xl font-bold text-gray-900">
                                                    {formatCurrency(employee.active_loan.currency, employee.active_loan.total_amount)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Monthly Deduction</label>
                                                <p className="mt-1 text-xl font-bold text-red-600">
                                                    -{formatCurrency(employee.active_loan.currency, employee.active_loan.monthly_deduction)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Amount Paid So Far</label>
                                                <p className="mt-1 text-xl font-semibold text-green-600">
                                                    {formatCurrency(employee.active_loan.currency, employee.active_loan.amount_paid)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Remaining Balance</label>
                                                <p className="mt-1 text-xl font-semibold text-orange-600">
                                                    {formatCurrency(employee.active_loan.currency, employee.active_loan.remaining_amount)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Loan Start Date</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {formatDate(employee.active_loan.loan_date)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Next Deduction Date</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {formatDate(employee.active_loan.next_deduction_date)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Repayment Progress Bar */}
                                        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-semibold text-gray-700">Repayment Progress</span>
                                                <span className="text-lg font-bold text-indigo-600">{employee.active_loan.progress_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 via-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500 shadow-md"
                                                    style={{ width: `${employee.active_loan.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                                                <span>Started: {formatDate(employee.active_loan.loan_date)}</span>
                                                <span>Next: {formatDate(employee.active_loan.next_deduction_date)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        <strong>Important:</strong> Loan deductions are automatically processed on the 25th of every month.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

