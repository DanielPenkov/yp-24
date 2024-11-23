export type UpdateGoalInput = {
    id: number;
    name: string;
    description: string;
    current_value: number;
    target: number;
    unit_id: number | null;
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

export type WebhookDataMetric = {
    name: string;
    data?: WebhookDataItem[],
    distance?: {
        units: string;
        qty: number
    }
    start?: string;
    units?: string;
};

export type WebhookDataItem = {
    date: string;
    qty?: number;
};
