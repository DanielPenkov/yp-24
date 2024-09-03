
import {
    BanknotesIcon,
    HomeIcon,
    CurrencyDollarIcon,
    MusicalNoteIcon
} from '@heroicons/react/24/outline';


const iconMap = {
    loan: HomeIcon,
    savings: BanknotesIcon,
    finance: CurrencyDollarIcon,
    art: MusicalNoteIcon
};

export function Icon({identifier, style}: {
    identifier: string;
    style: string;
}) {
    const Icon = iconMap[identifier];

    return (
        <>
            {Icon ? <Icon className={style}/> : null}
        </>
    );
}