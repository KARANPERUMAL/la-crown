export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  image: string;
  bgHex: string;
  textColorHex: string;
  accentColorHex: string;
  badgeText: string;
  treatmentTime: string;
  benefits: string[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'hair-treatment',
    number: '01',
    title: 'Hair Treatment',
    tagline: 'Scalp Health & Follicular Rejuvenation',
    category: 'Trichology Care',
    description:
      'Precision scalp mesotherapy, targeted follicular stimulation, and bio-peptide infusions engineered to revitalize roots, arrest thinning, and encourage dense, resilient growth.',
    image: '/images/services-images/hair-treatment.jpg',
    bgHex: '#00552F', // Deep Forest Green
    textColorHex: '#FFF8F6',
    accentColorHex: '#F49AB9',
    badgeText: 'Follicular Density',
    treatmentTime: '60–75 Min',
    benefits: ['Scalp Microneedling', 'Bio-Peptide Therapy', 'Cellular Follicle Awakening'],
  },
  {
    id: 'skin-treatment',
    number: '02',
    title: 'Skin Treatment',
    tagline: 'Clinical Dermatology & Cellular Renewal',
    category: 'Medical Dermatology',
    description:
      'Evidence-based dermatological protocols tailored to acne, hyperpigmentation, uneven texture, and vascular sensitivity for long-term skin barrier balance and luminosity.',
    image: '/images/services-images/skin-treatment.jpg',
    bgHex: '#F6D5DE', // Soft Blush Pink
    textColorHex: '#00552F',
    accentColorHex: '#E63886',
    badgeText: 'Barrier Renewal',
    treatmentTime: '50–70 Min',
    benefits: ['Hyperpigmentation Clarification', 'Active Acne Protocol', 'Dermal Barrier Restoration'],
  },
  {
    id: 'facial',
    number: '03',
    title: 'Facial',
    tagline: 'Bespoke Rejuvenation & Lymphatic Sculpting',
    category: 'Signature Aesthetic Care',
    description:
      'An artisanal deep-cleansing ritual combining medical hydra-infusion, enzyme polishing, and rhythmic lymphatic sculpting that awakens immediate, glass-like radiance.',
    image: '/images/services-images/facial.jpg',
    bgHex: '#FAF3ED', // Warm Cream
    textColorHex: '#00552F',
    accentColorHex: '#E63886',
    badgeText: 'Luminosity Ritual',
    treatmentTime: '60 Min',
    benefits: ['Hydra-Glow Infusion', 'Sculpting Lymphatic Flow', 'Ultrasonic Deep Extraction'],
  },
  {
    id: 'anti-ageing-treatment',
    number: '04',
    title: 'Anti-Ageing Treatment',
    tagline: 'Neocollagenesis & Tissue Firming',
    category: 'Longevity Medicine',
    description:
      'Subtle, non-surgical structural lifting and polynucleotide bio-remodeling designed to boost dermal elastin, smooth fine dynamic lines, and restore natural youthful contour.',
    image: '/images/services-images/anti-ageing-treatment.jpg',
    bgHex: '#C56882', // Muted Rose
    textColorHex: '#FFF8F6',
    accentColorHex: '#FFF0E9',
    badgeText: 'Cellular Longevity',
    treatmentTime: '75–90 Min',
    benefits: ['Polynucleotide Remodeling', 'Micro-Focused Lifting', 'Elastin Regeneration'],
  },
  {
    id: 'slimming-treatment',
    number: '05',
    title: 'Slimming Treatment',
    tagline: 'Non-Invasive Body Sculpting & Tone',
    category: 'Body Aesthetics',
    description:
      'Advanced non-invasive silhouette refinement utilizing targeted acoustic thermal energy and pneumatic drainage to contour curves, firm laxity, and stimulate metabolic tone.',
    image: '/images/services-images/slimming-treatment.jpg',
    bgHex: '#D1C4B5', // Complementary Earthy Neutral
    textColorHex: '#00552F',
    accentColorHex: '#200B14',
    badgeText: 'Silhouette Definition',
    treatmentTime: '60–80 Min',
    benefits: ['Acoustic Tissue Firming', 'Lymphatic Drainage Detox', 'Localized Subdermal Toning'],
  },
  {
    id: 'semi-permanent-make-up',
    number: '06',
    title: 'Semi-Permanent Make Up',
    tagline: 'Artisanal Micro-Pigmentation Artistry',
    category: 'Cosmetic Artistry',
    description:
      'Hyper-realistic micro-pigmentation creating soft powdered or hair-stroke brows, delicate lip blush tinting, and refined lash-line enhancement that looks effortlessly natural.',
    image: '/images/services-images/semi-permanent-make-up.jpg',
    bgHex: '#E63886', // Rich Brand Pink
    textColorHex: '#FFF8F6',
    accentColorHex: '#00552F',
    badgeText: 'Precision Artistry',
    treatmentTime: '90–120 Min',
    benefits: ['Hyper-Realistic Nano Brows', 'Velvet Lip Blush', 'Invisible Lash Line Definition'],
  },
];
