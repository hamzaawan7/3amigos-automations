import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDate } from '@/utils/dateFormat';
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    UserIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ exceptions }) {
    const [filter, setFilter] = useState('all');
    const { post } = useForm();

    const filteredExceptions = exceptions.filter(exception => {
        if (filter === 'all') return true;
        return exception.status === filter;
    });

    const handleApprove = (id) => {
        if (confirm('Approve this work exception? No leave will be deducted for the missed day.')) {
            post(`/admin/work-exceptions/${id}/approve`);
        }
    };

    const handleReject = (id) => {
        if (confirm('Reject this work exception? Leave will be deducted for the missed day.')) {
            post(`/admin/work-exceptions/${id}/reject`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return null;
        }
    };

    const pendingCount = exceptions.filter(e => e.status === 'pending').length;

    return (
        <AppLayout>
            <Head title="Work Exceptions - Admin" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Work Exception Requests</h1>
                    <p className="mt-2 text-gray-600">
                        Review and approve employee work exception requests
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900">{exceptions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Approved</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {exceptions.filter(e => e.status === 'approved').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                <XCircleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Rejected</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {exceptions.filter(e => e.status === 'rejected').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`${
                                        filter === tab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                                >
                                    {tab}
                                    {tab === 'pending' && pendingCount > 0 && (
                                        <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                                            {pendingCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Exceptions List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {filteredExceptions.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No exception requests</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? 'No work exception requests have been submitted yet'
                                    : `No ${filter} exception requests`}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredExceptions.map((exception) => (
                                <div key={exception.id} className="px-6 py-6 hover:bg-gray-50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {exception.employee_name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(exception.status)}
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(exception.status)}`}>
                                                {exception.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Missed Workday</p>
                                            <p className="text-sm font-semibold text-red-600">
                                                {formatDate(exception.missed_date)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Compensation Day</p>
                                            <p className="text-sm font-semibold text-green-600">
                                                {formatDate(exception.compensate_date)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Requested</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {exception.created_at}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Reason:</p>
                                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                                            {exception.reason}
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Work Description:</p>
                                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                                            {exception.work_description}
                                        </p>
                                    </div>

                                    {exception.status === 'pending' ? (
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleReject(exception.id)}
                                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <XMarkIcon className="h-4 w-4 mr-2" />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleApprove(exception.id)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <CheckIcon className="h-4 w-4 mr-2" />
                                                Approve
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end text-sm text-gray-500">
                                            <span>
                                                {exception.status === 'approved' ? 'Approved' : 'Rejected'} by {exception.approver_name}
                                                {exception.approved_at && ` on ${exception.approved_at}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

