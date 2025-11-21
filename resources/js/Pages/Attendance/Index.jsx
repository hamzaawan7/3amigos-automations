import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateWithDay } from '@/utils/dateFormat';
import { CheckCircleIcon, ClockIcon, CalendarIcon, XCircleIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Index({ employee, todayAttendance, recentAttendances, attendanceStats }) {
    const { data, setData, post, processing, errors } = useForm({
        daily_report: '',
        attendance_type: 'office', // 'office' or 'wfh'
        is_wfh: false,
        wfh_daily_tasks: '',
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showWFHTaskSubmission, setShowWFHTaskSubmission] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentHour = currentTime.getHours();
    const isBeforeElevenAM = currentHour < 11;
    const isBeforeSixPM = currentHour < 18;

    function handleSubmitAttendance(e) {
        e.preventDefault();
        const isWFH = data.attendance_type === 'wfh';
        const message = isWFH
            ? 'Check in for Work From Home?'
            : 'Submit your office attendance?';

        if (confirm(message)) {
            // Use router.post to send data directly
            router.post('/attendance/mark', {
                is_wfh: isWFH
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (isWFH) {
                        setShowWFHTaskSubmission(false); // Will show via todayAttendance.is_wfh check
                    }
                }
            });
        }
    }

    function handleSubmitWFHTasks(e) {
        e.preventDefault();
        if (confirm('Submit your WFH daily tasks?')) {
            // Use Inertia router directly with proper data format
            router.post('/attendance/submit-tasks', {
                daily_tasks: data.wfh_daily_tasks
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowWFHTaskSubmission(false);
                    setData('wfh_daily_tasks', ''); // Clear the form
                },
                onError: (errors) => {
                    console.error('Task submission errors:', errors);
                }
            });
        }
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
            <Head title="Mark Attendance" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Mark Your Attendance</h1>
                    <p className="text-xl text-gray-600">{formatDateWithDay(currentTime)}</p>
                    <p className="text-3xl font-mono text-indigo-600 mt-2">{formatTime(currentTime)}</p>
                </div>

                {/* Important Notice - Moved to Top */}
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Important:</strong> Please mark your attendance before 11:00 PM daily.
                                Unmarked attendance will result in automatic leave deduction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Attendance Card */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
                    {todayAttendance.marked ? (
                        // Already Marked
                        <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="text-center mb-6">
                                <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Marked!</h2>
                                <p className="text-lg text-gray-600 mb-4">
                                    You checked in today at <span className={`font-semibold ${todayAttendance.is_late ? 'text-orange-600' : 'text-green-600'}`}>{todayAttendance.check_in}</span>
                                </p>
                                {todayAttendance.type && (
                                    <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-medium">Type:</span> {todayAttendance.type}
                                    </p>
                                )}
                                <div className={`inline-flex items-center px-4 py-2 ${todayAttendance.is_late ? 'bg-orange-100' : 'bg-green-100'} rounded-full`}>
                                    {todayAttendance.is_late ? (
                                        <>
                                            <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                                            <span className="text-orange-700 font-medium">Late by {todayAttendance.late_by_minutes} min</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                                            <span className="text-green-700 font-medium">On Time</span>
                                        </>
                                    )}
                                </div>
                                {todayAttendance.is_late && (
                                    <p className="text-sm text-orange-600 mt-3">
                                        ⚠️ Late arrival resets your attendance streak
                                    </p>
                                )}
                                {!todayAttendance.is_late && employee.current_streak > 0 && (
                                    <p className="text-sm text-green-600 mt-3">
                                        🔥 Current streak: {employee.current_streak} day(s)
                                    </p>
                                )}
                            </div>

                            {todayAttendance.is_wfh && (
                                <div className="mt-6">
                                    {todayAttendance.task_submitted ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                                                <p className="text-sm font-medium text-green-800">WFH Tasks Submitted</p>
                                            </div>
                                            <p className="text-xs text-green-600 mb-3">Submitted at {todayAttendance.task_submitted_at}</p>
                                            <div className="bg-white border border-green-200 rounded p-3">
                                                <p className="text-xs font-medium text-gray-700 mb-1">Your Daily Tasks:</p>
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{todayAttendance.daily_tasks}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                                                    <p className="text-sm font-medium text-yellow-800">
                                                        {isBeforeSixPM ? 'Tasks open at 6:00 PM' : 'Tasks Pending'}
                                                    </p>
                                                </div>
                                                {!isBeforeSixPM && (
                                                    <button
                                                        onClick={() => setShowWFHTaskSubmission(true)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
                                                    >
                                                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                                                        Submit Tasks
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* WFH Task Submission Modal */}
                            {showWFHTaskSubmission && todayAttendance.is_wfh && !todayAttendance.task_submitted && !isBeforeSixPM && (
                                <div className="mt-6 bg-white border-2 border-indigo-500 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit WFH Tasks</h3>
                                    <form onSubmit={handleSubmitWFHTasks}>
                                        <div className="mb-4">
                                            <textarea
                                                id="wfh_daily_tasks"
                                                rows="6"
                                                value={data.wfh_daily_tasks}
                                                onChange={e => setData('wfh_daily_tasks', e.target.value)}
                                                disabled={processing}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                                                placeholder="Describe what you worked on today..."
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                {errors.wfh_daily_tasks && (
                                                    <p className="text-sm text-red-600">{errors.wfh_daily_tasks}</p>
                                                )}
                                                <p className={`text-xs ml-auto ${
                                                    data.wfh_daily_tasks.length >= 200 ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                    {data.wfh_daily_tasks.length} / 200 characters
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowWFHTaskSubmission(false)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing || data.wfh_daily_tasks.length < 200}
                                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                                {processing ? 'Submitting...' : 'Submit'}
                                            </button>
                                        </div>

                                        {data.wfh_daily_tasks.length < 200 && (
                                            <p className="text-center text-sm text-gray-500 mt-2">
                                                {200 - data.wfh_daily_tasks.length} more characters needed
                                            </p>
                                        )}
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Mark Attendance - Office or WFH
                        <div className="p-6">
                            {isBeforeElevenAM ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                                    <svg className="h-16 w-16 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xl font-bold text-yellow-800 mb-2">Attendance Opens at 11:00 AM</p>
                                    <p className="text-yellow-600 mt-2">
                                        Current time: {formatTime(currentTime)}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {/* Attendance Type Tabs */}
                                    <div className="border-b border-gray-200 mb-8">
                                        <nav className="-mb-px flex space-x-8">
                                            <button
                                                type="button"
                                                onClick={() => setData('attendance_type', 'office')}
                                                className={`${
                                                    data.attendance_type === 'office'
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                            >
                                                Office Attendance
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('attendance_type', 'wfh')}
                                                className={`${
                                                    data.attendance_type === 'wfh'
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                            >
                                                Work From Home
                                            </button>
                                        </nav>
                                    </div>

                                    {data.attendance_type === 'office' ? (
                                        // Office Attendance Form - Prominent Button
                                        <form onSubmit={handleSubmitAttendance} className="text-center py-8">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full max-w-2xl mx-auto flex items-center justify-center gap-4 px-16 py-12 border-4 border-transparent text-3xl font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105 active:scale-95"
                                            >
                                                <CheckCircleIcon className="h-16 w-16" />
                                                <span>{processing ? 'Checking In...' : 'Check In - Office'}</span>
                                            </button>
                                            <p className="text-gray-500 mt-6 text-sm">
                                                Current time: {formatTime(currentTime)}
                                            </p>
                                        </form>
                                    ) : (
                                        // Work From Home - Check-in - Prominent Button
                                        <form onSubmit={handleSubmitAttendance} className="text-center py-8">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full max-w-2xl mx-auto flex items-center justify-center gap-4 px-16 py-12 border-4 border-transparent text-3xl font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105 active:scale-95"
                                            >
                                                <HomeIcon className="h-16 w-16" />
                                                <span>{processing ? 'Checking in...' : 'Check In - WFH'}</span>
                                            </button>
                                            <p className="text-gray-500 mt-6 text-sm">
                                                Submit tasks after 6:00 PM • Current time: {formatTime(currentTime)}
                                            </p>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Grid - Leave Balance & Streak */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Leave Balance Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Leave Balance</h3>
                                <p className="text-sm text-gray-500">Remaining leave days for this year</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-indigo-600">
                                    {employee.leave_balance}
                                </div>
                                <div className="text-sm text-gray-500">
                                    of {employee.annual_leave_quota} days
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${
                                        (employee.leave_balance / employee.annual_leave_quota) * 100 >= 70 ? 'bg-green-600' :
                                        (employee.leave_balance / employee.annual_leave_quota) * 100 >= 40 ? 'bg-yellow-600' :
                                        'bg-red-600'
                                    }`}
                                    style={{ width: `${(employee.leave_balance / employee.annual_leave_quota) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Streak Info */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <svg className="h-6 w-6 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                    Attendance Streak
                                </h3>
                                <p className="text-sm text-gray-500">On-time consecutive days</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-orange-600">{employee.current_streak}</div>
                                <div className="text-xs text-gray-500 mt-1">Current</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">{employee.longest_streak}</div>
                                <div className="text-xs text-gray-500 mt-1">Best</div>
                            </div>
                        </div>
                        {attendanceStats && (
                            <div className="mt-4 pt-4 border-t border-orange-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">On-Time:</span>
                                    <span className="font-semibold text-green-600">{attendanceStats.on_time_days} days ({attendanceStats.on_time_percentage}%)</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-600">Late:</span>
                                    <span className="font-semibold text-orange-600">{attendanceStats.late_days} days</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <CalendarIcon className="h-6 w-6 text-gray-400 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Recent Attendance (Last 7 Days)</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentAttendances.length > 0 ? (
                            recentAttendances.map((attendance, index) => (
                                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start flex-1">
                                            {attendance.check_in ? (
                                                attendance.is_late ? (
                                                    <ClockIcon className="h-6 w-6 text-orange-500 mr-3 mt-1" />
                                                ) : (
                                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1" />
                                                )
                                            ) : (
                                                <XCircleIcon className="h-6 w-6 text-red-500 mr-3 mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDateWithDay(attendance.date)}
                                                    </p>
                                                    {attendance.is_late && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                            Late {attendance.late_by_minutes}m
                                                        </span>
                                                    )}
                                                </div>
                                                {attendance.check_in && (
                                                    <p className={`text-sm ${attendance.is_late ? 'text-orange-600' : 'text-gray-500'}`}>
                                                        Checked in at {attendance.check_in}
                                                    </p>
                                                )}
                                                {attendance.daily_report && (
                                                    <div className="mt-2 bg-gray-50 rounded p-2 text-sm text-gray-700">
                                                        <span className="font-medium text-xs text-gray-500">Daily Report: </span>
                                                        {attendance.daily_report}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`ml-4 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            attendance.check_in
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {attendance.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p>No recent attendance records</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

