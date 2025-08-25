// Expanded partner profiles with rich content
import { mockProjects } from './mockData';

// Import images for galleries
import maasaiMaraProject from '@/assets/maasai-mara-project.jpg';
import samburuEducation from '@/assets/samburu-education.jpg';
import coastalForest from '@/assets/coastal-forest.jpg';
import natureKenyaBirdwatching from '@/assets/nature-kenya-birdwatching.jpg';
import nairobiParkCleanup from '@/assets/nairobi-park-cleanup.jpg';
import karuraForestPlanting from '@/assets/karura-forest-planting.jpg';
import maraElephantTracking from '@/assets/mara-elephant-tracking.jpg';
import olPejeteRhino from '@/assets/ol-pejeta-rhino.jpg';
import retetiElephantOrphanage from '@/assets/reteti-elephant-orphanage.jpg';
import colobusConservation from '@/assets/colobus-conservation.jpg';
import localOceanConservation from '@/assets/local-ocean-conservation.jpg';
import giraffeCentre from '@/assets/giraffe-centre.jpg';
import bigFiveTracking from '@/assets/big-five-tracking.jpg';
import northernWhiteRhinos from '@/assets/northern-white-rhinos.jpg';

export interface ExpandedPartnerProfile {
  id: string;
  name: string;
  slug: string;
  mission: string;
  expandedBio: string;
  programs: Array<{
    title: string;
    description: string;
  }>;
  communityImpact: {
    jobs: number;
    education: string;
    conservationResults: Array<{
      metric: string;
      value: string;
    }>;
  };
  gallery: string[];
  experiences: Array<{
    title: string;
    slug: string;
    price: number;
    description: string;
  }>;
  achievements: string[];
  location: string;
  established: string;
  category: string;
  contact: {
    email: string;
    phone?: string;
  };
}

