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

        if (data) {
          const tableColumns = getTableColumns(data);
          const goals = getGoals(data);
          const tableRows = getTableRows(tableColumns, data);

          return [{
            "name": data.name,
            "goals": goals,
            "tableColumns": tableColumns,
            "tableRows": tableRows
          }];
        }
      }),
});

function getTableRows(tableColumns: any, data:any) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = new Date().getMonth();
  const months = monthNames.slice(0, currentMonth + 1);

  let response: any = [];

  months.map((month: any) => {
    response.push([month])
  });

  let resultsByGoal: any = {};

  data.goals.map((record: any) => {
   resultsByGoal[record.name] = [];

    record.results.map((result: any) => {
      let monthName = result.date.toLocaleString('en-US', { month: 'long' });
      resultsByGoal[record.name].push({[monthName]: result.value});
    })
  });

  let final: any = [];

 months.map((month: any) => {
    let datum = [month];

    tableColumns.map((column: any) => {
      if (column !== "Month") {
        resultsByGoal[column].map((result: any) => {
          if (result[month]) {
            datum.push(result[month]);
          }
        });
      }
    });

    final.push(datum);
  });

 response = [];

 final.map((row: any) => {
   if (row.length > 1) {
     response.push(row);
   }
 });

 return response;
}

function getGoals(data: any) {
  const goals = data.goals.map((goal: any) => {
    return {
      name: goal.name,
      type: goal.type,
      target: goal.target,
      current_value: goal.results[0].value,
      current_target: getGoalCurrentTarget(goal)
    }
  });

  return goals;
}

function getGoalCurrentTarget(goal: any) {
  const results = goal.results;

  const goalInitialRecord = results.reduce((earliest: any, current: any) => {
    return new Date(current.date) < new Date(earliest.date) ? current : earliest;
  });

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    // @ts-ignore
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    const yearCompleted: number = day / 365;
    const target: number = goal.target.toNumber()

    if (goal.type === "decremental") {
      const goalInitialValue: number = goalInitialRecord ? (goalInitialRecord.value ? goalInitialRecord.value.toNumber() : 0.00) : 0.00;

      return goalInitialValue - ((goalInitialValue - target) * yearCompleted);
    }

    return target * yearCompleted;
}

function getTableColumns(data: any) {
  const tableColumns = data.goals.map((goal: any) => {
    return goal.name
  });

  tableColumns.unshift('Month');

  return tableColumns;
}