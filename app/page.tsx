"use client";

import {OverviewItem} from "@/app/ui/overview-item";
import { trpc } from "@/server/client";
import {useYear} from "@/components/Provider/Provider";
import {capitalizeFirstLetter} from "@/app/util/yp-strings";


export default function Overview() {
    const { year } = useYear();

    const categories = trpc.categories.getCategoriesWithGoals.useQuery({
        year: year
    }).data;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter('Dashboard')}
                    </h1>
                </div>
            </header>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {
                    categories ? <OverviewItem data={categories}></OverviewItem> : <div>Loading...</div>
                }
            </div>
        </div>
    )
}
