import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

export const overviewRouter = router({
  overview: procedure
      .input(z.object({ identifier: z.string() }))
      .query(async ({ input }) => {
        const { identifier } = input;
        const data =  await prisma.categories.findFirst({
          where: {
            identifier: identifier
          },
          include: {
            goals: {
              include: {
                results: {
                  orderBy: {
                    date: 'asc'
                  }
                }
              }
            }
          }
        });

        if (!data) {
          return {};
        }

        const goals = getGoals(data);
        const tableData = getTableData(data);

        return {
          "goals": goals,
          "tableData": tableData,
        };
      }),
});

function getTableData(data:any) {
  const months = getMonths();
  let tableData: any = {};

  data.goals.map((goal: any) => {
    data = goal.results;
    const result: any = {};
    tableData[goal.id] = {};

    data.forEach((item: any) => {
      const month = getMonthName(item.date);

      if (!result[month] || new Date(item.date) > new Date(result[month].date)) {
        result[month] = { value: item.value, date: item.date };
      }
    });

    let lastValue = 0;
    months.map((month: any) => {
      let value = result[month] ? result[month].value : 0;

      if (value === 0) {
        value = lastValue;
      } else {
        lastValue = value;
      }

      tableData[goal.id][month] = value;
    })
  });

 return tableData;
}

function getGoals(data: any) {
  return data.goals.map((goal: any) => {

    return {
      id: goal.id,
      name: goal.name,
      type: goal.type,
      target: goal.target,
      current_value: getLatestValue(goal.results),
      current_target: getGoalCurrentTarget(goal)
    }
  });
}

function getLatestValue(results:any) {
  const latestRecord = results.reduce((latest: any, current: any) => {
    return new Date(latest.date) > new Date(current.date) ? latest : current;
  });

  return latestRecord.value;
}

function getGoalCurrentTarget(goal: any) {
  const results = goal.results;

  const goalInitialRecord = results.reduce((earliest: any, current: any) => {
    return new Date(current.date) < new Date(earliest.date) ? current : earliest;
  });

    const currentMonth = new Date().getMonth();
    const yearCompleted: number = currentMonth / 12;

    const target: number = goal.target.toNumber();

    if (goal.type === "decremental") {
      const goalInitialValue: number = goalInitialRecord ? (goalInitialRecord.value ? goalInitialRecord.value.toNumber() : 0.00) : 0.00;

      console.log(goalInitialValue - ((goalInitialValue - target) * yearCompleted));

      return goalInitialValue - ((goalInitialValue - target) * yearCompleted);
    }

    return target * yearCompleted;
}

function getMonthName(dateStr: any) {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long' });
}

function getMonths() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = new Date().getMonth();
  return monthNames.slice(0, currentMonth + 1);
}
