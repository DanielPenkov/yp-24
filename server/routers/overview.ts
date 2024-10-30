import { procedure, router } from "../trpc";
import {Prisma, PrismaClient} from "@prisma/client";
import { z } from "zod";
import { Category, TableData } from "types/modelTypes";
import { Goal } from "types/modelTypes";
import { Result } from "types/modelTypes";
import { Decimal } from 'decimal.js';

const prisma = new PrismaClient();

export const overviewRouter = router({
  overview: procedure
    .input(
      z.object({
        identifier: z.string(),
        year: z.string(),
      }),
    )
    .query(
      async ({ input }): Promise<{ goals: Goal[]; tableData: TableData }> => {
        const { identifier, year } = input;
        const data = await prisma.categories.findFirst({
          where: {
            identifier: identifier,
            goals: {
              some: {
                year: Number(year),
              },
            },
          },
          include: {
            goals: {
              where: {
                year: Number(year),
              },
              include: {
                results: {
                  orderBy: {
                    date: "asc",
                  },
                },
              },
            },
          },
        });

        if (!data) {
          return { goals: [], tableData: {} };
        }

        const goals = getGoals(data);
        const tableData = getTableData(data, year);

        return {
          goals: goals,
          tableData: tableData,
        };
      },
    ),
});

function getTableData(data: Category, year: string): TableData {
  const months = getMonths(year);
  let tableData: TableData = {};

  if (!data.goals) {
    return tableData;
  }

  data.goals.map((goal) => {
    const result: { [month: string]: Result } = {};
    tableData[goal.id] = {};

    if (!goal.results) {
      return;
    }

    goal.results.forEach((item) => {
      const month = getMonthName(item.date);

      if (
        !result[month] ||
        new Date(item.date) > new Date(result[month].date)
      ) {
        result[month] = {
          value: item.value,
          date: item.date,
          goal_id: item.goal_id,
          id: item.id,
        };
      }
    });

    let lastValue = 0.0;

    months.forEach((month) => {
      let value = 0.0;

      if (result[month] && result[month].value !== null) {
          value = result[month].value?.toNumber() ?? 0.0;
      }

      if (value === 0) {
        value = lastValue;
      } else {
        lastValue = value;
      }

      tableData[goal.id][month] = value;
    });
  });

  return tableData;
}

function getGoals(data: Category): Goal[] {

  if (!data.goals) {
    return [];
  }

  return data.goals.map((goal) => {
    return {
      id: goal.id,
      category_id: goal.category_id,
      description: goal.description,
      unit_id: goal.unit_id,
      year: goal.year,
      name: goal.name,
      type: goal.type,
      target: goal.target,
      current_value: new Decimal(getLatestValue(goal.results ?? [])),
      current_target: new Decimal(getGoalCurrentTarget(goal)),
    };
  });
}

function getLatestValue(results: Result[]): number {
  const latestRecord = results.reduce((latest, current) => {
    return new Date(latest.date) > new Date(current.date) ? latest : current;
  });

  return latestRecord.value?.toNumber() ?? 0.0;
}

function getGoalCurrentTarget(goal: Goal): number {
  const results = goal.results;

  if (!results) {
    return 0.0;
  }

  const goalInitialRecord = results.reduce((earliest, current) => {
    return new Date(current.date) < new Date(earliest.date)
      ? current
      : earliest;
  });

  const currentMonth = new Date().getMonth();
  const yearCompleted: number = currentMonth / 12;

  const target: number = goal.target.toNumber() ?? 0.0;

  if (goal.type === "decremental") {
    const goalInitialValue: number = goalInitialRecord
      ? goalInitialRecord.value?.toNumber() ?? 0.0
      : 0.0;

    return goalInitialValue - (goalInitialValue - target) * yearCompleted;
  }

  return target * yearCompleted;
}

function getMonthName(date: Date): string {
  return date.toLocaleString("default", { month: "long" });
}

function getMonths(year: string): string[] {
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

  if (parseInt(year) < new Date().getFullYear()) {
    return monthNames;
  }

  const currentMonth = new Date().getMonth();
  return monthNames.slice(0, currentMonth + 1);
}
