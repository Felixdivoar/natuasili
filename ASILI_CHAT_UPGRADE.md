# AsiliChat Upgrade - Full-Site Smart Concierge

## Overview
AsiliChat has been upgraded to be a complete site concierge with fast, validated navigation to ANY page (experiences, themes, about, partners, policies, FAQs, donate, contact, etc.), proactive suggestions, and intelligent link validation.

## Key Features

### 1. **Comprehensive Site Index**
- Runtime indexing of ALL site content:
  - Experiences (from database)
  - Static pages (About, Contact, FAQs, Privacy, Terms, Donate, etc.)
  - Theme pages (Elephants, Marine, Community, Forest, Birds, Giraffes, Rhinos)
- Manual overrides for critical experiences (Reteti, Mara Elephant Project, Ruko, etc.)
- Canonical URL mapping to prevent 404s
- Auto-refresh every 12 hours with in-memory caching

### 2. **Expanded Intent Detection**
Recognizes multiple intent types:
- **Navigation**: about, contact, policy, help, partners, impact, donate
- **Actions**: book, volunteer, donate
- **Information**: learn, pricing, compare, browse themes
- **Support**: FAQ, help, contact, WhatsApp

### 3. **Enhanced Entity Recognition**
- **Themes**: elephants, giraffes, rhinos, marine, community, birds, forest
- **Locations**: Samburu, Laikipia, Mara, Nairobi, Coast, Watamu, Diani, etc.
- **Content types**: experiences, themes, pages, posts
- **Fuzzy matching**: Handles misspellings (Masaai/Maasai, Reteti/Retheti, etc.)

### 4. **Intelligent Link Validation**
- Validates URLs before sending with 2s timeout
- 15-minute link cache (TTL) for performance
- Intelligent fallbacks:
  - Theme pages → /themes
  - Static pages → /
  - Experiences → /experiences
- Broken link monitoring and logging

### 5. **Rich Response Cards**
Two types of cards:

**Experience Cards:**
- Hero image with hover effects
- Title, location, duration
- Theme pills (visual categorization)
- Price (KES, localized)
- "Book Now" CTA with direct links

**Page Cards:**
- Title and description
- Type indicator (Theme/Page)
- Direct navigation on click
- Hover effects and animations

## Environment Configuration

```env
BASE_URL=https://preview--natuasili.lovable.app  # Update for production
FALLBACK_CATEGORY=/experiences
```

## Manual Override Map

Critical experiences are mapped to canonical slugs:

```typescript
'reteti elephant sanctuary' → 'reteti-community-elephant-experience'
'mara elephant project' → 'elephant-researcher-mara-elephant-project'
'ruko giraffe' → 'giraffe-at-ruko-sanctuary'
'ol pejeta' → 'meet-northern-white-rhinos-ol-pejeta'
// ... and more
```

## Test Queries

### ✅ PASS Criteria
All these queries should return valid pages/experiences with working links:

**Navigation Queries:**
1. **"about asili"** → Opens About page (200 OK)
2. **"contact"** / **"help"** → Opens Contact page (200 OK)
3. **"privacy policy"** → Opens Privacy page (200 OK)
4. **"terms"** → Opens Terms page (200 OK)
5. **"partners"** → Opens Partners page (200 OK)
6. **"impact"** / **"how it works"** → Opens Impact page (200 OK)
7. **"donate"** → Opens Donate page (200 OK)
8. **"faq"** → Opens FAQ page (200 OK)

**Experience Queries:**
9. **"book an elephant trip"** → Returns Reteti + Mara Elephant Project + Elephants theme
10. **"reteti"** → Returns Reteti Elephant Sanctuary card (200 OK)
11. **"giraffe sanctuary"** → Returns Ruko Giraffe card + Giraffe theme page
12. **"marine conservation coast"** → Returns Watamu, Diani, REEFolution experiences
13. **"volunteer behind the scenes"** → Returns conservation volunteering options

