import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import impactMetricsBlog from "@/assets/blog/impact-metrics-blog.jpg";
import partnerSpotlightBlog from "@/assets/blog/partner-spotlight-blog.jpg";
import whyPartnerBlog from "@/assets/blog/why-partner-blog.jpg";
import sustainableTourismBlog from "@/assets/blog/sustainable-tourism-blog.jpg";
import communityImpactBlog from "@/assets/blog/community-impact-blog.jpg";
import conservationTechBlog from "@/assets/blog/conservation-tech-blog.jpg";
import partnerConservationImpact from "@/assets/blog/partner-conservation-impact.jpg";
import communityResilienceTourism from "@/assets/blog/community-resilience-tourism.webp";
import digitalConservationSolutions from "@/assets/blog/digital-conservation-solutions.png";
import sustainableLivelihoodsConservation from "@/assets/blog/sustainable-livelihoods-conservation.webp";
import humanWildlifeConflict from "@/assets/blog/human-wildlife-conflict.webp";
import partnerGrowImpact from "@/assets/blog/partner-grow-impact.jpg";
import beyondSafariPurpose from "@/assets/blog/beyond-safari-purpose.jpg";
import travelForGood from "@/assets/blog/travel-for-good.webp";
import hostConservationExpand from "@/assets/blog/host-conservation-expand.jpg";
import conservationCollaboration from "@/assets/blog/conservation-collaboration.webp";
import authenticKenyaExperiences from "@/assets/blog/authentic-kenya-experiences.webp";
import travelGivesBack from "@/assets/blog/travel-gives-back.jpg";
import tailoredConservationItineraries from "@/assets/blog/tailored-conservation-itineraries.webp";
import purposefulTravelExperiences from "@/assets/blog/purposeful-travel-experiences.jpg";
import maasaiMaraProject from "@/assets/maasai-mara-project.jpg";
import sambururEducation from "@/assets/samburu-education.jpg";
import karuraForestPlanting from "@/assets/karura-forest-planting.jpg";

import SimilarBlogs from "@/components/SimilarBlogs";

