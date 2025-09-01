import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import Carousel from "@/components/Carousel";
import { recommendExperiences } from "@/lib/ai";
import { useEffect, useState } from "react";

const heroImage = "/lovable-uploads/86a97e9c-06e8-4907-baf7-f6cfa229935f.png";

const DESTS = [
  { label:"Nairobi", slug:"nairobi", img:"/src/assets/destinations/nairobi-destination.jpg" },
  { label:"Coastal Kenya", slug:"coast", img:"/src/assets/destinations/coast-destination.jpg" },
  { label:"Samburu", slug:"samburu", img:"/src/assets/destinations/samburu-destination.jpg" },
  { label:"Masai Mara", slug:"masai-mara", img:"/src/assets/destinations/masai-mara-destination.jpg" },
  { label:"Laikipia", slug:"laikipia", img:"/src/assets/destinations/laikipia-destination.jpg" },
];

const THEMES = [
  { label:"Wildlife", slug:"wildlife", img:"/src/assets/big-five-tracking.jpg" },
  { label:"Marine", slug:"marine", img:"/src/assets/local-ocean-conservation.jpg" },
  { label:"Community", slug:"community", img:"/src/assets/samburu-education.jpg" },
  { label:"Culture", slug:"culture", img:"/src/assets/beadwork-workshop.jpg" },
];

const PARTNERS15 = [
  { name:"Ol Pejeta Conservancy", loc:"Laikipia", logo:"/src/assets/natuasili-logo.png" },
  { name:"Samburu Trust", loc:"Samburu", logo:"/src/assets/natuasili-logo.png" },
  { name:"Kenya Wildlife Service", loc:"Kenya", logo:"/src/assets/natuasili-logo.png" },
  { name:"Nature Kenya", loc:"Nairobi", logo:"/src/assets/natuasili-logo.png" },
  { name:"Reteti Elephant Sanctuary", loc:"Samburu", logo:"/src/assets/natuasili-logo.png" }
];

export default function HomeLanding(){
  const { t } = useI18n();
  const [recs, setRecs] = useState<Array<any>>([]);

  useEffect(()=>{ recommendExperiences({}).then(setRecs); },[]);

  return (
    <>
      {/* FULL-WIDTH HERO */}
      <section className="hero-full bg-cover bg-center relative" style={{backgroundImage:`url(${heroImage})`}}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="hero-inner text-white relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">{t("hero_title")}</h1>
          <p className="mt-4 text-white/90 text-lg max-w-2xl">{t("hero_sub")}</p>
          <div className="mt-6 flex gap-3">
            <Link to="/marketplace" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">{t("cta_explore")}</Link>
            <Link to="/destinations" className="rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors">Explore Kenya</Link>
          </div>
        </div>
      </section>

      {/* EXPLORE BY DESTINATION (carousel) */}
      <section className="na-container section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("section_explore_dest")}</h2>
          <Link to="/destinations" className="text-sm underline hover:no-underline">All destinations</Link>
        </div>
        <div className="mt-3">
          <Carousel>
            {DESTS.map(d=>(
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="min-w-[260px] overflow-hidden rounded-xl border bg-white hover:shadow-lg transition-shadow">
                <img src={d.img} alt={d.label} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="font-semibold text-lg">{d.label}</div>
                  <div className="text-sm text-muted-foreground">Kenya</div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* EXPLORE BY IMPACT THEME (carousel) */}
      <section className="na-container section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("section_explore_theme")}</h2>
          <Link to="/themes" className="text-sm underline hover:no-underline">All themes</Link>
        </div>
        <div className="mt-3">
          <Carousel>
            {THEMES.map(th=>(
              <Link key={th.slug} to={`/themes/${th.slug}`} className="min-w-[260px] overflow-hidden rounded-xl border bg-white hover:shadow-lg transition-shadow">
                <img src={th.img} alt={th.label} className="h-40 w-full object-cover" />
                <div className="p-4 font-semibold text-lg">{th.label}</div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* FEATURED EXPERIENCES (carousel) */}
      <section className="na-container section">
        <h2 className="text-2xl font-bold mb-4">{t("section_featured")}</h2>
        <div className="mt-3">
          <Carousel>
            {recs.map(r=>(
              <Link key={r.id} to={r.url} className="min-w-[300px] rounded-xl border overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <img src={r.img} alt={r.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="font-semibold text-lg mb-2">{r.title}</div>
                  <div className="text-sm text-accent font-semibold">From KES {r.priceFromKES?.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* PARTNERS (15 logos carousel) */}
      <section className="na-container section">
        <h2 className="text-2xl font-bold mb-4">{t("section_partners")}</h2>
        <div className="mt-3">
          <Carousel>
            {PARTNERS15.map(p=>(
              <div key={p.name} className="min-w-[200px] rounded-xl border bg-white p-4 flex items-center gap-3 hover:shadow-lg transition-shadow">
                <img src={p.logo} alt={p.name} className="h-10 w-10 object-contain" />
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.loc}, Kenya</div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* IMPACT STORIES (carousel) */}
      <section className="na-container section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("section_stories")}</h2>
          <Link to="/blog" className="text-sm underline hover:no-underline">All stories</Link>
        </div>
        <div className="mt-3">
          <Carousel>
            {[1,2,3,4].map(i=>(
              <Link key={i} to={`/blog/story-${i}`} className="min-w-[320px] rounded-xl border overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <img src={`/src/assets/blog/impact-metrics-blog.jpg`} alt={`Story ${i}`} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="font-semibold text-lg mb-2">Partner spotlight #{i}</div>
                  <div className="text-sm text-accent">Read full story →</div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>
    </>
  );
}