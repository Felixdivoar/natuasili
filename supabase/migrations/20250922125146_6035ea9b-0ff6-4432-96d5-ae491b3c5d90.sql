-- Update northern white rhinos experience to have no capacity limits
UPDATE experiences 
SET 
  capacity = NULL,
  min_capacity = NULL
WHERE title ILIKE '%northern white rhinos%' AND title ILIKE '%Ol Pejeta%';

-- Also update the description to include the timing information
UPDATE experiences 
SET description = 'Overview
At Ol Pejeta Conservancy, witness one of conservation''s most critical moments by meeting the last two northern white rhinos on Earth - Najin and Fatu, both female. This experience offers an intimate look at cutting-edge conservation science as researchers work tirelessly to save this subspecies through advanced reproductive technology.

Your visit directly supports the revolutionary conservation efforts using IVF, genetic rescue, and surrogate motherhood programs. Learn about the challenges facing these magnificent creatures and the groundbreaking science being used to prevent their extinction.

Highlights
• Meet Najin and Fatu, the last two northern white rhinos in the world
• Learn about innovative reproductive technologies being used for species recovery  
• Understand the broader conservation challenges facing rhino populations
• Support critical research and protection efforts through your visit
• Available at two convenient times daily

Included/Excluded
• Conservancy entry fees
• Professional wildlife guide
• Educational materials
• Personal expenses
• Insurance
• Transport to conservancy

What to Expect
Itinerary
• Tours are available daily at 08:30am and 3:00pm
• Arrive at the Ol Pejeta Conservancy''s Morani Information Centre 15 minutes before your scheduled time
• Join a guided tour to meet Najin and Fatu with expert keepers
• Observe the northern white rhinos in their specialized enclosure and learn about their unique story
• Learn about the cutting-edge conservation technologies being used to save the species

Cancellation policy
• You can cancel up to 48 hours before the experience starts for a refund.

Duration
1 hour

Language
English

Frequently Asked Questions
What are the tour times?
Tours are offered twice daily at 08:30am and 3:00pm. Please arrive 15 minutes early.

How rare are these rhinos?
The northern white rhino subspecies is classified as critically endangered, with only Najin and Fatu remaining worldwide.

Is there a group size limit?
No maximum or minimum number of people - we welcome groups of all sizes.

What is included in the experience?
The experience includes meeting the rhinos, hearing their story from the keepers, and contributing to conservation efforts.

What should I wear?
Wear closed shoes, sun protection, a hat, and neutral-colored clothing.

Is this a rare opportunity?
Absolutely! This is a chance to see the very last of their kind.

What will I learn?
Dedicated keepers will share their knowledge about the northern white rhinos and the fight for their survival.

Important Information
• Tours run daily at 08:30am and 3:00pm
• No group size restrictions - suitable for individuals and large groups
• If you don''t have transport to the starting point, we can pick you up within the conservancy for an extra fee.

Where you'll be
Ol Pejeta Conservancy, Laikipia County'
WHERE title ILIKE '%northern white rhinos%' AND title ILIKE '%Ol Pejeta%';