**Fuzzy Matching:**
14. **"masai mara elephants"** → Correct Maasai Mara experiences
15. **"retheti"** → Corrects to Reteti
16. **"olpejeta"** → Corrects to Ol Pejeta

### Example Responses

**User**: "I want to book an elephant experience"

**AsiliChat**: 
```
🐘 Great choice! Check out these amazing elephant experiences:

[Experience Card: Reteti Elephant Sanctuary]
- Community-led elephant orphanage in Samburu
- 3h experience | KES 3,000/adult
- Theme: Wildlife Conservation
- [Book Now →]

[Experience Card: Mara Elephant Project]
- Researcher experience tracking wild elephants
- 8h experience | KES 66,000/adult
- Theme: Wildlife Conservation
- [Book Now →]

Explore more: [Elephants Theme →]
```

## Architecture

### Backend (Edge Function)
**File**: `supabase/functions/asili-chat/index.ts`

Key Functions:
- `buildSiteIndex()` - Caches ALL site content (experiences, pages, themes)
- `detectIntent()` - Analyzes user message for navigation/action intent (9+ intent types)
- `detectEntities()` - Extracts themes, locations, and content types
- `searchExperiences()` - Ranks and returns top experience matches
- `tool_pageSearch()` - Searches static pages and theme pages
- `tool_experienceSearch()` - Searches experiences with intelligent ranking
- `validateUrl()` - Ensures links work with 2s timeout and caching
- `getValidatedUrl()` - Returns validated absolute URLs with intelligent fallbacks

### Frontend (Widget)
**File**: `src/components/AsiliChatWidget.tsx`

Features:
- Two card types: Experience cards and Page cards
- Rich experience cards with images, themes, pricing
- Clean page cards with type indicators
- Hover animations and gradients
- Direct navigation to any site page
- Fallback messages with helpful suggestions

## Analytics & Monitoring

### Chat Link Monitor
Tracks:
- User query
- Matched experiences
- URLs served
- Validation results
- Click events
- Broken link logs (timestamp, slug, URL)

### Failed Query Tracking
"Missed queries" logged to improve:
- Synonym expansion
- Entity detection
- Override mappings

## Performance Optimizations

1. **Link Caching**: 15-minute TTL for validated URLs (prevents redundant checks)
2. **Index Caching**: 12-hour refresh interval for site index
3. **Fast Validation**: 2s timeout for URL checks (was 3s)
4. **Result Limiting**: Max 3 pages, max 4 experiences per response
5. **Parallel Tool Calls**: Species, partners, carbon, experiences, pages called simultaneously
6. **Memory Management**: In-memory cache with automatic cleanup

## Configuration for Production

### Update BASE_URL
```typescript
// In edge function
const BASE_URL = Deno.env.get('BASE_URL') || 'https://natuasili.com';
```

### Monitor Performance
```typescript
// Cache stats are logged periodically
console.log(`📊 Link cache: ${linkCache.size} entries`);
```

### Monitor Broken Links
```sql
-- Check broken links table (if implemented)
SELECT * FROM asili_chat_broken_links 
ORDER BY created_at DESC 
LIMIT 20;
```

## System Prompt

AsiliChat uses an enhanced, concise prompt for full-site navigation:
- Under 80 words for responses
- Proactive suggestions for ANY site page
- Clear navigation guidance
- Conservation impact highlighting
- Support for policies, FAQs, and help queries

## Success Metrics

- **Zero 404s**: All recommended links open valid pages
- **Fast Response**: <2s from query to display (with caching)
- **Universal Navigation**: Can reach ANY site page
- **High Accuracy**: Fuzzy matching handles misspellings
- **Smart Ranking**: Relevant results appear first
- **Proactive Engagement**: 2-4 cards per response

---

**Version**: 2.0 (Full-Site Concierge)  
**Last Updated**: 2025-10-16  
**Status**: ✅ Production Ready
