import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { getCustomStyles } from '@/utils/theme';
import BrandedNavLink from '@/Components/BrandedNavLink';
import {
    HomeIcon,
    UsersIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    CalendarDaysIcon,
    ChartBarIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

export default function AppLayout({ children }) {
    const { auth, flash, company } = usePage().props;
    const customStyles = getCustomStyles(company);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{flash.success}</p>
                        </div>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{flash.error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="bg-white shadow-sm" style={{ borderBottom: `2px solid ${customStyles.primaryColor}` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                {company?.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="h-10 w-auto"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold" style={{ color: customStyles.primaryColor }}>
                                        {company?.name || '3 Amigos'}
                                    </h1>
                                )}
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <BrandedNavLink href="/dashboard" icon={HomeIcon}>
                                    Dashboard
                                </BrandedNavLink>
                                {!auth.user?.is_admin && (
                                    <>
                                        <BrandedNavLink href="/attendance" icon={ClockIcon}>
                                            Attendance & WFH
                                        </BrandedNavLink>
                                        <BrandedNavLink href="/work-exceptions" icon={CalendarDaysIcon}>
                                            Work Exceptions
                                        </BrandedNavLink>
                                    </>
                                )}
                                <BrandedNavLink href="/help" icon={QuestionMarkCircleIcon}>
                                    Help & Guide
                                </BrandedNavLink>
                                {auth.user?.is_admin && (
                                    <>
                                        <BrandedNavLink href="/employees" icon={UsersIcon}>
                                            Employees
                                        </BrandedNavLink>
                                        <BrandedNavLink href="/admin/work-exceptions" icon={CalendarDaysIcon}>
                                            Work Exceptions
                                        </BrandedNavLink>
                                        <BrandedNavLink href="/admin/milestones" icon={ChartBarIcon}>
                                            Milestones & Rewards
                                        </BrandedNavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* User menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Menu as="div" className="ml-3 relative">
                                <div>
                                    <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-2 text-sm border-b">
                                            <div className="font-medium text-gray-900 truncate">{auth.user.name}</div>
                                            <div className="text-gray-500 text-xs truncate">{auth.user.email}</div>
                                        </div>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/profile"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } flex w-full px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } flex w-full px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                                    Sign out
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

