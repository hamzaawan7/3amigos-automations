import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDate } from '@/utils/dateFormat';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ employee, activeLoan }) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        phone: employee.phone || '',
        start_time: employee.start_time ? employee.start_time.substring(0, 5) : '12:00',
        annual_leave_quota: employee.annual_leave_quota || 14,
        leave_balance: employee.leave_balance || 0,
        salary: employee.salary || '',
        currency: employee.currency || 'USD',
        salary_type: employee.salary_type || 'Salary',
        last_increment_date: employee.last_increment_date || '',
        kpi_score: employee.kpi_score || 0,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    }

    return (
        <AppLayout>
            <Head title="Edit Employee" />

            <div className="mb-6">
                <Link
                    href="/employees"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Employees
                </Link>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Employee</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Update employee information and leave balance.
                        </p>
                    </div>
                </div>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
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
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                                </div>

                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                                        Office Start Time
                                    </label>
                                    <input
                                        type="time"
                                        id="start_time"
                                        value={data.start_time}
                                        onChange={e => setData('start_time', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Employee will be marked late if they check in after this time</p>
                                    {errors.start_time && <div className="text-red-500 text-sm mt-1">{errors.start_time}</div>}
                                </div>

                                <div>
                                    <label htmlFor="annual_leave_quota" className="block text-sm font-medium text-gray-700">
                                        Annual Leave Quota (days)
                                    </label>
                                    <input
                                        type="number"
                                        id="annual_leave_quota"
                                        value={data.annual_leave_quota}
                                        onChange={e => setData('annual_leave_quota', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.annual_leave_quota && <div className="text-red-500 text-sm mt-1">{errors.annual_leave_quota}</div>}
                                </div>

                                <div>
                                    <label htmlFor="leave_balance" className="block text-sm font-medium text-gray-700">
                                        Current Leave Balance
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        id="leave_balance"
                                        value={data.leave_balance}
                                        onChange={e => setData('leave_balance', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.leave_balance && <div className="text-red-500 text-sm mt-1">{errors.leave_balance}</div>}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Adjust the current leave balance if needed.
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 pt-6 mt-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Compensation & Performance</h4>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                                                Salary Amount
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="salary"
                                                value={data.salary}
                                                onChange={e => setData('salary', e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {errors.salary && <div className="text-red-500 text-sm mt-1">{errors.salary}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                                Currency
                                            </label>
                                            <select
                                                id="currency"
                                                value={data.currency}
                                                onChange={e => setData('currency', e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="PKR">PKR</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                            {errors.currency && <div className="text-red-500 text-sm mt-1">{errors.currency}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="salary_type" className="block text-sm font-medium text-gray-700">
                                                Salary Type
                                            </label>
                                            <select
                                                id="salary_type"
                                                value={data.salary_type}
                                                onChange={e => setData('salary_type', e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="Salary">Salary</option>
                                                <option value="Hourly">Hourly</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                            {errors.salary_type && <div className="text-red-500 text-sm mt-1">{errors.salary_type}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="last_increment_date" className="block text-sm font-medium text-gray-700">
                                                Last Increment Date
                                            </label>
                                            <input
                                                type="date"
                                                id="last_increment_date"
                                                value={data.last_increment_date}
                                                onChange={e => setData('last_increment_date', e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {errors.last_increment_date && <div className="text-red-500 text-sm mt-1">{errors.last_increment_date}</div>}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="kpi_score" className="block text-sm font-medium text-gray-700">
                                                KPI Score (0-100)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                id="kpi_score"
                                                value={data.kpi_score}
                                                onChange={e => setData('kpi_score', e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                            {errors.kpi_score && <div className="text-red-500 text-sm mt-1">{errors.kpi_score}</div>}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Current performance score based on attendance, productivity, and other metrics.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Loan Information (Read-only) */}
                                {activeLoan && (
                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <h4 className="text-md font-medium text-gray-900 mb-4">💰 Active Loan</h4>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Total Loan Amount</label>
                                                    <p className="mt-1 text-lg font-bold text-gray-900">
                                                        {activeLoan.currency} {parseFloat(activeLoan.total_amount).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Monthly Deduction</label>
                                                    <p className="mt-1 text-lg font-bold text-red-600">
                                                        {activeLoan.currency} {parseFloat(activeLoan.monthly_deduction).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                                    <p className="mt-1 text-lg font-semibold text-green-600">
                                                        {activeLoan.currency} {parseFloat(activeLoan.amount_paid).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                                                    <p className="mt-1 text-lg font-semibold text-orange-600">
                                                        {activeLoan.currency} {parseFloat(activeLoan.remaining_amount).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Loan Date</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatDate(activeLoan.loan_date)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Next Deduction</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatDate(activeLoan.next_deduction_date)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Repayment Progress</span>
                                                    <span className="text-sm font-bold text-indigo-600">{activeLoan.progress_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                                                        style={{ width: `${activeLoan.progress_percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                                            <p className="text-sm text-yellow-700">
                                                <strong>Note:</strong> Loan deductions are processed automatically on the 25th of every month.
                                                Contact administrator to modify loan details.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <Link
                                    href="/employees"
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    Update Employee
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