const blogContent = {
  "partner-natuasili-support-conservation-impact": {
    title: "Partner with Natuasili and support conservation impact",
    excerpt: "We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts.",
    category: "Host Resources",
    author: "NatuAsili Team",
    date: "2024-01-15",
    readTime: "5 min read",
    image: partnerConservationImpact,
    content: `
      <p>We see that a great part of organizations and host communities can contribute to conservation. Along with improving your profile, partnering with us directly supports conservation efforts. This blog post will highlight how collaboration with Natuasili benefits the planet as well as your organization. Working with us allows you to directly link to sustainability and conservation.</p>
      
      <h2>1. Direct impact</h2>
      <p>Travelers booking an experience with Natuasili are engaging more than just organizing their trip. They are joining a global effort to save the planet. Projects involving community empowerment and conservation get some of the money from their booking. These projects might range in nature from efforts at reforestation to preservation of threatened species to programs meant to lower ocean pollution. Being a partner means you are directly helping these initiatives. Each booking made with Natuasili is a promise toward environmental stewardship rather than only a transaction. This is a chance for every one of us to directly help protect the planet for the next generations.</p>
      
      <h2>2. Spread awareness</h2>
      <p>Reaching a global audience of travelers eager to learn and help. Our platform offers a means to increase awareness of conservation issues and solutions. From habitat loss to climate change, we share knowledge on the difficulties our planet faces and offer means for people to help find answers. Sharing your knowledge and experiences on this platform as a partner will help you to reach a market of environmentally aware travelers. Whether they choose to participate in local conservation initiatives or make more environmentally friendly decisions in their own life, your experiences can motivate visitors to act in those domains.</p>
      
      <h2>3. Public involvement in communities</h2>
      <p>We believe that everyone engaged, including the local communities, should gain from tourism. Working closely with these communities, we create travel experiences that are not only interesting for visitors but also sustainable and beneficial for the residents. These kinds of activities might call for cultural interactions, trips to locally owned companies, or research of locally important natural environments. Your efforts as a partner can help these communities preserve their unique cultural and natural heritage while simultaneously empowering them socially and economically. This strategy guarantees that travel supports local livelihoods and advances respect for cultural diversity and the surroundings.</p>
      
      <h2>4. Networking</h2>
      <p>Joining us means more than just collaborating with us; you are joining a network of driven people and organizations all committed to sustainability, community empowerment, and conservation. Members of this network can collaborate and innovate here, sharing ideas, learning from one another's experiences, and working on projects that forward our common conservation goals. Through this network, you will have chances to interact with professionals in many disciplines, learn fresh ideas about conservation issues and solutions, and offer your knowledge to help groups of people solve problems.</p>
      
      <p>Working with Natuasili lets you become part of a community dedicated to improving the environment, wildlife, and local areas all around. Working together, we can produce a travel sector more responsible and sustainable.</p>
    `
  },
  "community-resilience-conservation-tourism": {
    title: "Community resilience through conservation tourism",
    excerpt: "Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife. This blog explores how tourism can reduce reliance on compensation payouts and build community resilience.",
    category: "Purposeful Travel",
    author: "Sarah Kimani",
    date: "2024-01-12",
    readTime: "6 min read",
    image: communityResilienceTourism,
    content: `
      <p>Eco-tourism is a powerful tool for conservation, providing communities with sustainable livelihoods while protecting wildlife. This blog explores how tourism can reduce reliance on compensation payouts and build community resilience.</p>
      
      <p>Conservation tourism generates jobs, funds conservation projects, and creates awareness about the importance of protecting nature. It also reduces the economic pressure that can lead to human-wildlife conflict. For example, community conservancies like those in Kenya's Maasai Mara and Laikipia regions have become models for sustainable tourism, where wildlife conservation directly supports community development.</p>
      
      <p>One of the most significant benefits of conservation tourism is that it allows local communities to take ownership of their natural resources. By participating directly in tourism ventures, they gain economic independence and a vested interest in protecting their environment. This approach not only reduces human-wildlife conflict but also fosters a culture of conservation that extends to future generations.</p>
      
      <p>Through Natuasili, travelers can choose experiences that directly support community resilience. From visiting community conservancies to participating in wildlife monitoring, these experiences empower local people while conserving wildlife. Natuasili also supports capacity building, training local guides, and helping communities market their conservation efforts to a global audience.</p>
      
      <h2>The ripple effect of conservation tourism</h2>
      <p>When travelers choose conservation-focused experiences, the benefits extend beyond just financial gains. These visits create a ripple effect, inspiring visitors to become advocates for conservation, supporting ongoing projects, and spreading awareness about the importance of protecting nature. This, in turn, attracts more like-minded travelers, creating a sustainable cycle of conservation support.</p>
      
      <p>Building community resilience requires ongoing support and collaboration. Natuasili is committed to expanding its impact by creating more opportunities for conservation-focused travel. This includes partnering with local businesses, investing in community training, and supporting grassroots conservation initiatives that build long-term resilience.</p>
    `
  },
  "why-conservation-need-you-travel-purpose": {
    title: "Why does conservation need you? Travel with purpose",
    excerpt: "Conservation is no longer the sole responsibility of governments and ngos. It is a global call to action, one that requires the participation of individuals, communities, and travelers alike.",
    category: "Conservation and Community Engagement",
    author: "Dr. Sarah Kimani",
    date: "2024-01-14",
    readTime: "8 min read",
    image: conservationTechBlog,
    content: `
      <p>Conservation is no longer the sole responsibility of governments and ngos. It is a global call to action, one that requires the participation of individuals, communities, and travelers alike. For those who step into some of the world's most fragile ecosystems, the question is no longer "What can I see?" But rather "What impact can I create?"</p>
      
      <p>At Natuasili, we believe that travel can be a force for good, transforming visitors into active contributors to conservation and community empowerment. Every journey has the potential to preserve landscapes, protect wildlife, and uplift local communities. Tourism is one of the most powerful economic drivers in conservation areas. Africa's wildlife-based tourism alone contributes nearly $34 billion annually to local economies. However, for conservation to be truly effective, it must go beyond economic benefits. It must also foster deep connections between travelers, nature, and the communities that act as stewards of the land.</p>
      
      <h2>When done with purpose, travel provides:</h2>
      <p><strong>1. Direct funding for conservation</strong> - A portion of tourism revenue supports critical initiatives like anti-poaching efforts, habitat restoration, and species monitoring.</p>
      <p><strong>2. Community empowerment</strong> - Ethical tourism ensures local communities benefit directly, creating sustainable livelihoods linked to conservation.</p>
      <p><strong>3. Greater awareness and advocacy</strong> - Immersive conservation experiences inspire travelers to champion environmental protection long after their trip ends.</p>
      
      <h2>Experiencing conservation firsthand</h2>
      <p>Imagine standing in the heart of Ol Pejeta Conservancy, tracking black and white rhinos alongside expert guides. These aren't just wildlife encounters, they're experiences that immerse you in the ongoing fight to protect endangered species. Every visit supports conservation programs that safeguard these animals from poaching and habitat loss.</p>
      
      <p>Now, picture yourself in Laikipia, exploring vast landscapes where conservationists and communities work hand-in-hand to balance wildlife protection with sustainable development. Here, you'll see firsthand the impact of coexisting with nature, whether it's through predator-proof bomas (livestock enclosures) or innovative community conservancies that generate income from eco-tourism.</p>
      
      <p>Beyond the savannas, the conservation story extends to the Kenyan Coast, where marine ecosystems face increasing threats. Organizations like Big Ship CBO and Local Ocean Conservation work tirelessly to protect coral reefs, restore mangroves, and ensure sustainable fishing practices. By engaging with these initiatives, travelers become more than spectators; they become allies in safeguarding vital ecosystems.</p>
      
      <h2>Beyond wildlife – conservation and communities</h2>
      <p>Conservation is about more than just protecting animals. It is deeply intertwined with the well-being of the people who share their lands with wildlife. Without sustainable livelihoods, communities are often forced into unsustainable practices such as poaching or deforestation to survive. That's why conservation must also empower local people.</p>
      
      <p>Take Reteti Elephant Sanctuary in Samburu, for example. This community-led initiative is the first elephant rescue center in Africa owned and operated by the indigenous Samburu people. It not only saves and rehabilitates orphaned elephants but also provides employment opportunities for local men and women, ensuring that conservation benefits everyone.</p>
      
      <p>When travelers visit Reteti, they witness how conservation and community development go hand in hand. They see the faces behind the efforts, hear the stories of resilience, and understand that their visit directly supports these initiatives. Every journey you take can leave a legacy. Here's how you can contribute to conservation before, during, and after your trip.</p>
    `
  },
  "travel-for-good-conservation-community-impact": {
    title: "Travel for good: conservation and community impact",
    excerpt: "In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-09",
    readTime: "7 min read",
    image: travelForGood,
    content: `
      <p>In a world where travel has become more accessible than ever, an important question arises: How can we ensure that our adventures leave a positive impact?</p>
      
      <p>At Natuasili, we believe travel is more than a journey, it is a link to conservation and community empowerment. Travel, when done responsibly, has the potential to transform destinations, protect fragile ecosystems, and uplift the communities that call these places home.</p>
      
      <p>Every year, millions of tourists venture into Africa's breathtaking landscapes, from the vast savannas of the Masai Mara to the pristine shores of the Indian Ocean. Yet, conventional tourism often operates in a way that extracts more than it gives back. While revenue flows into large corporations, local communities and conservation efforts frequently receive little benefit. This is where impact-driven travel comes in. Tourism should not only provide unforgettable experiences but also create long-term benefits for the environment and the people who sustain it. At Natuasili, we are committed to ensuring that each journey contributes directly to conservation efforts and local development, turning every traveler into a donor and advocate for change.</p>
      
      <p>Travelers who choose Natuasili embark on experiences that go beyond sightseeing. Picture yourself tracking lions in Laikipia with expert conservationists and rangers, walking through the dense forests of the Chyulu Hills alongside Maasai rangers, or learning about marine conservation while standing on the white-sand beaches of the Kenyan coast. Each moment connects you to the beauty of nature and the people working tirelessly to protect it. These experiences are not just about seeing iconic destinations; they are about actively contributing to the protection of these places for future generations.</p>
      
      <h2>Why conservation tourism matters</h2>
      <p>Tourism is one of the world's largest industries, generating nearly $10 trillion annually and accounting for over 10% of global employment. However, the benefits of travel are not always distributed equally, and many fragile ecosystems suffer due to over-tourism, habitat destruction, and pollution. By shifting towards sustainable tourism, we can transform travel into a force for good:</p>
      
      <ul>
        <li><strong>Protect wildlife and ecosystems</strong> - Sustainable tourism generates funding for protected areas, anti-poaching initiatives, and wildlife conservation.</li>
        <li><strong>Support local communities</strong> - Ethical tourism ensures that indigenous groups, local businesses, and conservation workers receive fair wages and opportunities.</li>
        <li><strong>Reduce environmental impact</strong> - By choosing eco-friendly travel practices, we help reduce carbon footprints and promote responsible resource use.</li>
      </ul>
      
      <p>Our mission is clear: every traveler should leave a destination better than they found it. Through carefully curated experiences, Natuasili channels travel revenue into high-impact conservation and community projects.</p>
      
      <h2>Featured conservation experiences</h2>
      <ul>
        <li><strong>Lion tracking in Ol Pejeta Conservancy</strong> - Support conservationists working to protect lions from habitat loss and human-wildlife conflict.</li>
        <li><strong>Reteti Elephant Sanctuary</strong> - Located in Samburu, this community-run initiative rescues and rehabilitates orphaned elephants, promoting conservation through local leadership.</li>
        <li><strong>Marine conservation at the Kenyan coast</strong> - Through partnerships with local organizations, we engage travelers in coral reef restoration, sustainable fishing education, and beach clean-up efforts.</li>
      </ul>
      
      <p>By integrating travel with conservation, we ensure that each journey contributes to lasting environmental and social impact.</p>
    `
  },
  "travel-gives-back-natuasili": {
    title: "Travel that gives back with Natuasili",
    excerpt: "Travel has an amazing ability to change our lives as well as the environment around us. We are eager to share with you the intangible potential of your travels since we believe your adventures should positively affect the places you visit.",
    category: "Purposeful Travel",
    author: "Dr. Sarah Kimani",
    date: "2024-01-16",
    readTime: "6 min read",
    image: travelGivesBack,
    content: `
      <p>Travel has an amazing ability to change our lives as well as the environment around us. We are eager to share with you the intangible potential of your travels since we believe your adventures should positively affect the places you visit. Every booking you make on Natuasili directly supports conservation and community empowerment initiatives, so transforming your trip into a tool for good. This blog will show this.</p>
      
      <p>Traveling with us not only sets you on an adventure but also allows you to become part of something more. You are part of a global community of travelers who see the transforming potential of travel for good. Your travels with us have a real and long-lasting effect, as shown below:</p>
      
      <h2>1. Advocating for conservation efforts</h2>
      <p>Local conservation groups host many of the activities that you can arrange through Natuasili. These committed teams tackle the challenges of endangering our planet, safeguarding natural habitats, and saving species. Part of your booking fee goes straight toward helping one of our conservation partners with their vital work when you book an experience. You participate in actual environmental preservation, not only observe.</p>
      
      <h2>2. Empowering local communities</h2>
      <p>Many destinations have their foundations in community-based enterprises. For the locals, they offer pride, income, and possibilities. By selecting to interact with these organizations through Natuasili, you are enabling the social and financial empowerment of communities. Your contributions directly and favorably affect whether you are dining with a local family, shopping for handcrafted souvenirs, or engaging in a cultural exchange.</p>
      
      <h2>3. Conserving cultural and natural resources</h2>
      <p>The destinations that you go to are rich in natural and cultural heritage. These are the gems of our planet, therefore they should be preserved for the next generations. Your reservations on Natuasili support programs aimed at protecting these priceless resources. You are greatly helping to preserve the world's heritage whether that means safeguarding historic sites, protecting unspoiled wilderness areas, or maintaining ancient customs.</p>
      
      <p>The fact that every visitor can access this route makes it the best one. Making a difference does not depend on your level of environmentalism, philanthropy, or knowledge of community development. You only need your sense of adventure and the will to travel with intent.</p>
      
      <p>Selecting Natuasili for your travel means you are joining something bigger. You are choosing to leave the destinations you visit a lasting impression of goodwill. Your journey is a force for good as much as a personal experience. One trip at a time is a way one helps to contribute to a better world.</p>
      
      <p>Are you therefore ready to share the intangible power of your trips? With Natuasili, you are ready to explore, connect, and influence positive change. Your trip will leave a lasting impression, and it starts here. Come explore the conservation world with us one significant trip at a time. Your influence is just one booking away.</p>
    `
  },
  "tailored-kenya-conservation-itineraries": {
    title: "Tailored Kenya conservation itineraries by Natuasili",
    excerpt: "Imagine a travel experience that's tailor-made just for you. A tour that not only takes you to breathtaking destinations but also aligns perfectly with your passions and interests.",
    category: "Purposeful Travel",
    author: "James Mwangi",
    date: "2024-01-17",
    readTime: "7 min read",
    image: tailoredConservationItineraries,
    content: `
      <p>Imagine a travel experience that's tailor-made just for you. A tour that not only takes you to breathtaking destinations but also aligns perfectly with your passions and interests. We help make this dream to become a reality. This post will show you how Natuasili creates customized conservation experiences.</p>
      
      <p>We are aware that travelers are not the same as everyone has particular interests, values, and aspirations. We have thus developed a platform that gives you control over the ability to personalize. It all starts with our carefully chosen array of immersive conservation and community-based tourism activities presented by nearby enterprises and conservation organizations. These encounters satisfy a range of interests and reflect a broad spectrum. We have something that will speak to you regardless of your interests—wildlife preservation, cultural immersion, sustainable travel, or all around.</p>
      
      <h2>Customizing your itinerary, here's how it works:</h2>
      
      <h3>1. Explore authentic experiences</h3>
      <p>Start by browsing through our experience catalog. Look at the choices your selected location offers and find the ones that fit your values and interests. Would like to monitor and track lions at Ol Pejata Conservancy alongside conservationists? Maybe you would be more interested in really experiencing the rich culture of the communities around conservation areas. The choice is yours.</p>
      
      <h3>2. Personalize your itinerary</h3>
      <p>Once you've found experiences that speak to you, it's time to build your itinerary. Add these authentic experiences to your trip, creating a customized travel plan that reflects your unique preferences.</p>
      
      <h3>3. Book your experience and connect with the host</h3>
      <p>Once your host approves your booking, you're all set for your adventure. Some experiences are available for instant booking, so you can confirm your trip in just a few clicks!</p>
      
      <h2>When it comes to creating your ideal travel schedule with Natuasili, the opportunities are virtually limitless:</h2>
      
      <p><strong>1. Environmentalists for wildlife</strong> - If you're enthusiastic about wildlife conservation, you can schedule exciting activities including night game drives, tracking threatened species, or helping with wildlife collaring projects.</p>
      
      <p><strong>2. Cultural seekers</strong> - We provide chances for those looking for cultural immersion to interact with communities around conservation areas, from attending customary events to learning about the rich heritage of the chosen destination.</p>
      
      <p><strong>3. Adventure seekers</strong> - If adventure is your calling, you could incorporate mountain biking in the wild, running across beautiful scenery inside a conservancy, or even helping with park cleanliness projects.</p>
      
      <p><strong>Travelers sustainably</strong> - From eradicating invading species to attending conservation lectures, Natuasili enables environmentally conscious tourists to engage in initiatives supporting environmental protection at the destination. Your conservation travel experience is within reach using Natuasili.</p>
    `
  },
  "purposeful-travel-experiences-natuasili": {
    title: "Purposeful travel experiences with Natuasili",
    excerpt: "Are you looking for travel experiences that leave a lasting impact, not just on your memories but on the world around you? If yes, you're in the right place.",
    category: "Purposeful Travel",
    author: "Alice Nyong'o",
    date: "2024-01-18",
    readTime: "6 min read",
    image: purposefulTravelExperiences,
    content: `
      <p>Are you looking for travel experiences that leave a lasting impact, not just on your memories but on the world around you? If yes, you're in the right place. Through Natuasili your travel experience will have a whole new meaning. In this article, we are going to talk about the idea of impactful travel and how Natuasili is at the forefront of this inspiring trend. We believe that traveling should be more than just checking off destinations on a bucket list. You should see it as a chance to make things better in your own life and in the places you visit.</p>
      
      <h2>What purposeful travel is all about</h2>
      <p>So, what exactly does "purposeful travel" mean? Your trip can be used for good if you change the way you think about it. It's about picking experiences that are in line with your values and leave a lasting mark on the places you visit. It's about traveling for reasons other than just seeing sights.</p>
      
      <p>At Natuasili, we know what it means to travel with a purpose. It's our job to put travelers like you in touch with community-based and conservation businesses in the places you choose to visit. Groups are planning these activities because they want to make a difference in their communities and the environment, so they're not like other tourist activities.</p>
      
      <p>We have carefully chosen a range of activities from organizations that are at the forefront of conservation and supporting community empowerment. We have experiences that will fit your interests and values, whether you're passionate about protecting wildlife by tracking lions and rhinos, learning about other cultures at the destination, or attending interesting talks and lectures given by experts in fields like wildlife, conservation, and culture.</p>
      
      <p>One of the best things about Natuasili is that it gives you control over your trips. You can make your unique travel plans by including these real-life activities. You can make your trip fit your interests. The best part is that your journey isn't just about getting better as a person. It has to do with making the world a better place. Each booking you make on Natuasili directly helps our partner organizations do great work. You help them do their job, which is to drive conservation efforts, give local communities more power, and protect the world's natural and cultural heritage.</p>
      
      <p>Are you ready to start a journey that has a purpose? You can start meaningful adventures at Natuasili. We can make the world a better place one journey at a time if we all work together to start your adventure here. Come with us, and let's discover, connect, and make a difference.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug as keyof typeof blogContent] : null;

  if (!post) {
    return (
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 section-padding-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Blog post not found</h1>
          <Link to="/blog">
            <Button className="bg-white text-black hover:bg-gray-200">Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Impact Stories': return 'bg-accent/10 text-accent border-accent/20';
      case 'Partner Spotlight': return 'bg-primary/10 text-primary border-primary/20';
      case 'Partnership Guide': return 'bg-accent/10 text-accent border-accent/20';
      case 'Community Impact': return 'bg-accent/10 text-accent border-accent/20';
      case 'Wildlife Protection': return 'bg-conservation/10 text-conservation border-conservation/20';
      case 'Education': return 'bg-primary/10 text-primary border-primary/20';
      case 'Restoration': return 'bg-accent/10 text-accent border-accent/20';
      case 'Innovation': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-background">{/* Page content wrapper */}
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-6">
            <Link 
              to={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-block"
            >
              <Badge className="bg-black text-white border-black cursor-pointer">
                {post.category}
              </Badge>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
          
        </div>
        
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Make an Impact?</h3>
            <p className="text-muted-foreground mb-6">
              Explore conservation experiences and start your journey with us.
            </p>
            <Link to="/browse">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Browse Experiences
              </Button>
            </Link>
          </div>
        </div>
      </article>
      
      <SimilarBlogs 
        currentSlug={slug || ""} 
        currentCategory={post?.category}
      />
    </div>
  );
};

export default BlogPost;