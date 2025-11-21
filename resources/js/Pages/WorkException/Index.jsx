import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDate } from '@/utils/dateFormat';
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ employee, exceptions }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        missed_date: '',
        compensate_date: '',
        reason: '',
        work_description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/work-exceptions', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

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
                return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Work Exceptions" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Work Exceptions</h1>
                            <p className="mt-2 text-gray-600">
                                Request compensation for missed workdays by working on alternate days
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            {showForm ? 'Cancel' : 'New Exception Request'}
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>How it works:</strong> If you miss a regular workday, you can work on an alternate day
                                (weekend, holiday, etc.) and request a work exception. Once approved by admin, no leave will be deducted.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Request Form */}
                {showForm && (
                    <div className="mb-8 bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Request Work Exception</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Missed Date */}
                                <div>
                                    <label htmlFor="missed_date" className="block text-sm font-medium text-gray-700">
                                        Missed Workday *
                                    </label>
                                    <input
                                        type="date"
                                        id="missed_date"
                                        value={data.missed_date}
                                        onChange={e => setData('missed_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.missed_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.missed_date}</p>
                                    )}
                                </div>

                                {/* Compensate Date */}
                                <div>
                                    <label htmlFor="compensate_date" className="block text-sm font-medium text-gray-700">
                                        Compensation Day (When You Worked) *
                                    </label>
                                    <input
                                        type="date"
                                        id="compensate_date"
                                        value={data.compensate_date}
                                        onChange={e => setData('compensate_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.compensate_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.compensate_date}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">You must have marked attendance on this date</p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="mt-6">
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                    Reason for Missing Workday *
                                </label>
                                <textarea
                                    id="reason"
                                    rows="3"
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                    placeholder="Explain why you missed the regular workday (minimum 20 characters)"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.reason && (
                                        <p className="text-sm text-red-600">{errors.reason}</p>
                                    )}
                                    <p className={`text-xs ml-auto ${data.reason.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                                        {data.reason.length} / 20 characters
                                    </p>
                                </div>
                            </div>

                            {/* Work Description */}
                            <div className="mt-6">
                                <label htmlFor="work_description" className="block text-sm font-medium text-gray-700">
                                    Work Description *
                                </label>
                                <textarea
                                    id="work_description"
                                    rows="5"
                                    value={data.work_description}
                                    onChange={e => setData('work_description', e.target.value)}
                                    placeholder="Describe what you worked on during the compensation day (minimum 50 characters)"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.work_description && (
                                        <p className="text-sm text-red-600">{errors.work_description}</p>
                                    )}
                                    <p className={`text-xs ml-auto ${data.work_description.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                                        {data.work_description.length} / 50 characters
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || data.reason.length < 20 || data.work_description.length < 50}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Exceptions List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">Your Exception Requests</h3>
                    </div>

                    {exceptions.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No exception requests</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new exception request
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {exceptions.map((exception) => (
                                <div key={exception.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                {getStatusIcon(exception.status)}
                                                <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(exception.status)}`}>
                                                    {exception.status.toUpperCase()}
                                                </span>
                                                <span className="ml-4 text-sm text-gray-500">
                                                    Requested {exception.created_at}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Missed Workday</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(exception.missed_date)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Compensation Day</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(exception.compensate_date)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <p className="text-xs text-gray-500 mb-1">Reason:</p>
                                                <p className="text-sm text-gray-700">{exception.reason}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Work Description:</p>
                                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                    {exception.work_description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

