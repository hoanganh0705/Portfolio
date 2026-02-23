import { fetchGitHubCommits } from '@/lib/fetchGithubCommits'

// Safely fetch commits with fallback
let numOfCommits: number = 100 // Default fallback value

try {
  if (
    process.env.githubToken &&
    process.env.githubUserName
  ) {
    numOfCommits = await fetchGitHubCommits(
      process.env.githubUserName,
      process.env.githubToken,
    )
  }
} catch (error) {
  console.warn(
    'Failed to fetch GitHub commits, using fallback value:',
    error,
  )
  numOfCommits = 100 // Use fallback value
}

const calculateYearsOfExperience = (
  startDate: string | number | Date,
) => {
  const start = new Date(startDate)
  const now = new Date()
  const diffInYears =
    now.getFullYear() - start.getFullYear()

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

export const stats = [
  {
    num: calculateYearsOfExperience('2024-01-07'),
    text: 'Years of experience',
  },
  {
    num: 5,
    text: 'Years of experience',
  },
  {
    num: 4,
    text: 'Technologies Mastered',
  },
  {
    num: numOfCommits,
    text: 'Code commits',
  },
]
