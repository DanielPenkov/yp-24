'use client'

import {Card} from "@/app/ui/card";
import {Suspense} from "react";
import {fetchFinanceData} from "@/app/util/http";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import {Table} from "@/app/ui/table";
import {capitalizeFirstLetter} from "@/app/util/yp-strings";

const queryClient = new QueryClient()


export function CategoryData({categoryIdentifier}: { categoryIdentifier: string }) {
    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['data'],
        queryFn: () => fetchFinanceData()
    })

    let tableRows = [];
    let tableData = [];
    let goals = [];

    if (data) {
        tableRows = data.tableColumns;
        tableData = data.tableRows;
        goals = data.goals;
    }


    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{capitalizeFirstLetter(categoryIdentifier)}</h1>
                </div>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <Suspense>
                    {
                        goals.map((goal: any) => {
                            return <Card key={Math.random()}
                                         value={goal.current_value}
                                         target={goal.target}
                                         currentTarget={goal.current_target}
                                         type={goal.type}
                                         description={goal.name}
                                         identifier={goal.identifier}>
                            </Card>
                        })
                    }

                </Suspense>
            </div>
            <div className={"mt-20"}>
                <Table rows={tableRows} data={tableData} categoryIdentifier={categoryIdentifier}></Table>
            </div>
        </>
    )
}

export default function Finance({params}: { params: { slug: string } }) {
    const categoryIdentifier = params.slug;

    return <QueryClientProvider client={queryClient}>
        <CategoryData categoryIdentifier={categoryIdentifier}/>
    </QueryClientProvider>
}