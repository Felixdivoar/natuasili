import { useI18n } from "./I18nProvider";
import { DICT } from "./dict";

type Dict = typeof DICT.en;

export default function T({ k }: { k: keyof Dict }) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}