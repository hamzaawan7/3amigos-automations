 import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateWithDay, formatDate } from '@/utils/dateFormat';
import {
    HomeIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Index({ employee, todayWFH, recentWFH, isBeforeSixPM, currentHour }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { post: checkInPost, processing: checkingIn } = useForm();
    const { data, setData, post: submitPost, processing: submitting, errors, reset } = useForm({
        daily_tasks: '',
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    function handleCheckIn() {
        if (confirm('Mark yourself as Working From Home today?')) {
            checkInPost('/work-from-home/check-in');
        }
    }

    function handleSubmitTasks(e) {
        e.preventDefault();
        submitPost('/work-from-home/submit-tasks', {
            onSuccess: () => reset('daily_tasks'),
        });
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <AppLayout>
            <Head title="Work From Home" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <HomeIcon className="h-10 w-10 text-indigo-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900">Work From Home</h1>
                    </div>
                    <p className="text-xl text-gray-600">{formatDateWithDay(currentTime)}</p>
                    <p className="text-3xl font-mono text-indigo-600 mt-2">{formatTime(currentTime)}</p>
                </div>

                {/* Important Notice */}
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Important:</strong> Submit your daily tasks before 11:00 PM. Failure to submit will result in automatic leave deduction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main WFH Card */}
                {!todayWFH.checked_in ? (
                    // Check In Card
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
                        <div className="p-8 text-center">
                            <HomeIcon className="h-24 w-24 text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Working From Home Today?</h2>
                            <p className="text-gray-600 mb-6">
                                {isBeforeSixPM
                                    ? 'WFH check-in opens at 6:00 PM'
                                    : "Check in to mark yourself as WFH. You'll need to submit your daily tasks before 11 PM."}
                            </p>

                            {isBeforeSixPM ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <svg className="h-12 w-12 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-yellow-800 font-medium">WFH Check-in Opens at 6:00 PM</p>
                                    <p className="text-yellow-600 text-sm mt-2">
                                        Please return after 6:00 PM to check in for Work From Home.
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkingIn}
                                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform transition-all hover:scale-105"
                                >
                                    <HomeIcon className="h-6 w-6 mr-2" />
                                    {checkingIn ? 'Checking In...' : 'Check In - Work From Home'}
                                </button>
                            )}
                        </div>
                    </div>
                ) : todayWFH.type === 'office' ? (
                    // Office Attendance Already Marked
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
                        <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                            <CheckCircleIcon className="h-24 w-24 text-blue-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Office Attendance Marked!</h2>
                            <p className="text-lg text-gray-600 mb-4">
                                You already checked in at the office today at <span className="font-semibold text-blue-600">{todayWFH.check_in_time}</span>
                            </p>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-blue-700 font-medium">Present (Office)</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Task Submission Card
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-white">
                                    <CheckCircleIcon className="h-8 w-8 mr-3" />
                                    <div>
                                        <h2 className="text-xl font-bold">WFH Check-in Recorded</h2>
                                        <p className="text-sm text-indigo-100">Checked in at {todayWFH.check_in_time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {todayWFH.task_submitted ? (
                            // Tasks Already Submitted
                            <div className="p-8 bg-green-50">
                                <div className="flex items-start mb-4">
                                    <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tasks Submitted!</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Submitted at {todayWFH.task_submitted_at}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <h4 className="font-semibold text-gray-700 mb-2">Your Tasks:</h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">{todayWFH.daily_tasks}</p>
                                </div>
                            </div>
                        ) : (
                            // Task Submission Form
                            <form onSubmit={handleSubmitTasks} className="p-6">
                                {isBeforeSixPM && (
                                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm text-yellow-700 text-center">
                                            <strong>Note:</strong> Task submission is available after 6:00 PM. Please return later to submit your daily tasks.
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-2" />
                                        <label htmlFor="daily_tasks" className="block text-lg font-medium text-gray-900">
                                            Submit Your Daily Tasks
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Describe what you worked on today. Be specific and detailed (minimum 200 characters).
                                    </p>
                                    <textarea
                                        id="daily_tasks"
                                        rows="8"
                                        value={data.daily_tasks}
                                        onChange={e => setData('daily_tasks', e.target.value)}
                                        disabled={isBeforeSixPM}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Example:&#10;- Completed feature X&#10;- Fixed bugs in module Y&#10;- Attended team meeting&#10;- Code review for PR #123"
                                    />
                                    {errors.daily_tasks && (
                                        <p className="mt-2 text-sm text-red-600">{errors.daily_tasks}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-700">
                                        <strong>Reminder:</strong> Tasks must be submitted before 11:00 PM today. Late submissions will result in leave deduction.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || isBeforeSixPM}
                                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                                    {submitting ? 'Submitting...' : isBeforeSixPM ? 'Available After 6:00 PM' : 'Submit Daily Tasks'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Recent WFH History */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <ClockIcon className="h-6 w-6 text-gray-400 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Recent WFH Days (Last 7 Days)</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentWFH.length > 0 ? (
                            recentWFH.map((wfh, index) => (
                                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start flex-1">
                                            {wfh.task_submitted ? (
                                                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1" />
                                            ) : wfh.is_overdue ? (
                                                <XCircleIcon className="h-6 w-6 text-red-500 mr-3 mt-1" />
                                            ) : (
                                                <ClockIcon className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDateWithDay(wfh.date)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Checked in at {wfh.check_in_time}
                                                </p>
                                                {wfh.task_submitted && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-green-600 font-medium mb-1">
                                                            ✓ Tasks submitted at {wfh.task_submitted_at}
                                                        </p>
                                                        <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">
                                                            {wfh.daily_tasks}
                                                        </div>
                                                    </div>
                                                )}
                                                {wfh.is_overdue && (
                                                    <p className="text-xs text-red-600 font-medium mt-1">
                                                        ⚠ Tasks not submitted - Leave deducted
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`ml-4 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            wfh.task_submitted
                                                ? 'bg-green-100 text-green-800'
                                                : wfh.is_overdue
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {wfh.task_submitted ? 'Completed' : wfh.is_overdue ? 'Overdue' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p>No WFH records in the last 7 days</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

