import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockExperiences } from "@/data/mockData";

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
  maxResults = 8
}) => {
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

  if (relatedExperiences.length === 0) {
    return null;
  }

  return (
    <section className="related-experiences v2" id="related-experiences">
      {/* Header FIRST */}
      <h2 className="rel-heading">You might also like…</h2>

      <div className="rel-viewport" aria-live="polite">
        <div className="rel-track">{/* Slides will be built here by JS */}</div>
      </div>

      <div className="rel-nav" aria-label="Similar experiences navigation">
        <button className="rel-prev" aria-label="Previous slide">‹</button>
        <button className="rel-next" aria-label="Next slide">›</button>
      </div>

      {/* Card template */}
      <template id="rel-card-template">
        <article className="rel-card">
          <a className="rel-media" href="#">
            <img src="" alt="" loading="lazy" />
          </a>
          <div className="rel-body">
            <h3 className="rel-title"><a href="#"></a></h3>
            <div className="rel-meta">
              <span className="rel-destination"></span>
              <span className="rel-theme"></span>
            </div>
            <a className="btn rel-view" href="#">View experience</a>
          </div>
        </article>
      </template>

      {/* Source data container (hidden) */}
      <div id="rel-source" hidden>
        {relatedExperiences.map((exp) => (
          <div
            key={exp.id}
            className="item"
            data-href={`/experience/${exp.slug}`}
            data-title={exp.title}
            data-img={exp.images[0]}
            data-img-alt={exp.title}
            data-destination={exp.location_text}
            data-theme={exp.theme}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedExperiences;