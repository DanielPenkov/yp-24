import {Icon} from "@/app/ui/icon";
import {TrendingArrow} from "@/app/ui/trending-arrow";
import Link from "next/link";
import YpStringFormatter from "@/app/util/yp-string-formatter";
import {trpc} from "@/server/client";


export function OverviewItem({data}: {
    data: any;
}) {
    return (
        data.map((category: any) => {
            return <div key={Math.random()}>
                <div key={Math.random()} className="bg-white px-6">
                    <div className={"flex flex-row items-center"}>
                            <Icon identifier={category.identifier} style={"h-8 m-2 rounded-full "}></Icon>
                        <span className={"text-2xl font-bold"}>{category.name}</span>
                    </div>
                    {
                        category.goals.map((goal: any) => {
                            return <div key={Math.random()}>
                                <Link href={'/categories' + '/' + category.identifier} className={"flex flex-row items-center justify-between py-4 mx-6 overview-item-link"}>
                                    <div className="flex items-center">
                                        <div>
                                            <TrendingArrow value={goal.current_value} target={
                                                trpc.results.getGoalInitialRecord.useQuery({ id: goal.id }).data ?? ''
                                            }
                                                           type={goal.type} style={"h-8 m-5"}></TrendingArrow>
                                        </div>
                                        <div className="min-w-max">
                                            <p className="text-lg font-semibold md:text-base">
                                                {goal.name}
                                            </p>
                                            <p className="text-sm text-gray-500 sm:block">
                                                {goal.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="min-w-0">
                                            <p className={`truncate text-sm font-medium md:text-base`}>
                                                <YpStringFormatter identifier={goal.name} amount={goal.current_value}></YpStringFormatter>
                                            </p>
                                            <p className="hidden text-sm text-gray-500 sm:block text-center font-bold">
                                                <YpStringFormatter identifier={goal.name} amount={
                                                    trpc.results.getGoalInitialRecord.useQuery({ id: goal.id }).data ?? ''
                                                }></YpStringFormatter>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        })
                    }
                </div>
            </div>
        })
    );
}