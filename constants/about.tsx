import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
} from 'react-icons/fa'

import { SiNextdotjs, SiTailwindcss } from 'react-icons/si'

import { FaGolang } from 'react-icons/fa6'
import { siteConfig } from '@/lib/site-config'

export const about = {
  title: 'About Me',
  description:
    'I am a full-stack web developer and educator based in Ho Chi Minh City, Vietnam. I specialize in building modern, performant web applications with Next.js, React, and Tailwind CSS. Alongside development, I teach English and offer private tutoring, combining technical expertise with a passion for education.',
  info: [
    {
      fieldName: 'Name',
      fieldValue: 'Hoàng Anh',
    },
    {
      fieldName: 'Phone',
      fieldValue: siteConfig.author.phone,
    },
    {
      fieldName: 'Experience',
      fieldValue: '2+ years',
    },
    {
      fieldName: 'Facebook',
      fieldValue: 'Hoàng Aanh',
    },
    {
      fieldName: 'Nationality',
      fieldValue: 'Việt Nam',
    },
    {
      fieldName: 'Email',
      fieldValue: siteConfig.author.email,
    },
    {
      fieldName: 'Freelance',
      fieldValue: 'Available',
    },
    {
      fieldName: 'Languages',
      fieldValue: 'English, Vietnamese',
    },
  ],
} as const

export const experience = {
  title: 'My experience',
  description:
    'A summary of my professional journey in web development, teaching, and freelance work.',
  items: [
    {
      company: 'Freelance',
      position: 'Full-Stack Web Developer',
      duration: '2024 - Present',
    },
    {
      company: 'Self-Employed',
      position: 'English Teacher & Tutor',
      duration: '2023 - Present',
    },
    {
      company: 'Personal Projects',
      position: 'Open Source Contributor',
      duration: '2023 - Present',
    },
    {
      company: 'Freelance',
      position: 'SEO Specialist',
      duration: '2024 - Present',
    },
  ],
}

export const education = {
  title: 'My education',
  description:
    'My academic background and self-directed learning in software development and computer science.',
  items: [
    {
      institution: 'Self-Taught',
      degree: 'Full-Stack Web Development',
      duration: '2023 - Present',
    },
    {
      institution: 'Online Courses',
      degree: 'Next.js & React Mastery',
      duration: '2024',
    },
    {
      institution: 'Udemy & Coursera',
      degree: 'TypeScript & Node.js',
      duration: '2024',
    },
    {
      institution: 'FreeCodeCamp',
      degree: 'Responsive Web Design',
      duration: '2023',
    },
  ],
}

export const skills = {
  title: 'My skills',
  description:
    'Technologies and tools I use daily to build modern, performant web applications.',
  skillList: [
    {
      name: 'HTML',
      icon: <FaHtml5 />,
    },
    {
      name: 'CSS',
      icon: <FaCss3 />,
    },
    {
      name: 'JavaScript',
      icon: <FaJs />,
    },
    {
      name: 'React',
      icon: <FaReact />,
    },
    {
      name: 'Next.js',
      icon: <SiNextdotjs />,
    },
    {
      name: 'Tailwind CSS',
      icon: <SiTailwindcss />,
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs />,
    },
    {
      name: 'Python',
      icon: <FaPython />,
    },
    {
      name: 'Go',
      icon: <FaGolang />,
    },
  ],
}
