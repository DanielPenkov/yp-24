'use client';

import "./globals.css";
import { Disclosure } from '@headlessui/react'

import Link from "next/link";
import NavigationLinks from "@/app/ui/navigation-links";

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
    <body className="h-full">
    <>
        <div className="min-h-full">
            <Disclosure as="nav" className="bg-gray-800">
                {({open}) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Link
                                            href="/"
                                            className={classNames(
                                                'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                        >
                                            Dashboard
                                        </Link>
                                    </div>

                                    <div className="md:block">
                                        <NavigationLinks />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    </>
    </body>
    </html>
  );
}
