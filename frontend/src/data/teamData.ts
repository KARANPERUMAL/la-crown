export interface TeamMember {
  id: string;
  number: string;
  name: string;
  designation: string;
  supportingSpecialty?: string;
  image: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'sunitha-devaraj',
    number: '01',
    name: 'Sunitha Devaraj',
    designation: 'Founder',
    image: '/images/our-team-images/doctor1.jpg',
  },
  {
    id: 'prathiksha-devaraj',
    number: '02',
    name: 'Prathiksha Devaraj',
    designation: 'CEO',
    image: '/images/our-team-images/doctor2.jpg',
  },
  {
    id: 'dr-ramesh',
    number: '03',
    name: 'Dr. Ramesh',
    designation: 'Medical Director',
    image: '/images/our-team-images/doctor3.jpg',
  },
  {
    id: 'dr-vikas-singh',
    number: '04',
    name: 'Dr. Vikas Singh',
    designation: 'International Hair Transplant Surgeon',
    supportingSpecialty: 'Aesthetic & Regenerative Medicine Expert',
    image: '/images/our-team-images/doctor4.jpg',
  },
  {
    id: 'dr-yogitha-c',
    number: '05',
    name: 'Dr. Yogitha C',
    designation: 'Senior Consultant Physician',
    supportingSpecialty: 'General Medicine | Diabetes & Medical Slimming',
    image: '/images/our-team-images/doctor5.jpg',
  },
];
