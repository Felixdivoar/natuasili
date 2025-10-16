# AsiliChat Upgrade - Proactive Experience Recommendations

## Overview
AsiliChat has been upgraded to proactively guide users to bookable conservation experiences with intelligent recommendations and verified links.

## Key Features

### 1. **Experience Index System**
- Runtime experience indexing from database
- Auto-refresh every 12 hours
- Manual overrides for critical experiences (Reteti, Mara Elephant Project, Ruko, etc.)
- Canonical URL mapping to prevent 404s

### 2. **Smart Entity & Intent Detection**
Recognizes:
- **Intents**: book, learn, pricing, volunteer, donate
- **Themes**: elephants, giraffes, rhinos, marine, community, birds, forest
- **Locations**: Samburu, Laikipia, Mara, Nairobi, Coast, Watamu, Diani, etc.

### 3. **Intelligent Search Ranking**
Experiences scored by:
- Theme match (+50 points)
- Location match (+30 points)
- Keyword relevance (+10 points)
- Manual overrides (highest priority)

### 4. **Rich Experience Cards**
Each recommendation includes:
- Hero image with hover effects
- Title, location, duration
- Theme pills (visual categorization)
- Price (KES, localized)
- "Book Now" CTA with direct links
- Gradient backgrounds and animations

### 5. **Link Validation** (Optional)
- Validates URLs before sending (currently disabled for performance)
- Fallback to `/experiences` category if link fails
- Broken link monitoring and logging

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
All these queries should return valid experiences with working links:

1. **"book an elephant trip"**
   - Returns: Reteti + Mara Elephant Project experiences
   - Themes: Elephants theme link

2. **"reteti"**
   - Returns: Reteti Elephant Sanctuary card (200 OK)

3. **"giraffe sanctuary"**
   - Returns: Ruko Giraffe card + theme page

4. **"marine conservation coast"**
   - Returns: Watamu, Diani, REEFolution experiences

5. **"volunteer behind the scenes"**
   - Returns: Conservation volunteering options

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
- `buildExperienceIndex()` - Caches experiences from database
- `detectIntent()` - Analyzes user message for booking intent
- `detectEntities()` - Extracts themes and locations
- `searchExperiences()` - Ranks and returns top matches
- `getValidatedUrl()` - Ensures links work (optional validation)

### Frontend (Widget)
**File**: `src/components/AsiliChatWidget.tsx`

Features:
- Rich experience cards with images, themes, pricing
- Hover animations and gradients
- Direct navigation to experience pages
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

1. **Index Caching**: 12-hour refresh interval
2. **Link Validation**: Disabled by default (3s timeout when enabled)
3. **Result Limiting**: Max 4 experiences per response
4. **Parallel Tool Calls**: Species, partners, carbon, experiences called simultaneously

## Configuration for Production

### Update BASE_URL
```typescript
// In edge function
const BASE_URL = Deno.env.get('BASE_URL') || 'https://natuasili.com';
```

### Enable Link Validation (Optional)
Uncomment in `getValidatedUrl()` function:
```typescript
const isValid = await validateUrl(url);
if (!isValid) {
  console.warn(`⚠️ Invalid URL: ${url}`);
  brokenLinks.push({ slug, url, timestamp: new Date() });
  return `${BASE_URL}${FALLBACK_CATEGORY}`;
}
```

### Monitor Broken Links
```sql
-- Check broken links table (if implemented)
SELECT * FROM asili_chat_broken_links 
ORDER BY created_at DESC 
LIMIT 20;
```

## System Prompt

AsiliChat uses a concise, action-oriented prompt:
- Under 80 words for responses
- Proactive experience suggestions
- Conservation impact highlighting
- Clear booking CTAs
- Theme exploration options

## Maintenance

### Adding New Overrides
Edit `EXPERIENCE_OVERRIDES` map:
```typescript
const EXPERIENCE_OVERRIDES: Record<string, string> = {
  'new keyword': 'experience-slug-in-database',
  // ...
};
```

### Updating Entity Keywords
Edit `ENTITY_KEYWORDS` map:
```typescript
const ENTITY_KEYWORDS: Record<string, string[]> = {
  'theme_name': ['keyword1', 'keyword2', 'synonym'],
  // ...
};
```

### Refresh Experience Index
Automatically refreshes every 12 hours. Manual refresh on function restart.

## Future Enhancements

1. **WhatsApp Deep Links**: Prefilled context messages
2. **Theme Pages**: Direct links to `/themes/elephants`, `/themes/marine`
3. **Availability Checks**: Real-time booking availability
4. **Price Comparisons**: "Similar experiences from KES X"
5. **Multi-experience Itineraries**: "Plan your 3-day trip"
6. **Image Generation**: Dynamic experience visuals
7. **Voice Support**: Audio queries and responses

## Troubleshooting

### Experience Not Appearing
1. Check `visible_on_marketplace = true` in database
2. Verify slug matches override map
3. Check theme/location keywords
4. Review scoring logic (minimum score = 0)

### 404 Errors
1. Verify slug exists in database
2. Check BASE_URL configuration
3. Enable link validation temporarily
4. Review broken links log

### Slow Responses
1. Disable link validation
2. Check OpenAI API key (uses fallback if missing)
3. Reduce result limit (currently 4)
4. Monitor Supabase query performance

## Success Metrics

- **Zero 404s**: All recommended experiences open valid pages
- **High Conversion**: Users click "Book Now" on suggestions
- **Proactive Engagement**: 2-4 experiences per response
- **Fast Response**: <2s from query to display
- **Smart Ranking**: Relevant experiences appear first

---

**Version**: 1.0  
**Last Updated**: 2025-10-16  
**Status**: ✅ Production Ready
