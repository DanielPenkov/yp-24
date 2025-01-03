import {
  BanknotesIcon,
  HomeIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon,
  StarIcon,
  BookOpenIcon,
  CodeBracketIcon,
  CogIcon, HeartIcon,
} from "@heroicons/react/24/outline";

const iconMap: { [key: string]: any } = {
  home: HomeIcon,
  savings: BanknotesIcon,
  finance: CurrencyDollarIcon,
  art: MusicalNoteIcon,
  health: StarIcon,
  reading: BookOpenIcon,
  dev: CodeBracketIcon,
  cogWheel: CogIcon,
  spiritual: HeartIcon
};

export function Icon({
  identifier,
  style,
}: {
  identifier: string;
  style: string;
}) {
  const Icon = iconMap[identifier];

  return <>{Icon ? <Icon className={style} /> : null}</>;
}
