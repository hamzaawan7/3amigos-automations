import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateWithDay } from '@/utils/dateFormat';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
export default function Show({ employee, attendances }) {
    return (
        <AppLayout>
            <Head title={`Employee: ${employee.name}`} />
            <div className="mb-6">
                <Link href="/employees" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Employees
                </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{employee.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Employee Information</p>
                    </div>
                    <Link href={`/employees/${employee.id}/edit`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
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
                    </dl>
                </div>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance History</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete attendance record</p>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {attendances.data.map((attendance, index) => (
                            <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {attendance.check_in ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDateWithDay(attendance.date)}
                                            </p>
                                            {attendance.check_in && (<p className="text-sm text-gray-500">Check-in: {attendance.check_in}</p>)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attendance.check_in ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {attendance.check_in ? 'Present' : 'Absent'}
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
