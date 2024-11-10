import { Prisma } from "@prisma/client";
import Decimal = Prisma.Decimal;

export type Category = Prisma.categoriesGetPayload<{}> & {
  goals?: Goal[];
};

export type Goal = Prisma.goalsGetPayload<{}> & {
  category?: Prisma.categoriesGetPayload<{}>;
  results?: Prisma.resultsGetPayload<{}>[];
  current_target?: Decimal;
};

export type Unit = {
  id: number;
  identifier: string;
  name: string;
};

export type Result = Prisma.resultsGetPayload<{}>;

export type GoalData = {
  id: number;
  category_id: number;
  unit_id: number | null;
  name: string;
  description: string | null;
  type: string;
  year: number;
  target?: string;
  current_value?: string;
  current_target?: string;
  results?: {
    value: string | null;
    id: number;
    date: string;
    goal_id: number;
  }[];
};

export type CategoryData = {
  id: number;
  category_id?: number;
  unit_id?: number | null;
  name: string;
  description: string | null;
  type?: string;
  year?: number;
  identifier: string;
  target?: Prisma.Decimal | number | string;
  current_target?: Prisma.Decimal | number | string;
  current_value?: Prisma.Decimal | number | string;
  goals?: GoalData[];
};
