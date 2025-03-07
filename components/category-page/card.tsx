import { TrendingArrow } from "@/components/ui/trending-arrow";
import { Icon } from "@/components/ui/icon";
import YpStringFormatter from "@/util/yp-string-formatter";
import {CardProps} from "types/utils";

export function Card({ value, target, currentTarget, description, type, identifier }: CardProps) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <Icon identifier="loan" style="h-5 w-5 text-gray-700" />
                <h3 className="ml-2 text-sm font-medium">{description}</h3>
            </div>
            <div className="truncate rounded-xl bg-white px-4 py-8 grid grid-cols-5">
                <div className="col-span-2">
                    <TrendingArrow value={value} target={currentTarget} type={type} style="h-14 mx-20" />
                </div>
                <div className="text-left text-2xl col-span-3">
                    <p>
                        <YpStringFormatter amount={value} identifier={identifier} />
                    </p>
                    <p className="text-base leading-7 text-gray-500">
                        Target: <YpStringFormatter amount={target} identifier={identifier} />
                    </p>
                </div>
            </div>
        </div>
    );
}