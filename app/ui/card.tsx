import {TrendingArrow} from "@/app/ui/trending-arrow";
import {Icon} from "@/app/ui/icon";
import YpStringFormatter from "@/app/util/yp-string-formatter";

export function Card({value, target, currentTarget, description, type, identifier}: {
    value: number;
    target: number;
    currentTarget: number;
    description: string;
    type: 'incremental' | 'decremental';
    identifier: string;
}) {

    console.log(identifier);

    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <Icon identifier='loan' style={"h-5 w-5 text-gray-700"} ></Icon>
                <h3 className="ml-2 text-sm font-medium">{description}</h3>
            </div>
            <div className={"truncate rounded-xl bg-white px-4 py-8  grid grid-cols-5"}>
                <div className={`col-span-2`}>
                    <TrendingArrow value={value} target={currentTarget} type={type} style={"h-14 mx-20"}></TrendingArrow>
                </div>
                <div className={`text-left text-2xl col-span-3`}>
                    <p>
                        <YpStringFormatter amount={value} identifier={identifier}></YpStringFormatter>
                    </p>
                    <p className="text-base leading-7 text-gray-500">Target:  <YpStringFormatter amount={target} identifier={identifier}></YpStringFormatter></p>
                </div>
            </div>
        </div>
    );
}