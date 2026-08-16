require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Project = require('./models/Project');
const Review = require('./models/Review');
const Stat = require('./models/Stat');
const Admin = require('./models/Admin');
const Inquiry = require('./models/Inquiry');

const DEFAULT_PROJECTS = [
  {
    title: 'Avenix Cloud Portal',
    slug: 'avenix-cloud-portal',
    category: 'Websites',
    shortDescription: 'A premium, high-performance logistics dashboard for modern cloud operations.',
    description: 'Developed to revolutionize logistic workflows, the Avenix Cloud Portal handles high-throughput analytics, server monitoring, and real-time shipment updates with visual precision and speed.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Recharts'],
    projectUrl: 'https://avenix-portal.demo',
    githubUrl: 'https://github.com/avenix/cloud-portal',
    featured: true,
    order: 1
  },
  {
    title: 'Cybertech Conference 2026',
    slug: 'cybertech-conference-2026',
    category: 'Posters',
    shortDescription: 'A promotional poster campaign blending cybernetic layouts with branding.',
    description: 'An editorial poster set highlighting event dynamics for the national Cybertech summit. Employs strong mathematical spacing and a strict cybernetic green visual hierarchy.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Photoshop', 'Illustrator', 'Figma'],
    projectUrl: '',
    githubUrl: '',
    featured: true,
    order: 2
  },
  {
    title: 'Ethereal Gala Web Invitation',
    slug: 'ethereal-gala-invitation',
    category: 'Web Invitations',
    shortDescription: 'An interactive, rich-media invitation system with audio and live RSVPs.',
    description: 'An invitation turned digital experience. Features a premium custom music loop, interactive schedule details, guest mapping, and a seamless live RSVP database interface.',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Audio API'],
    projectUrl: 'https://gala-invitation.demo',
    githubUrl: 'https://github.com/avenix/gala-invite',
    featured: false,
    order: 3
  },
  {
    title: 'Nexus Device Launch Campaign',
    slug: 'nexus-device-campaign',
    category: 'Digital Marketing',
    shortDescription: 'Brand promotions and social assets reaching 1.2M+ dynamic impressions.',
    description: 'Designed and deployed social campaign visuals, newsletters, and conversion-focused copy for the global launch of Nexus mobile architecture.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Figma', 'Ad Managers', 'Copywriting', 'SEO'],
    projectUrl: '',
    githubUrl: '',
    featured: true,
    order: 4
  },
  {
    title: 'Decentralized Portfolio Site',
    slug: 'decentralized-portfolio',
    category: 'Websites',
    shortDescription: 'A highly structured developer portfolio maximizing speed and indexing.',
    description: 'A modern single-page showcase. Highly optimized load times, scoring 100 on Lighthouse, featuring rich micro-interactions and dark-mode styling tokens.',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    projectUrl: 'https://dev-portfolio.demo',
    githubUrl: 'https://github.com/avenix/dev-portfolio',
    featured: false,
    order: 5
  },
  {
    title: 'Neon Nights Festival Poster',
    slug: 'neon-nights-poster',
    category: 'Posters',
    shortDescription: 'Vibrant neon-based promotion campaign for summer concert tours.',
    description: 'Created branding visuals and printed/digital banners utilizing glowing text systems, HSL-harmonized backgrounds, and custom typographic grids.',
    thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Photoshop', 'Illustrator', 'Figma'],
    projectUrl: '',
    githubUrl: '',
    featured: false,
    order: 6
  }
];

const DEFAULT_STATS = {
  completedProjects: '20+',
  happyClients: '10+',
  servicesCount: '5+',
  creativeFocus: '100%'
};

const DEFAULT_REVIEWS = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    service: 'Website Development',
    rating: 5,
    message: 'Avenix built our e-commerce landing page in record time. The load speed is incredible, and the design perfectly represents our tech brand.',
    date: 'Aug 02, 2026',
    status: 'approved'
  },
  {
    name: 'David Miller',
    email: 'david.m@example.com',
    service: 'Poster Making',
    rating: 5,
    message: 'The promotional posters for our Cyber Summit were creative, sleek, and impossible to miss. Got tons of compliments on the branding.',
    date: 'Jul 28, 2026',
    status: 'approved'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    service: 'Web Invitation',
    rating: 5,
    message: 'Our digital wedding invitation was stunning! The RSVP coordination and custom interactive pages made it a beautiful experience for our guests.',
    date: 'Jul 15, 2026',
    status: 'approved'
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.c@example.com',
    service: 'Digital Marketing',
    rating: 4,
    message: 'Helped us structure our organic social strategy. Solid and practical digital solutions that actually work for modern campaigns.',
    date: 'Jun 30, 2026',
    status: 'approved'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Review.deleteMany({});
    await Stat.deleteMany({});
    await Admin.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('Cleared existing collections.');

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('avenix_core_admin_2026', salt);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Seeded default admin (username: admin, password: avenix_core_admin_2026).');

    // Seed Projects
    await Project.insertMany(DEFAULT_PROJECTS);
    console.log('Seeded projects.');

    // Seed Stats
    await Stat.create(DEFAULT_STATS);
    console.log('Seeded counters.');

    // Seed Reviews
    await Review.insertMany(DEFAULT_REVIEWS);
    console.log('Seeded reviews.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
