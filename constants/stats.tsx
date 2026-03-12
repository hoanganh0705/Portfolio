import { fetchGitHubCommits } from '@/lib/fetchGithubCommits'

const calculateYearsOfExperience = (startDate: string | Date): number => {
  const start = new Date(startDate)
  const now = new Date()
  const diffInYears = now.getFullYear() - start.getFullYear()

  let years = diffInYears
  if (
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() &&
      now.getDate() < start.getDate())
  ) {
    years = diffInYears - 1
  }
  return years
}

// Lazy-loaded commit count — no top-level await (2.2)
let _commitCount: number | null = null

export async function getCommitCount(): Promise<number> {
  if (_commitCount !== null) return _commitCount

  try {
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME) {
      _commitCount = await fetchGitHubCommits(
        process.env.GITHUB_USERNAME,
        process.env.GITHUB_TOKEN,
      )
    } else {
      _commitCount = 100
    }
  } catch (error) {
    console.warn('Failed to fetch GitHub commits, using fallback value:', error)
    _commitCount = 100
  }

  return _commitCount
}

export interface StatItem {
  num: number
  text: string
}

export const stats: StatItem[] = [
  {
    num: calculateYearsOfExperience('2024-01-07'),
    text: 'Years of experience',
  },
  {
    num: 5,
    text: 'Projects Completed',
  },
  {
    num: 4,
    text: 'Technologies Mastered',
  },
  {
    num: 100, // Default — will be replaced at runtime via getCommitCount()
    text: 'Code commits',
  },
]
