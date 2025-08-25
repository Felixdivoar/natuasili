import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star } from "lucide-react";
import { mockExperiences, mockProjects } from "@/data/mockData";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  maxResults = 6
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

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Wildlife': return 'bg-wildlife/10 text-wildlife border-wildlife/20';
      case 'Livelihoods': return 'bg-livelihoods/10 text-livelihoods border-livelihoods/20';
      case 'Education': return 'bg-education/10 text-education border-education/20';
      case 'Habitat': return 'bg-habitat/10 text-habitat border-habitat/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const relatedExperiences = getRelatedExperiences();

  // Initialize carousel functionality after component mounts
  useEffect(() => {
    const wireRelated = () => {
      const root = document.querySelector('#related-experiences');
      if (!root) return;
      
      const track = root.querySelector('.rel-track') as HTMLElement;
      const prev = root.querySelector('.rel-prev') as HTMLButtonElement;
      const next = root.querySelector('.rel-next') as HTMLButtonElement;
      
      if (!track || !prev || !next) return;

      // Cap to max 6 cards
      const cards = Array.from(track.querySelectorAll('.rel-card'));
      cards.slice(6).forEach(c => c.remove());

      // Scroll logic
      const cardStep = () => {
        const card = track.querySelector('.rel-card') as HTMLElement;
        if (!card) return 320;
        const rect = card.getBoundingClientRect();
        return Math.ceil(rect.width + 16); // width + gap
      };

      const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll;
      };

      prev.addEventListener('click', () => {
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
      
      next.addEventListener('click', () => {
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });
      
      track.addEventListener('scroll', updateButtons);
      window.addEventListener('resize', updateButtons, { passive: true });

      // Initial state
      updateButtons();
    };

    wireRelated();
  }, [relatedExperiences]);

  if (relatedExperiences.length === 0) {
    return null;
  }

  return (
    <section className="related-experiences gyg-like" id="related-experiences">
      <div className="rel-header">
        <h2>You might also like…</h2>
      </div>

      <div className="rel-viewport">
        <div className="rel-track">
          {relatedExperiences.slice(0, 6).map((experience: any) => {
            const project = mockProjects.find(p => p.id === experience.project_id);
            
            return (
              <article key={experience.id} className="rel-card">
                <Link className="rel-media" to={`/experience/${experience.slug}`}>
                  <img 
                    src={experience.images[0]} 
                    alt={experience.title}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/images/placeholder-16x9.jpg';
                      img.alt = experience.title || 'Experience image';
                    }}
                  />
                </Link>
                <div className="rel-body">
                  <h3 className="rel-title">
                    <Link to={`/experience/${experience.slug}`}>{experience.title}</Link>
                  </h3>
                  <div className="rel-meta">
                    <span className="rel-destination">{experience.location_text}</span>
                    <span className="rel-theme theme-chip">
                      <Link to={`/marketplace?theme=${encodeURIComponent(experience.theme.toLowerCase().replace(/\s+/g, '-'))}`}>
                        {experience.theme}
                      </Link>
                    </span>
                  </div>
                  <Link className="btn rel-view" to={`/experience/${experience.slug}`}>
                    View experience
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="rel-nav">
        <button className="rel-prev" aria-label="Previous">‹</button>
        <button className="rel-next" aria-label="Next">›</button>
      </div>
    </section>
  );
};

export default RelatedExperiences;