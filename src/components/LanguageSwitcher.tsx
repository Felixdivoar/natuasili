import { useI18n } from "@/i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  
  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className="h-9 rounded-md border border-border px-2 py-1 bg-background text-sm"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="de">DE</option>
      <option value="es">ES</option>
    </select>
  );
}