"use client";

import { Card } from "@/components/category-page/card";
import { Table } from "@/components/category-page/table";
import { capitalizeFirstLetter } from "@/util/yp-strings";
import { trpc } from "@/server/client";
import { usePathname } from "next/navigation";
import {useYear} from "@/components/Provider/Provider";
import AddResultsModal from "@/components//category-page/add-results-modal";

export default function Category() {
    const { year } = useYear();
    const pathname = usePathname();
    const segments = pathname.split("/");
    const categoryIdentifier = segments[2];
    const { data, refetch } = trpc.overview.overview.useQuery({
        identifier: categoryIdentifier,
        year: year
    });

    let tableData = [];
    let goals = [];

    if (data) {
        goals = data.goals ?? [];
        tableData = data.tableData;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter(categoryIdentifier)}
                    </h1>
                </div>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {goals.map((goal: any) => {
                    return (
                        <Card
                            key={Math.random()}
                            value={goal.current_value}
                            target={goal.target}
                            currentTarget={goal.current_target}
                            type={goal.type}
                            description={goal.name}
                            identifier={goal.identifier}
                        ></Card>
                    );
                })}
            </div>

            <AddResultsModal
                data={data}
                year={year}
                categoryIdentifier={categoryIdentifier}
                onSubmitSuccess={refetch}
            />

            <div className={"mt-5"}>
                <Table
                    goals={goals}
                    data={tableData}
                    categoryIdentifier={categoryIdentifier}
                ></Table>
            </div>
        </div>
    );
}