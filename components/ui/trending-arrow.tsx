import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

type TrendingArrowProps = {
  value: number;
  target: number;
  style?: string;
  type: "decremental" | "incremental";
};

export function TrendingArrow({
  value,
  target,
  type,
  style = "",
}: TrendingArrowProps) {
  switch (type) {
    case "decremental":
      return value > target ? (
        <ArrowTrendingDownIcon className={`${style} text-red-500`} />
      ) : (
        <ArrowTrendingUpIcon className={`${style} text-green-500`} />
      );

    case "incremental":
      return value < target ? (
        <ArrowTrendingDownIcon className={`${style} text-red-500`} />
      ) : (
        <ArrowTrendingUpIcon className={`${style} text-green-500`} />
      );
  }
}
