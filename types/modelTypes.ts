import { Prisma } from "@prisma/client";
import { z } from 'zod';
import {Decimal} from "decimal.js";

export type BaseCategory = Prisma.categoriesGetPayload<{}>;
type BaseGoal = Prisma.goalsGetPayload<{}>;

export type Category = BaseCategory & {
    goals?: Goal[];
}

export type Goal = BaseGoal & {
    category?: Prisma.categoriesGetPayload<{}>;
    results?: Prisma.resultsGetPayload<{}>[];
    current_target?: Decimal
}

export type UpdateGoalInput = {
    id: number;
    name: string;
    description: string;
    current_value: number;
    target: number;
};

export type CreateGoalInput = {
    category_id: number;
    unit_id: number | null;
    name: string;
    description: string;
    type: "incremental" | "decremental";
    year: number;
    current_value: number;
    target: number;
};

export interface TableData {
    [goalId: number]: {
        [month: string]: number;
    };
}

export type Result = Prisma.resultsGetPayload<{}>;

export const GetGoalExpectedValueInput = z.object({
    id: z.number(),
});

export const AddDataInput = z.object({
    goal_id: z.number(),
    value: z.number(),
    date: z.string(),
});

export type GetGoalExpectedValueOutput = number;