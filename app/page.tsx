"use client";

import { trpc } from "@/server/client";
import {useYear} from "@/components/Provider/Provider";
import {capitalizeFirstLetter} from "@/util/yp-strings";
import LoadingSpinner from "@/components/ui/loading";
import {OverviewCards} from "@/components/overview-cards";

export default function Overview() {
    const { year } = useYear();

    const categories = trpc.categories.getCategoriesWithGoals.useQuery({
        year: year
    }).data;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-5 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter('Overview')}
                    </h1>
                </div>
            </header>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {
                    categories ?
                        <OverviewCards data={categories}></OverviewCards> :
                        <LoadingSpinner></LoadingSpinner>
                }
            </div>
        </div>
    )
}
