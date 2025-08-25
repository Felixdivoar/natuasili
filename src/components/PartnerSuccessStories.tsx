import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partnerSuccessStories } from "@/data/partnerProfiles";

const PartnerSuccessStories: React.FC = () => {
  // Initialize carousel functionality after component mounts
  useEffect(() => {
    const wirePartnerStories = () => {
      const root = document.querySelector('#partner-stories');
      if (!root) return;
      
      const track = root.querySelector('.ps-track') as HTMLElement;
      const prev = root.querySelector('.ps-prev') as HTMLButtonElement;
      const next = root.querySelector('.ps-next') as HTMLButtonElement;
      
      if (!track || !prev || !next) {
        console.warn('Partner stories carousel elements not found:', { track: !!track, prev: !!prev, next: !!next });
        return;
      }

      // Cap to 8 stories instead of 6
      const cards = Array.from(track.querySelectorAll('.ps-card'));
      cards.slice(8).forEach(c => c.remove());

      // Scroll logic
      const step = () => {
        const card = track.querySelector('.ps-card') as HTMLElement;
        if (!card) return 320;
        const rect = card.getBoundingClientRect();
        return Math.ceil(rect.width + 16);
      };

      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
      };

      // Remove existing event listeners by cloning nodes
      const newPrev = prev.cloneNode(true) as HTMLButtonElement;
      const newNext = next.cloneNode(true) as HTMLButtonElement;
      
      prev.replaceWith(newPrev);
      next.replaceWith(newNext);
      
      newPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = step();
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        setTimeout(update, 300);
      });
      
      newNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const scrollAmount = step();
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(update, 300);
      });
      
      track.addEventListener('scroll', update);
      window.addEventListener('resize', update, { passive: true });
      
      // Initial update
      update();
    };

    // Add small delay to ensure DOM is ready
    const timeoutId = setTimeout(wirePartnerStories, 200);
    
    // Also listen for DOM mutations in case component re-renders
    const observer = new MutationObserver(() => {
      if (document.querySelector('#partner-stories .ps-prev')) {
        wirePartnerStories();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="partner-stories gyg-like" id="partner-stories">
      <div className="ps-viewport">
        <div className="ps-track">
          {partnerSuccessStories.slice(0, 8).map((story) => (
            <article key={story.slug} className="ps-card">
              <Link className="ps-media" to={`/partners/success-stories/${story.slug}`}>
                <img 
                  src={story.image} 
                  alt={story.title}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/placeholder-16x9.jpg';
                    img.alt = story.title || 'Partner success story image';
                  }}
                />
              </Link>
              <div className="ps-body">
                <h3 className="ps-title">
                  <Link to={`/partners/success-stories/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className="ps-teaser">{story.teaser}</p>
                <Link className="btn ps-read" to={`/partners/success-stories/${story.slug}`}>
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="ps-nav">
        <button className="ps-prev" aria-label="Previous">‹</button>
        <button className="ps-next" aria-label="Next">›</button>
      </div>
    </section>
  );
};

export default PartnerSuccessStories;