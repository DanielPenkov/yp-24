"use client";

import {OverviewItem} from "@/app/ui/overview-item";
import { trpc } from "@/server/client";


export default function Overview() {
    const categories = trpc.categories.getCategoriesWithGoals.useQuery().data;
    console.log(categories);


    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {
                     categories ? <OverviewItem data={categories}></OverviewItem> : <div>Loading...</div>
                }
            </div>
        </div>
    )
}
