import YpStringFormatter from "@/app/util/yp-string-formatter";
import React from "react";

export function Table({goals, data, categoryIdentifier}: {
    goals: any;
    data: any;
    categoryIdentifier: string
}) {
    const monts = goals.length > 0 ? getMonths() : [];

    if (monts.length === 0) {
        return (
            <div>No data available</div>
        );
    }

    return (
        <table className="border-collapse table-auto w-full text-sm ">
            <thead key={Math.random()} className={"bg-white pt-20 pb-20"}>
            <tr>
                <th key={Math.random()}
                    className="border-b dark:border-slate-600 font-medium p-4 pl-8 text-slate-400 dark:text-slate-200 text-left">
                    Month
                </th>
                {goals.map((goal) => (
                    <th key={Math.random()}
                        className="border-b dark:border-slate-600 font-medium p-4 pl-8 text-slate-400 dark:text-slate-200 text-left">{goal.name}</th>
                ))}
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800">
            {
                monts.map((month) => (
                    <tr key={Math.random()}>
                        <td key={Math.random()}
                            className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                            {month}
                        </td>
                        {
                            goals.map((goal:any) => (
                                <td key={Math.random()}
                                    className="border-b dark:border-slate-600 p-4 pl-8 text-left">
                                    {<YpStringFormatter
                                        amount= {data[goal.id][month] ?? '-'}
                                        identifier={categoryIdentifier}
                                    > </YpStringFormatter>}
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

function getMonths() {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonth = new Date().getMonth();
    return monthNames.slice(0, currentMonth + 1);
}