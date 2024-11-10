export type YpStringFormatterProps = {
  amount: number;
  identifier: string;
};

export type CategoryTableData = {
  [goalId: number]: {
    [month: string]: number;
  };
};

export type CardProps =  {
  value: number;
  target: number;
  currentTarget: number;
  description: string;
  type: 'incremental' | 'decremental';
  identifier: string;
}
