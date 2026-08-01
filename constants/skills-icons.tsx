import type { ReactNode } from 'react'
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

// Skills icons are language-independent; display names live in the i18n
// dictionary under `dict.resume.skillsList[]` and are looked up by id.
export const skillsIcons: Record<string, ReactNode> = {
  html: <FaHtml5 />,
  css: <FaCss3 />,
  javascript: <FaJs />,
  react: <FaReact />,
  nextjs: <SiNextdotjs />,
  tailwind: <SiTailwindcss />,
  nodejs: <FaNodeJs />,
  python: <FaPython />,
  go: <FaGolang />,
}
