import { TrendingArrow } from "@/components/ui/trending-arrow";
import Link from "next/link";
import YpStringFormatter from "@/util/yp-string-formatter";
import { trpc } from "@/server/client";
import {DynamicNumberColor} from "@/components/ui/dynamic-number-color";

export function OverviewCards({ data }: { data: any }) {
    return (
        <div>
            <div className="max-w-7xl mx-auto mt-8 space-y-8">
                {data.map((category: any) => (
                    <div key={category.id}>
                        <div className="bg-white px-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h2>

                            <Link href={'/categories' + '/' + category.identifier}>
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {category.goals.map((goal: any) => (
                                        <div
                                            key={goal.id}
                                            className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm text-gray-500">Achieved:</p>
                                                    <p className="text-sm font-medium text-green-600">
                                                        <DynamicNumberColor
                                                            value={goal.current_value}
                                                            goal={goal.name}
                                                            target={trpc.results.getGoalExpectedValue.useQuery({id: goal.id}).data ?? ""}
                                                            type={goal.type}
                                                            style=""
                                                        >
                                                        </DynamicNumberColor>
                                                    </p>
                                                    <p className="text-sm text-gray-500">/ Goal:</p>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        <YpStringFormatter
                                                            identifier={goal.name}
                                                            amount={
                                                                trpc.results.getGoalExpectedValue.useQuery({id: goal.id}).data ?? ""
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <TrendingArrow
                                                    value={goal.current_value}
                                                    target={trpc.results.getGoalExpectedValue.useQuery({id: goal.id}).data ?? ""}
                                                    type={goal.type}
                                                    style="h-8 m-5"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}