export const expandedPartnerProfiles: ExpandedPartnerProfile[] = [
  {
    id: '1',
    name: 'Maasai Mara Wildlife Conservancy',
    slug: 'maasai-mara-wildlife',
    mission: 'Protecting the iconic Maasai Mara ecosystem and supporting local Maasai communities through sustainable conservation practices and wildlife protection initiatives.',
    expandedBio: 'The Maasai Mara Wildlife Conservancy stands as a beacon of community-led conservation in Kenya. Established through partnerships with local Maasai communities, the conservancy protects over 1,500 square kilometers of critical wildlife habitat. Our approach combines traditional Maasai knowledge with modern conservation science to create a sustainable model that benefits both wildlife and people. We work closely with local pastoralists to ensure that traditional land use practices complement conservation goals, creating corridors for the Great Migration while maintaining cultural heritage.',
    programs: [
      {
        title: 'Big Five Conservation',
        description: 'Comprehensive protection and monitoring of lions, leopards, elephants, buffalo, and rhinos through GPS tracking, camera traps, and community-based patrols.'
      },
      {
        title: 'Anti-Poaching Operations',
        description: 'Round-the-clock ranger patrols, K-9 units, and advanced surveillance technology to combat wildlife crime and protect endangered species.'
      },
      {
        title: 'Community Livelihoods',
        description: 'Sustainable income generation through eco-tourism, beekeeping cooperatives, and traditional craft production for local Maasai families.'
      },
      {
        title: 'Wildlife Research',
        description: 'Collaborative research with international institutions on wildlife behavior, migration patterns, and ecosystem health.'
      }
    ],
    communityImpact: {
      jobs: 89,
      education: 'Conservation education in 12 local schools reaching 2,400 students annually',
      conservationResults: [
        { metric: 'Lion Population', value: '35% increase since 2019' },
        { metric: 'Zero Poaching Days', value: '287 consecutive days in 2024' },
        { metric: 'Hectares Protected', value: '150,000 hectares' },
        { metric: 'Tourist Visits', value: '45,000 annually' }
      ]
    },
    gallery: [maasaiMaraProject, bigFiveTracking, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Big Five Wildlife Tracking Experience',
        slug: 'big-five-tracking',
        price: 350,
        description: 'Join expert guides for wildlife tracking and contribute to conservation research'
      }
    ],
    achievements: [
      'Winner of Kenya Conservation Excellence Award 2023',
      'Zero rhino poaching incidents for 3 consecutive years',
      'Featured in National Geographic conservation documentary',
      'Certified Gold Standard for community-based conservation'
    ],
    location: 'Maasai Mara, Narok County, Kenya',
    established: '2008',
    category: 'Wildlife Conservation',
    contact: {
      email: 'contact@maasaimara.org',
      phone: '+254-701-234567'
    }
  },
  {
    id: '9',
    name: 'Reteti Elephant Orphanage',
    slug: 'reteti-elephant-orphanage',
    mission: 'First community-owned elephant orphanage in Africa. Rescues, rehabilitates, and releases orphaned elephants while empowering the Samburu community.',
    expandedBio: 'Reteti Elephant Orphanage represents a revolutionary approach to wildlife conservation - it is the first community-owned elephant orphanage in Africa. Located in the heart of Samburu County, Reteti was born from the vision of local communities who recognized the need to protect their wildlife heritage. The sanctuary operates on the principle that conservation succeeds when communities are empowered as stewards of their natural resources. Our dedicated team of Samburu keepers, many of whom are women breaking traditional barriers, provides round-the-clock care for orphaned elephants while preparing them for eventual release back into the wild.',
    programs: [
      {
        title: 'Elephant Rescue & Rehabilitation',
        description: 'Comprehensive care for orphaned elephants including medical treatment, nutrition, and socialization programs preparing them for wild release.'
      },
      {
        title: 'Women Keepers Initiative',
        description: 'Pioneering program training Samburu women as elephant keepers, challenging traditional gender roles and creating new opportunities.'
      },
      {
        title: 'Community Wildlife Guardians',
        description: 'Training local community members in wildlife monitoring, human-elephant conflict resolution, and conservation leadership.'
      },
      {
        title: 'Cultural Integration',
        description: 'Incorporating traditional Samburu knowledge and practices into modern elephant care and conservation strategies.'
      }
    ],
    communityImpact: {
      jobs: 45,
      education: 'Conservation education programs reaching 8 local schools and 1,200 students',
      conservationResults: [
        { metric: 'Elephants Rescued', value: '31 orphaned elephants since 2016' },
        { metric: 'Successful Releases', value: '12 elephants returned to wild' },
        { metric: 'Women Employed', value: '18 female keepers trained' },
        { metric: 'Community Members Trained', value: '156 wildlife guardians' }
      ]
    },
    gallery: [retetiElephantOrphanage, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Meet Orphaned Elephants',
        slug: 'meet-orphaned-elephants',
        price: 180,
        description: 'Experience the daily care routine and learn about elephant rehabilitation'
      }
    ],
    achievements: [
      'First community-owned elephant orphanage in Africa',
      'UN Environment Programme recognition for community conservation',
      'Featured in international conservation documentaries',
      '100% success rate in elephant release and integration'
    ],
    location: 'Samburu, Kenya',
    established: '2016',
    category: 'Wildlife Conservation',
    contact: {
      email: 'info@retetielephants.org',
      phone: '+254-709-012345'
    }
  },
  {
    id: '7',
    name: 'Mara Elephant Project',
    slug: 'mara-elephant-project',
    mission: 'Protect elephants in the Greater Mara Ecosystem through anti-poaching operations, GPS collaring, and community-based conflict mitigation.',
    expandedBio: 'The Mara Elephant Project was founded with a singular focus: protecting elephants in the Greater Mara Ecosystem through innovative conservation strategies. Our work spans beyond traditional park boundaries, recognizing that elephant conservation requires landscape-level thinking and community partnership. Using cutting-edge technology including GPS collars, drone surveillance, and real-time tracking systems, we monitor elephant movements and behavior patterns to better understand their needs and protect them from threats. Our anti-poaching teams work around the clock, while our community outreach programs address human-elephant conflict through education and sustainable coexistence strategies.',
    programs: [
      {
        title: 'GPS Collaring Program',
        description: 'Advanced tracking technology monitoring elephant movements, migration patterns, and behavior to inform conservation strategies.'
      },
      {
        title: 'Rapid Response Unit',
        description: '24/7 anti-poaching patrols using motorcycles, vehicles, and aircraft to respond quickly to threats across the ecosystem.'
      },
      {
        title: 'Human-Elephant Coexistence',
        description: 'Community-based programs reducing conflict through early warning systems, crop protection, and alternative livelihoods.'
      },
      {
        title: 'Research & Monitoring',
        description: 'Scientific research on elephant ecology, population dynamics, and conservation effectiveness to guide evidence-based strategies.'
      }
    ],
    communityImpact: {
      jobs: 67,
      education: 'Conservation awareness programs in 15 schools reaching 3,200 students annually',
      conservationResults: [
        { metric: 'Elephants Monitored', value: '450+ individuals tracked' },
        { metric: 'Poaching Incidents', value: '78% reduction since 2018' },
        { metric: 'Conflict Mitigation', value: '89% success rate in intervention' },
        { metric: 'Community Partnerships', value: '25 active community conservancies' }
      ]
    },
    gallery: [maraElephantTracking, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Elephant Tracking & Research Experience',
        slug: 'elephant-tracking-research',
        price: 280,
        description: 'Join researchers tracking elephants and contribute to conservation data'
      }
    ],
    achievements: [
      'Leading elephant GPS collaring program in East Africa',
      'Pioneered community-based conflict mitigation strategies',
      'Research published in top conservation journals',
      'International recognition for anti-poaching effectiveness'
    ],
    location: 'Maasai Mara Greater Ecosystem, Kenya',
    established: '2011',
    category: 'Wildlife Conservation',
    contact: {
      email: 'contact@maraelephantproject.org',
      phone: '+254-707-890123'
    }
  },
  {
    id: '4',
    name: 'Nature Kenya',
    slug: 'nature-kenya',
    mission: 'Africa\'s oldest conservation NGO (established 1909), focused on birds, biodiversity, and habitat protection through research, education, and community engagement.',
    expandedBio: 'Nature Kenya, established in 1909 as the East Africa Natural History Society, holds the distinction of being Africa\'s oldest conservation organization. For over a century, we have been at the forefront of biodiversity conservation in Kenya, with a particular focus on avian species and their habitats. Our work spans from the bustling urban centers of Nairobi to remote wilderness areas, conducting critical research on bird populations, managing Important Bird Areas, and engaging communities in conservation action. Through citizen science initiatives, we empower Kenyans to become active participants in biodiversity monitoring and conservation, creating a nationwide network of conservation champions.',
    programs: [
      {
        title: 'Important Bird Areas Program',
        description: 'Identification, monitoring, and protection of critical bird habitats across Kenya through community-based conservation initiatives.'
      },
      {
        title: 'Citizen Science Network',
        description: 'Training and coordination of volunteer bird monitors across the country, contributing to national and global biodiversity databases.'
      },
      {
        title: 'Urban Conservation',
        description: 'Protecting and enhancing biodiversity in urban environments through habitat restoration and community education programs.'
      },
      {
        title: 'Research & Publications',
        description: 'Scientific research on bird ecology, migration patterns, and habitat requirements, published in peer-reviewed journals.'
      }
    ],
    communityImpact: {
      jobs: 34,
      education: 'Environmental education reaching 25 schools and 4,500 students annually',
      conservationResults: [
        { metric: 'Bird Species Monitored', value: '1,100+ species documented' },
        { metric: 'Citizen Scientists', value: '450 active volunteers' },
        { metric: 'Important Bird Areas', value: '60 sites actively managed' },
        { metric: 'Urban Habitats Protected', value: '12 critical sites in Nairobi' }
      ]
    },
    gallery: [natureKenyaBirdwatching, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Urban Bird Watching Safari',
        slug: 'urban-bird-watching',
        price: 75,
        description: 'Discover urban biodiversity with expert ornithologists'
      }
    ],
    achievements: [
      'Africa\'s oldest conservation organization (1909)',
      'Designated 60 Important Bird Areas in Kenya',
      'Published over 200 scientific papers on bird conservation',
      'Trained 450+ citizen scientists nationwide'
    ],
    location: 'Nairobi, Kenya',
    established: '1909',
    category: 'Wildlife Conservation',
    contact: {
      email: 'info@naturekenya.org',
      phone: '+254-704-567890'
    }
  },
  {
    id: '6',
    name: 'Friends of Karura Forest',
    slug: 'friends-karura-forest',
    mission: 'Community-driven protection and sustainable management of Nairobi\'s Karura Forest through reforestation, education, and eco-tourism.',
    expandedBio: 'Friends of Karura Forest emerged from a grassroots movement to protect one of Nairobi\'s most vital green spaces. Karura Forest serves as the city\'s "green lung," providing essential ecosystem services including carbon sequestration, water catchment, and biodiversity conservation. Our organization has transformed from a small group of concerned citizens into a leading force in urban forest conservation. Through community mobilization, reforestation efforts, and sustainable tourism, we have not only protected the forest but made it accessible to all Nairobians as a space for recreation, education, and inspiration.',
    programs: [
      {
        title: 'Reforestation Initiative',
        description: 'Large-scale tree planting programs using indigenous species to restore degraded forest areas and enhance biodiversity.'
      },
      {
        title: 'Eco-Tourism Development',
        description: 'Sustainable tourism infrastructure including nature trails, viewpoints, and guided walks that generate revenue for conservation.'
      },
      {
        title: 'Community Education',
        description: 'Environmental education programs for schools, community groups, and visitors emphasizing urban forest conservation.'
      },
      {
        title: 'Trail Maintenance',
        description: 'Volunteer-based trail maintenance and development program ensuring safe and enjoyable forest access for all visitors.'
      }
    ],
    communityImpact: {
      jobs: 28,
      education: 'Environmental education for 18 schools and 2,800 students annually',
      conservationResults: [
        { metric: 'Trees Planted', value: '45,000+ indigenous trees' },
        { metric: 'Forest Area Protected', value: '1,041 hectares' },
        { metric: 'Annual Visitors', value: '120,000+ recreational users' },
        { metric: 'Volunteer Hours', value: '8,400 hours annually' }
      ]
    },
    gallery: [karuraForestPlanting, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Forest Conservation Tree Planting',
        slug: 'forest-tree-planting',
        price: 65,
        description: 'Plant indigenous trees and learn about urban forest conservation'
      }
    ],
    achievements: [
      'Protected Karura Forest from development threats',
      'Established 30km of nature trails',
      'Planted over 45,000 indigenous trees',
      'Created model for urban forest conservation in Africa'
    ],
    location: 'Karura Forest, Nairobi, Kenya',
    established: '1998',
    category: 'Habitat',
    contact: {
      email: 'info@karuraforest.org',
      phone: '+254-706-789012'
    }
  },
  {
    id: '10',
    name: 'Colobus Conservation',
    slug: 'colobus-conservation',
    mission: 'Protect and conserve the endangered Angolan Colobus monkey and coastal forests in Diani through rescue, rehabilitation, and community education.',
    expandedBio: 'Colobus Conservation stands at the forefront of primate conservation along Kenya\'s coast, dedicated to protecting the endangered Angolan Colobus monkey and preserving the coastal forest ecosystem. Founded in response to the alarming decline of colobus populations due to habitat loss and human-wildlife conflict, our organization has become a beacon of hope for these remarkable primates. Our approach combines direct rescue and rehabilitation with community education and habitat protection, recognizing that long-term conservation success requires addressing both immediate threats and underlying causes.',
    programs: [
      {
        title: 'Primate Rescue & Rehabilitation',
        description: 'Comprehensive care for injured, orphaned, and displaced colobus monkeys with goal of successful reintegration into wild populations.'
      },
      {
        title: 'Habitat Restoration',
        description: 'Active restoration of coastal forest fragments through native tree planting and invasive species removal.'
      },
      {
        title: 'Community Education',
        description: 'Extensive outreach programs educating local communities about colobus conservation and promoting human-wildlife coexistence.'
      },
      {
        title: 'Forest Patrols',
        description: 'Regular monitoring of colobus populations and forest health through trained community patrol teams.'
      }
    ],
    communityImpact: {
      jobs: 22,
      education: 'Conservation education in 8 coastal schools reaching 1,600 students',
      conservationResults: [
        { metric: 'Colobus Rescued', value: '180+ monkeys rehabilitated' },
        { metric: 'Forest Protected', value: '850 hectares conserved' },
        { metric: 'Community Patrols', value: '15 active patrol groups' },
        { metric: 'Trees Planted', value: '12,000 indigenous trees' }
      ]
    },
    gallery: [colobusConservation, '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    experiences: [
      {
        title: 'Colobus Monkey Conservation Experience',
        slug: 'colobus-conservation-experience',
        price: 95,
        description: 'Learn about primate conservation and coastal forest protection'
      }
    ],
    achievements: [
      'Leading colobus monkey conservation organization in East Africa',
      'Successfully returned 120+ rehabilitated monkeys to wild',
      'Prevented deforestation of 20 hectares in Diani',
      'Established community-based forest patrol network'
    ],
    location: 'Diani Beach, Kenya',
    established: '1997',
    category: 'Wildlife Conservation',
    contact: {
      email: 'info@colobusconservation.org',
      phone: '+254-710-123456'
    }
  }
  // Additional partners can be added here following the same structure
];

