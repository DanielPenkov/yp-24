import YpStringFormatter from "@/app/util/yp-string-formatter";
import React from "react";

export function Table({rows, data, categoryIdentifier}: {
    rows: string[];
    data: [][];
    categoryIdentifier: string;
}) {
    return (
        <table className="border-collapse table-auto w-full text-sm ">
            <thead key={Math.random()} className={"bg-white pt-20 pb-20"}>
            <tr>
                {rows.map((rowName) => (
                    <th key={Math.random()}
                        className="border-b dark:border-slate-600 font-medium p-4 pl-8 text-slate-400 dark:text-slate-200 text-left">{rowName}</th>
                ))}
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800">
            {
                data.map((row) => (
                <tr key={Math.random()}>
                    {
                        row.map((cell) => (
                        <td key={Math.random()}
                            className="border-b dark:border-slate-600 p-4 pl-8 text-left">{<YpStringFormatter amount={cell} identifier={categoryIdentifier}> </YpStringFormatter>}</td>
                    ))
                    }
                </tr>
            ))
            }
            </tbody>
        </table>
    );
}