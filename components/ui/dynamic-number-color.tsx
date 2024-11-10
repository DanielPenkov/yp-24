import YpStringFormatter from "@/util/yp-string-formatter";

type DynamicNumberColorProps = {
  value: number;
  goal: string;
  target: number;
  style?: string;
  type: "decremental" | "incremental";
};

export function DynamicNumberColor({
  value,
  goal,
  target,
  type,
  style = "",
}: DynamicNumberColorProps) {
  switch (type) {
    case "decremental":
      return (
        <span
          className={`${style} ${value > target ? "text-red-500" : "text-green-500"}`}
        >
          <YpStringFormatter identifier={goal} amount={value} />
        </span>
      );

    case "incremental":
      return (
        <span
          className={`${style} ${value < target ? "text-red-500" : "text-green-500"}`}
        >
          <YpStringFormatter identifier={goal} amount={value} />
        </span>
      );
  }
}
