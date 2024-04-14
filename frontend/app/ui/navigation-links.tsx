'use client';

import Link from "next/link";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {fetchCategories, fetchFinanceData} from "@/app/util/http";

const queryClient = new QueryClient()

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export function Links() {
    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['data'],
        queryFn: () => fetchCategories()
    })

    let navigation = []

    if (data) {
        navigation = data
    }

    return (
        <div className="ml-10 flex items-baseline space-x-4">
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

export default function NavigationLinks() {
    return <QueryClientProvider client={queryClient}>
        <Links/>
    </QueryClientProvider>
}