export const partnerSuccessStories = [
  {
    id: 'reteti-first-release',
    title: 'From Rescue to Release: Reteti\'s First Elephant Return',
    slug: 'reteti-first-elephant-return',
    partnerId: '9',
    partnerName: 'Reteti Elephant Orphanage',
    category: 'Wildlife Conservation',
    image: retetiElephantOrphanage,
    teaser: 'Reteti Elephant Sanctuary successfully released one of its first rescued calves back into the wild, marking a historic milestone for community-based conservation.',
    fullStory: `In a moment that brought tears to the eyes of keepers and conservationists alike, Reteti Elephant Sanctuary celebrated its first successful elephant release back into the wild. The young bull, rescued as a six-month-old calf after being found alone and dehydrated near a water point in Samburu, had spent three years under the devoted care of the sanctuary's pioneering team of women keepers.

The release represented more than just the return of one elephant to the wild—it validated the revolutionary community-owned conservation model that Reteti has pioneered. Unlike traditional conservation approaches imposed from outside, Reteti emerged from the Samburu community itself, with local women breaking cultural barriers to become elephant keepers and conservation leaders.

The journey to release day was carefully orchestrated. Months of preparation included gradual integration with wild herds that frequent the area, behavioral assessments to ensure the young bull had developed essential survival skills, and coordination with the Kenya Wildlife Service and local conservancies. GPS tracking collars and community wildlife scouts now monitor his movements as he navigates his new freedom in the Namunyak Conservancy.

This success story resonates far beyond Samburu. It demonstrates that when communities are empowered as conservation leaders rather than merely beneficiaries, remarkable outcomes become possible. The young bull now roaming free serves as living proof that community-owned conservation can work, inspiring similar initiatives across Africa and providing hope for the future of elephant conservation.`,
    readTime: '4 min read',
    publishDate: '2024-01-15',
    author: 'Conservation Team'
  },
  {
    id: 'nature-kenya-tourism',
    title: 'Birds Bring Back Tourism in Nairobi',
    slug: 'birds-bring-back-tourism-nairobi',
    partnerId: '4',
    partnerName: 'Nature Kenya',
    category: 'Economic Impact',
    image: natureKenyaBirdwatching,
    teaser: 'Nature Kenya\'s innovative urban birdwatching programs have attracted international eco-tourists to Nairobi, providing sustainable income for local guides.',
    fullStory: `What started as a simple weekend birdwatching program in Nairobi's urban parks has blossomed into a thriving eco-tourism initiative that's changing perceptions about urban wildlife and creating new livelihoods for local communities. Nature Kenya's innovative approach to urban birdwatching has attracted visitors from around the world, proving that conservation and economic development can go hand in hand.

The transformation began when Nature Kenya recognized that Nairobi's urban environment, far from being a biodiversity desert, actually hosts over 400 bird species—more than many rural areas. The organization developed specialized urban birding trails through the Nairobi Arboretum, City Park, and even the Central Business District, revealing hidden pockets of biodiversity that most residents didn't know existed.

Local guides, many of whom were unemployed youth from nearby communities, underwent intensive training in bird identification, guiding techniques, and conservation messaging. The program has created steady employment for 25 guides, with many reporting monthly incomes that have enabled them to support their families and pursue further education. More importantly, these guides have become conservation ambassadors, sharing their knowledge and passion for urban wildlife with visitors and local communities alike.

The economic impact extends beyond guide fees. Visitors to these urban birding experiences often extend their stays in Nairobi, supporting local restaurants, accommodation, and other services. International birdwatchers have included Nairobi on their East African itineraries specifically for these unique urban wildlife experiences, contributing to Kenya's reputation as a premier eco-tourism destination.

The success has also strengthened conservation efforts. Increased visitor numbers and economic benefits have given urban parks higher profiles and stronger support from city authorities. Several endangered urban habitats have received enhanced protection, and community awareness about urban biodiversity has grown significantly.`,
    readTime: '5 min read',
    publishDate: '2024-01-10',
    author: 'Urban Conservation Team'
  },
  {
    id: 'colobus-saves-forest',
    title: 'Colobus Conservation Saves Diani Forest Patch',
    slug: 'colobus-conservation-saves-diani-forest',
    partnerId: '10',
    partnerName: 'Colobus Conservation',
    category: 'Habitat Protection',
    image: colobusConservation,
    teaser: 'Through community patrols and advocacy, Colobus Conservation helped prevent deforestation of 20 hectares in Diani, preserving critical habitat.',
    fullStory: `In a victory that demonstrates the power of community-based conservation, Colobus Conservation successfully prevented the clearing of 20 hectares of indigenous coastal forest in Diani—habitat that serves as home to one of Kenya's most endangered primate species, the Angolan Colobus monkey.

The threat emerged when a development company acquired land containing some of the last remaining coastal forest fragments in the area. These forests, already reduced to less than 5% of their original extent, represent critical habitat not only for colobus monkeys but for numerous other species found nowhere else in Kenya. The loss of these 20 hectares would have fragmented an already vulnerable ecosystem and potentially doomed the local colobus population.

Colobus Conservation's response was swift and comprehensive. The organization mobilized its network of community forest patrols—local residents trained in forest monitoring and wildlife protection—to document the biodiversity value of the threatened area. Working with legal experts, they challenged the development on environmental grounds while simultaneously engaging with local communities to build support for forest protection.

The turning point came when the community patrols, many of whom had previously viewed the forest primarily as a source of building materials and firewood, began to understand its broader value. Through education programs and alternative livelihood initiatives, community members became the forest's most vocal defenders. Their testimony about the forest's importance for water catchment, climate regulation, and tourism potential proved crucial in the legal proceedings.

The successful preservation of this forest patch has had ripple effects throughout the coastal conservation community. It has strengthened the network of community forest patrols, demonstrated the effectiveness of combining legal advocacy with grassroots mobilization, and provided a template for protecting other threatened forest fragments along the coast.

Today, the preserved forest serves as an outdoor classroom where schoolchildren learn about coastal ecosystems, a research site for scientists studying primate behavior, and a tourism destination that generates income for local guides. The colobus monkeys that call it home continue to thrive, their distinctive black and white forms swinging through the canopy as a living symbol of conservation success.`,
    readTime: '6 min read',
    publishDate: '2024-01-05',
    author: 'Coastal Conservation Team'
  },
  {
    id: 'mara-elephants-technology',
    title: 'Technology Saves Mara Elephants from Poaching',
    slug: 'technology-saves-mara-elephants',
    partnerId: '7',
    partnerName: 'Mara Elephant Project',
    category: 'Anti-Poaching Success',
    image: maraElephantTracking,
    teaser: 'Advanced GPS tracking and rapid response systems helped Mara Elephant Project achieve a 78% reduction in elephant poaching incidents.',
    fullStory: `The Mara Elephant Project's innovative use of technology has revolutionized elephant protection in the Greater Mara Ecosystem, resulting in a dramatic 78% reduction in poaching incidents over the past six years. This success story demonstrates how cutting-edge conservation technology, combined with community engagement, can effectively combat wildlife crime.

The transformation began with the deployment of GPS collars on key elephant matriarchs and bulls. These sophisticated devices provide real-time location data, allowing the project team to monitor elephant movements 24/7 and predict potential conflict situations before they escalate. When elephants approach high-risk areas known for poaching activity or human-elephant conflict, automated alerts are sent to rapid response teams who can intervene immediately.

The technology suite extends far beyond GPS collars. Drone surveillance provides aerial monitoring of vast wilderness areas, while camera traps create an early warning network that detects both wildlife and human activity in sensitive areas. Mobile communication systems connect remote ranger posts with central command, enabling coordinated responses to threats across the ecosystem.

Perhaps most importantly, the project has invested heavily in training local community members to use these technologies. Maasai rangers, drawing on traditional tracking skills enhanced by modern tools, have become highly effective anti-poaching operatives. Their deep knowledge of the landscape, combined with real-time data from GPS collars and surveillance systems, creates an impenetrable network of protection around elephant herds.

The results speak for themselves. Not only has poaching dropped dramatically, but elephant populations have begun to recover. Herds that once avoided certain areas due to poaching pressure now utilize their full range again. Successful prosecution rates for wildlife crimes have increased by 90%, as technology-gathered evidence provides irrefutable proof of illegal activities.

The model pioneered by the Mara Elephant Project is now being replicated across Africa, demonstrating that with the right combination of technology, community engagement, and dedicated resources, it is possible to win the war against elephant poaching.`,
    readTime: '5 min read',
    publishDate: '2024-01-02',
    author: 'Anti-Poaching Unit'
  },
  {
    id: 'karura-urban-oasis',
    title: 'Karura Forest: From Threatened Land to Urban Oasis',
    slug: 'karura-forest-urban-oasis',
    partnerId: '6',
    partnerName: 'Friends of Karura Forest',
    category: 'Urban Conservation',
    image: karuraForestPlanting,
    teaser: 'Community mobilization transformed threatened Karura Forest into Nairobi\'s premier urban conservation success story.',
    fullStory: `Twenty-five years ago, Karura Forest faced an existential threat. Developers and land grabbers had their sights set on this 1,041-hectare urban forest, viewing it as prime real estate rather than a vital ecosystem. Today, thanks to the tireless efforts of Friends of Karura Forest and thousands of dedicated volunteers, it stands as one of Africa's most successful urban conservation stories.

The battle for Karura began in the 1990s when the organization, led by environmental activist Wangari Maathai, mobilized communities to physically protect the forest from destruction. What started as protests and tree-planting ceremonies evolved into a comprehensive conservation program that has transformed not just the forest, but the entire surrounding community.

The restoration work has been remarkable in its scope and success. Over 45,000 indigenous trees have been planted, restoring degraded areas and creating new habitat for urban wildlife. The forest now hosts over 200 bird species, numerous small mammals, and serves as a crucial green corridor for wildlife movement within Nairobi.

But perhaps most importantly, Friends of Karura Forest recognized that long-term conservation success required making the forest valuable to the community. They developed 30 kilometers of nature trails, created outdoor education facilities, and established sustainable eco-tourism programs that generate revenue for conservation while providing recreation opportunities for Nairobi residents.

The forest now welcomes over 120,000 visitors annually, from school children on educational trips to international tourists seeking a nature experience within the city. Local communities have found employment as guides, trail maintenance workers, and in forest management activities. The economic benefits have created strong local support for forest protection.

Environmental benefits extend far beyond the forest boundaries. Karura serves as Nairobi's "green lung," absorbing carbon dioxide, producing oxygen, and moderating urban temperatures. Its watershed functions help recharge groundwater and prevent flooding in surrounding neighborhoods.

The success of Karura Forest has inspired similar urban conservation initiatives across Kenya and Africa. It demonstrates that with community engagement, innovative programming, and persistent advocacy, it is possible to protect urban nature even in rapidly growing cities.`,
    readTime: '6 min read',
    publishDate: '2023-12-28',
    author: 'Urban Forestry Team'
  }
];

export const getPartnerProfile = (slug: string): ExpandedPartnerProfile | undefined => {
  return expandedPartnerProfiles.find(profile => profile.slug === slug);
};

export const getPartnerSuccessStory = (slug: string) => {
  return partnerSuccessStories.find(story => story.slug === slug);
};