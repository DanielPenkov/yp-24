"use client";

import Link from "next/link";
import { trpc } from "@/server/client";
import {ArrowTrendingDownIcon, HomeIcon} from "@heroicons/react/24/outline";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationLinks() {
    let data = trpc.categories.getCategories.useQuery().data;
    let navigation = [];

    if (data) {
        navigation = data;
        console.log(navigation);
    }

    return (
        <div className="ml-10 flex items-center space-x-4"> {/* Change items-baseline to items-center */}
            <Link
                key={'Home'}
                href={'/'}
                className={classNames(
                    'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium flex items-center'
                )}
                aria-current={'' ? 'page' : undefined}
            >
                <HomeIcon className="h-5 mr-2"/>
                Home
            </Link>
            {navigation.map((item: any) => (
                <Link
                    key={item.name}
                    href={'/categories' + '/' + item.identifier}
                    className={classNames(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
}