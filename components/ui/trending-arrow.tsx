import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export function TrendingArrow({value, target, type, style}: {
    value: any;
    target: any;
    style: string;
    type: 'decremental' | 'incremental';
}) {
    switch (type) {
        case 'decremental':
            if (value > target) {
                return <ArrowTrendingDownIcon className={style + " " + "text-red-500"}></ArrowTrendingDownIcon>
            }

            return <ArrowTrendingUpIcon className={style  + " " + "text-green-500"}></ArrowTrendingUpIcon>
        case 'incremental':
            if (value < target) {
                return <ArrowTrendingDownIcon className={style  + " " + "text-red-500"}></ArrowTrendingDownIcon>
            }

            return <ArrowTrendingUpIcon className={style  + " " + "text-green-500"}></ArrowTrendingUpIcon>
    }
}