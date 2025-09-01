import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { useState } from "react";

const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";

const DESTS = [
  { label:"Nairobi", slug:"nairobi" },
  { label:"Coastal Kenya", slug:"coastal-kenya" },
  { label:"Samburu", slug:"samburu" },
  { label:"Masai Mara", slug:"masai-mara" },
  { label:"Laikipia", slug:"laikipia" },
];
const THEMES = [
  { label:"Wildlife", slug:"wildlife" }, { label:"Marine", slug:"marine" },
  { label:"Community", slug:"community" }, { label:"Culture", slug:"culture" },
];

export default function HeaderMega(){
  const { t } = useI18n();
  const [open, setOpen] = useState<null|"dest"|"theme">(null);

  return (
    <header className="header-compact sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="nav-inner flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="NatuAsili" 
              className="h-6 sm:h-7 md:h-8 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-none" 
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative">
              <button className="nav-link hover:text-primary transition-colors" 
                      onMouseEnter={()=>setOpen("dest")} 
                      onFocus={()=>setOpen("dest")} 
                      onMouseLeave={()=>setOpen(null)}>
                {t("nav_destinations")}
              </button>
              {open==="dest" && (
                <div className="absolute left-0 mt-2 w-[680px] rounded-xl border bg-white p-4 shadow-xl grid grid-cols-3 gap-3"
                     onMouseEnter={()=>setOpen("dest")} onMouseLeave={()=>setOpen(null)}>
                  {DESTS.map(d=>(
                    <Link key={d.slug} to={`/destinations/kenya/${d.slug}`} className="rounded-md p-3 hover:bg-muted transition-colors">
                      <div className="font-semibold">{d.label}</div>
                      <div className="text-xs text-muted-foreground">Kenya</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button className="nav-link hover:text-primary transition-colors" 
                      onMouseEnter={()=>setOpen("theme")} 
                      onFocus={()=>setOpen("theme")} 
                      onMouseLeave={()=>setOpen(null)}>
                {t("nav_themes")}
              </button>
              {open==="theme" && (
                <div className="absolute left-0 mt-2 w-[520px] rounded-xl border bg-white p-4 shadow-xl grid grid-cols-2 gap-3"
                     onMouseEnter={()=>setOpen("theme")} onMouseLeave={()=>setOpen(null)}>
                  {THEMES.map(th=>(
                    <Link key={th.slug} to={`/themes/${th.slug}`} className="rounded-md p-3 hover:bg-muted transition-colors">
                      <div className="font-semibold">{th.label}</div>
                      <div className="text-xs text-muted-foreground">Experiences & stories</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/experiences" className="nav-link hover:text-primary transition-colors">{t("nav_experiences")}</Link>
            <Link to="/blog" className="nav-link hover:text-primary transition-colors">{t("nav_stories")}</Link>
            <Link to="/about" className="nav-link hover:text-primary transition-colors">{t("nav_about")}</Link>
            <Link to="/impact-ledger" className="nav-link hover:text-primary transition-colors">Impact Ledger</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/partner-entry" className="rounded-md bg-accent px-3 py-2 text-sm text-white hover:bg-accent/90 transition-colors">
            {t("nav_partner_with_us")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}