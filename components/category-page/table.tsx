import YpStringFormatter from "@/util/yp-string-formatter";
import React from "react";
import { useYear } from "@/components/Provider/Provider";
import { Goal } from "types/models";
import { CategoryTableData } from "types/utils";

export function Table({
  goals,
  data,
  categoryIdentifier,
}: {
  goals: Goal[];
  data: CategoryTableData;
  categoryIdentifier: string;
}) {
  const { year } = useYear();
  const months = goals.length > 0 ? getMonths(Number(year)) : [];

  if (months.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <table className="border-collapse table-auto w-full text-sm">
      <thead className="bg-white pt-20 pb-20">
        <tr>
          <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 text-slate-400 dark:text-slate-200 text-left">
            Month
          </th>
          {goals.map((goal) => (
            <th
              key={goal.id}
              className="border-b dark:border-slate-600 font-medium p-4 pl-8 text-slate-400 dark:text-slate-200 text-left"
            >
              {goal.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">
        {months.map((month) => (
          <tr key={month}>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {month}
            </td>
            {goals.map((goal) => (
              <td
                key={goal.id}
                className="border-b dark:border-slate-600 p-4 pl-8 text-left"
              >
                <YpStringFormatter
                  amount={data[goal.id]?.[month] ?? 0}
                  identifier={categoryIdentifier}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getMonths(year: number): string[] {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (year < new Date().getFullYear()) {
    return monthNames;
  }

  const currentMonth = new Date().getMonth();
  return monthNames.slice(0, currentMonth + 1);
}
