import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ClockIcon,
    HomeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
    DocumentTextIcon,
    CalendarIcon,
    FireIcon,
    BellIcon
} from '@heroicons/react/24/outline';

export default function Help() {
    return (
        <AppLayout>
            <Head title="Help & Guidelines" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Attendance System - Help & Guidelines
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Complete guide to using the 3Amigos attendance system
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/attendance"
                        className="block p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-all"
                    >
                        <CheckCircleIcon className="h-8 w-8 text-indigo-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
                        <p className="text-sm text-gray-600 mt-1">Go to attendance page</p>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="block p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all"
                    >
                        <CalendarIcon className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-900">View Dashboard</h3>
                        <p className="text-sm text-gray-600 mt-1">See your stats & streak</p>
                    </Link>

                    <Link
                        href="/work-exceptions"
                        className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all"
                    >
                        <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Work Exception</h3>
                        <p className="text-sm text-gray-600 mt-1">Request exception</p>
                    </Link>
                </div>

                {/* Critical Timings */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
                    <div className="flex items-start">
                        <ClockIcon className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-3">⏰ Critical Timings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-yellow-800">11:00 AM</p>
                                    <p className="text-yellow-700">Check-in opens</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-800">12:00 PM</p>
                                    <p className="text-yellow-700">Late if after this</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-800">6:00 PM</p>
                                    <p className="text-yellow-700">WFH tasks open</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-red-800">11:00 PM</p>
                                    <p className="text-red-700">⚠️ DEADLINE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="bg-white shadow rounded-lg">
                    {/* Daily Attendance */}
                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <CheckCircleIcon className="h-7 w-7 text-indigo-600 mr-2" />
                            Daily Attendance Procedures
                        </h2>

                        <div className="space-y-6">
                            {/* Office Attendance */}
                            <div className="border-l-4 border-indigo-400 pl-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                    🏢 Office Attendance
                                </h3>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                    <li>Go to <Link href="/attendance" className="text-indigo-600 hover:underline">Attendance Page</Link></li>
                                    <li>Wait until <strong>11:00 AM</strong></li>
                                    <li>Select <strong>"Office Attendance"</strong> tab</li>
                                    <li>Click the large <strong>"Check In - Office"</strong> button 🏢</li>
                                    <li>Confirm the dialog</li>
                                    <li>✅ Check WhatsApp for confirmation message</li>
                                </ol>

                                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">WhatsApp Message:</p>
                                    <div className="bg-white border rounded p-3 text-sm font-mono">
                                        🟢 🏢 <strong>Your Name</strong><br/>
                                        <em>Office (✅ On Time)</em>
                                    </div>
                                </div>
                            </div>

                            {/* WFH Attendance */}
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                    🏠 Work From Home
                                </h3>

                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-blue-800 mb-2">Step 1: Morning Check-In (11:00 AM - 11:00 PM)</p>
                                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                        <li>Go to Attendance Page</li>
                                        <li>Select <strong>"Work From Home"</strong> tab</li>
                                        <li>Click <strong>"Check In - WFH"</strong> button 🏠</li>
                                        <li>✅ WhatsApp notification sent</li>
                                    </ol>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-red-800 mb-2">🚨 Step 2: Submit Daily Tasks (After 6:00 PM) - MANDATORY</p>
                                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                        <li>Return to attendance page after <strong>6:00 PM</strong></li>
                                        <li>Click <strong>"Submit Tasks"</strong> button</li>
                                        <li>Enter daily tasks (minimum <strong>200 characters</strong>)</li>
                                        <li>Click Submit</li>
                                    </ol>
                                    <p className="text-sm text-red-700 mt-3 font-semibold">
                                        ⚠️ Without task submission, WFH attendance is incomplete and leave will be deducted!
                                    </p>
                                </div>

                                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Example Task Description:</p>
                                    <div className="bg-white border rounded p-3 text-sm text-gray-600">
                                        "Today I completed the following tasks:<br/>
                                        1. Fixed authentication bug in login module<br/>
                                        2. Implemented dashboard analytics feature<br/>
                                        3. Conducted code review for PR #234<br/>
                                        4. Updated API documentation for v2.0<br/>
                                        5. Attended team sync meeting"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Streaks */}
                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <FireIcon className="h-7 w-7 text-orange-600 mr-2" />
                            Attendance Streaks & Rewards
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">What is an Attendance Streak?</h3>
                                <p className="text-gray-700">
                                    A streak is the <strong>consecutive number of days</strong> you've checked in <strong>on time</strong>.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-900 mb-2">✅ Streak Increases When:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                                        <li>Check in on time (before your start time)</li>
                                        <li>Complete WFH tasks if working from home</li>
                                        <li>Have approved work exception</li>
                                    </ul>
                                </div>

                                <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-900 mb-2">❌ Streak Resets to 0 When:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                                        <li>Arrive late (even by 1 minute)</li>
                                        <li>Miss a day without approval</li>
                                        <li>WFH tasks not submitted by deadline</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h4 className="font-semibold text-purple-900 mb-3">🎁 Streak-Based Rewards</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between bg-white rounded p-3">
                                        <span className="font-semibold text-gray-700">30-Day Streak</span>
                                        <span className="text-purple-600">Bonus/Recognition</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white rounded p-3">
                                        <span className="font-semibold text-gray-700">60-Day Streak</span>
                                        <span className="text-purple-600">Bonus/Recognition</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Late Arrivals */}
                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <ExclamationTriangleIcon className="h-7 w-7 text-orange-600 mr-2" />
                            Late Arrivals Policy
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <h3 className="font-semibold text-orange-900 mb-2">What Counts as Late?</h3>
                                <p className="text-gray-700 mb-3">
                                    You're late if you check in <strong>after your designated start time</strong>.
                                </p>

                                <div className="bg-white rounded p-3 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>Check-in at 11:50 AM</span>
                                        <span className="text-green-600 font-semibold">✅ On Time</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Check-in at 12:01 PM</span>
                                        <span className="text-orange-600 font-semibold">⚠️ Late (1 min)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Check-in at 2:15 PM</span>
                                        <span className="text-red-600 font-semibold">⚠️ Late (2h 15m)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="font-semibold text-red-900 mb-2">Consequences of Late Arrival:</h3>
                                <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                                    <li>❌ Attendance streak reset to 0</li>
                                    <li>⚠️ Late status shown on dashboard</li>
                                    <li>📱 WhatsApp notification shows late time</li>
                                    <li>📊 Recorded in attendance history</li>
                                    <li>🎁 Affects reward eligibility</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <QuestionMarkCircleIcon className="h-7 w-7 text-gray-600 mr-2" />
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    What happens if I forget to mark attendance?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    One day will be automatically deducted from your leave balance at midnight.
                                    You'll receive a WhatsApp notification about the deduction.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    Can I mark attendance for a previous day?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    No. Attendance must be marked on the same day. Use Work Exception requests
                                    for missed days with valid reasons.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    Do I need to submit tasks every WFH day?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    Yes! WFH attendance is only complete when you've checked in AND submitted
                                    tasks after 6:00 PM. Minimum 200 characters required.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    Does late arrival deduct leave?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    No. Late arrival doesn't deduct leave, but it DOES reset your streak to 0
                                    and affects your reward eligibility.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    How do I check my leave balance?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    Go to Dashboard and look for the "Leave Balance" card. It shows remaining
                                    days and a progress bar.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                                <summary className="font-semibold text-gray-900">
                                    Can I use my phone to mark attendance?
                                </summary>
                                <p className="mt-2 text-gray-700 text-sm">
                                    Yes! The system is mobile-friendly. Use any browser (Chrome, Safari, Firefox).
                                </p>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                {/*<div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <BellIcon className="h-6 w-6 text-indigo-600 mr-2" />
                        Need Help?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">HR Department</h3>
                            <p className="text-gray-700">📧 Email: hr@3amigos.com</p>
                            <p className="text-gray-700">📱 WhatsApp: +92 XXX XXXXXXX</p>
                            <p className="text-gray-600">⏰ Mon-Fri, 9:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">IT Support</h3>
                            <p className="text-gray-700">📧 Email: support@3amigos.com</p>
                            <p className="text-gray-700">📱 WhatsApp: +92 XXX XXXXXXX</p>
                            <p className="text-gray-600">⏰ 24/7 for critical issues</p>
                        </div>
                    </div>
                </div>*/}

                {/* Best Practices */}
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Pro Tips for Success</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <ul className="space-y-2 text-gray-700">
                            <li>✅ Set daily alarm for 11:00 AM</li>
                            <li>✅ Bookmark the attendance page</li>
                            <li>✅ Check WhatsApp after check-in</li>
                            <li>✅ Monitor your streak weekly</li>
                        </ul>
                        <ul className="space-y-2 text-gray-700">
                            <li>✅ Submit WFH tasks on time</li>
                            <li>✅ Keep tasks detailed (200+ chars)</li>
                            <li>✅ Don't wait until 10:30 PM</li>
                            <li>✅ Aim for 30-day streak = Bonus!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

