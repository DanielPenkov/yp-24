'use client'

import {OverviewItem} from "@/app/ui/overview-item";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {fetchOverview} from "@/app/util/http";

const queryClient = new QueryClient()

export function OverviewData() {
    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['data'],
        queryFn: () => fetchOverview()
    })

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {
                    data ? <OverviewItem data={data}></OverviewItem> : <div>Loading...</div>
                }
            </div>
        </div>
    )
}

export default function Overview() {
    return <QueryClientProvider client={queryClient}>
        <OverviewData/>
    </QueryClientProvider>
}