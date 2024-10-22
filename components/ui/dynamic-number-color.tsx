import YpStringFormatter from "@/util/yp-string-formatter";

export function DynamicNumberColor({value, goal, target, type, style}: {
    value: any;
    goal: any;
    target: any;
    style: any;
    type: 'decremental' | 'incremental';
}) {
    switch (type) {
        case 'decremental':
            if (value > target) {
                return <span className={style + " " + "text-red-500"}>
                    <YpStringFormatter
                        identifier={goal}
                        amount={value}
                    />
                </span>
            }

            return <span className={style  + " " + "text-green-500"}>
                <YpStringFormatter
                    identifier={goal}
                    amount={value}
                />
            </span>
        case 'incremental':
            if (value < target) {
                return <span className={style  + " " + "text-red-500"}>
                    <YpStringFormatter
                        identifier={goal}
                        amount={value}
                    />
                </span>
            }

            return <span className={style  + " " + "text-green-500"}>
                <YpStringFormatter
                    identifier={goal}
                    amount={value}
                />
            </span>
    }
}