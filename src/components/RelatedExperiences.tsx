import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockExperiences } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RelatedExperiencesProps {
  currentExperienceId: number;
  theme: string;
  destination: string;
  maxResults?: number;
}

const RelatedExperiences: React.FC<RelatedExperiencesProps> = ({
  currentExperienceId,
  theme,
  destination,
  maxResults = 12
}) => {
  const { formatPrice } = useCurrency();
  // Filter related experiences with priority order
  const getRelatedExperiences = () => {
    let related = mockExperiences.filter(exp => Number(exp.id) !== Number(currentExperienceId));
    
    // Priority 1: Same theme
    const sameTheme = related.filter(exp => exp.theme === theme);
    
    // Priority 2: Same destination/region
    const sameDestination = related.filter(exp => 
      exp.location_text.toLowerCase().includes(destination.toLowerCase()) ||
      destination.toLowerCase().includes(exp.location_text.toLowerCase())
    );
    
    // Priority 3: Highest rated or most popular (simulate with random selection)
    const popular = related.sort((a, b) => b.base_price - a.base_price);
    
    // Combine with priority order, avoiding duplicates
    const combined: any[] = [];
    const addUnique = (experiences: typeof mockExperiences) => {
      experiences.forEach(exp => {
        if (!combined.find((c: any) => Number(c.id) === Number(exp.id)) && combined.length < maxResults) {
          combined.push(exp);
        }
      });
    };
    
    addUnique(sameTheme);
    addUnique(sameDestination);
    addUnique(popular);
    
    return combined.slice(0, maxResults);
  };

  const relatedExperiences = getRelatedExperiences();

  // Initialize carousel functionality after component mounts
  useEffect(() => {
    const wireRelatedCarousel = () => {
      const root = document.querySelector('#related-experiences');
      if (!root) return;
      
      const track = root.querySelector('.rel-track') as HTMLElement;
      const prev = root.querySelector('.rel-prev') as HTMLButtonElement;
      const next = root.querySelector('.rel-next') as HTMLButtonElement;
      const source = root.querySelector('#rel-source') as HTMLElement;
      const tpl = root.querySelector('#rel-card-template') as HTMLTemplateElement;
      
      if (!track || !prev || !next || !source || !tpl) return;

      // Read all source items from data attributes
      const readItems = () => {
        return Array.from(source.querySelectorAll('.item')).map((el: any) => ({
          href: el.dataset.href || '#',
          title: el.dataset.title || 'Experience',
          img: el.dataset.img || '/images/placeholder-16x9.jpg',
          imgAlt: el.dataset.imgAlt || el.dataset.title || 'Experience image',
          destination: el.dataset.destination || '',
          theme: el.dataset.theme || ''
        }));
      };

      // Build card node from data
      const cardFromData = (d: any) => {
        const node = tpl.content.cloneNode(true) as DocumentFragment;
        const card = node.querySelector('.rel-card') as HTMLElement;
        if (!card) {
          console.warn('RelatedExperiences: rel-card template not found');
          return document.createElement('div');
        }
        const a1 = card.querySelector('.rel-media') as HTMLAnchorElement;
        a1.href = d.href;
        const img = card.querySelector('img') as HTMLImageElement;
        img.src = d.img;
        img.alt = d.imgAlt;
        img.addEventListener('error', () => { 
          img.src = '/images/placeholder-16x9.jpg'; 
        }, { once: true });
        const titleLink = card.querySelector('.rel-title a') as HTMLAnchorElement;
        titleLink.href = d.href;
        titleLink.textContent = d.title;
        const destSpan = card.querySelector('.rel-destination') as HTMLElement;
        destSpan.textContent = d.destination;
        const themeSpan = card.querySelector('.rel-theme') as HTMLElement;
        themeSpan.textContent = d.theme;
        const btn = card.querySelector('.rel-view') as HTMLAnchorElement;
        btn.href = d.href;
        return card;
      };

      // Determine columns based on viewport
      const columnsForViewport = () => {
        return window.matchMedia('(max-width: 1024px)').matches ? 1 : 2;
      };

      // Build slides: each slide contains "cols" cards
      const buildSlides = () => {
        track.innerHTML = '';
        const items = readItems();
        if (!items.length) return;

        const cols = columnsForViewport(); // 1 or 2
        for (let i = 0; i < items.length; i += cols) {
          const slide = document.createElement('div');
          slide.className = 'rel-slide';
          const slice = items.slice(i, i + cols);
          slice.forEach(item => slide.appendChild(cardFromData(item)));
          track.appendChild(slide);
        }
        updateButtons();
      };

      const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll;
      };

      const slideWidth = () => {
        const slide = track.querySelector('.rel-slide') as HTMLElement;
        return slide ? Math.ceil(slide.getBoundingClientRect().width + 16) : track.clientWidth;
      };

      // Clear any existing event listeners and add new ones
      const newPrev = prev.cloneNode(true) as HTMLButtonElement;
      const newNext = next.cloneNode(true) as HTMLButtonElement;
      
      prev.replaceWith(newPrev);
      next.replaceWith(newNext);

      newPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = slideWidth();
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });
      
      newNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = slideWidth();
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });
      
      track.addEventListener('scroll', updateButtons);
      window.addEventListener('resize', buildSlides, { passive: true });

      // Initialize
      buildSlides();
    };

    wireRelatedCarousel();
  }, [relatedExperiences]);

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (relatedExperiences.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Similar Experiences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedExperiences.map((exp) => (
          <Card key={exp.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={exp.images[0]}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <Badge className={`mb-2 ${getThemeColor(exp.theme)}`}>
                    {exp.theme}
                  </Badge>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {exp.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{exp.location_text}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{exp.duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Up to {exp.capacity}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exp.description.slice(0, 80)}...
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="font-bold text-foreground">
                    {formatPrice(exp.base_price)}
                    <span className="text-sm font-normal text-muted-foreground">/person</span>
                  </div>
                  <Link to={`/experience/${exp.slug}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedExperiences;