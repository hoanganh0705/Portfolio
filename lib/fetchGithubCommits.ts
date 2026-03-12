interface GraphQLYearsResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionYears: number[]
      }
    }
  }
  errors?: { message: string }[]
}

interface YearContributions {
  totalCommitContributions: number
  restrictedContributionsCount: number
}

interface GraphQLCommitsResponse {
  data?: {
    user?: Record<string, YearContributions>
  }
  errors?: { message: string }[]
}

/**
 * Fetch total commit count using the GitHub GraphQL API.
 * Uses `contributionsCollection` to get accurate commit counts across all years
 * in just 2 API calls (get years → batch-fetch all year contributions).
 *
 * This replaces the previous REST approach which used `/stats/contributors`
 * and was unreliable due to 202 responses when stats haven't been computed.
 */
export const fetchGitHubCommits = async (
  username: string,
  token: string,
): Promise<number> => {
  if (!token) {
    console.warn('GitHub token not provided, returning default value')
    return 300
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  try {
    // Step 1: Get all contribution years for the user
    const yearsResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionYears
            }
          }
        }`,
        variables: { username },
      }),
      next: { revalidate: 86400 },
    })

    if (!yearsResponse.ok) {
      throw new Error(`GitHub GraphQL API error: ${yearsResponse.status}`)
    }

    const yearsData: GraphQLYearsResponse = await yearsResponse.json()

    if (yearsData.errors?.length) {
      throw new Error(`GraphQL error: ${yearsData.errors[0].message}`)
    }

    const years = yearsData.data?.user?.contributionsCollection?.contributionYears ?? []

    if (years.length === 0) return 0

    // Step 2: Batch-fetch commit contributions for every year in a single query
    // Each year gets an aliased `contributionsCollection` fragment
    const yearFragments = years
      .map((year) => {
        const from = `${year}-01-01T00:00:00Z`
        const to = `${year}-12-31T23:59:59Z`
        return `y${year}: contributionsCollection(from: "${from}", to: "${to}") {
        totalCommitContributions
        restrictedContributionsCount
      }`
      })
      .join('\n      ')

    const commitsResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `query($username: String!) {
          user(login: $username) {
            ${yearFragments}
          }
        }`,
        variables: { username },
      }),
      next: { revalidate: 86400 },
    })

    if (!commitsResponse.ok) {
      throw new Error(`GitHub GraphQL API error: ${commitsResponse.status}`)
    }

    const commitsData: GraphQLCommitsResponse = await commitsResponse.json()

    if (commitsData.errors?.length) {
      throw new Error(`GraphQL error: ${commitsData.errors[0].message}`)
    }

    const userData = commitsData.data?.user
    if (!userData) return 0

    let totalCommits = 0
    for (const year of years) {
      const yearData = userData[`y${year}`]
      if (yearData) {
        totalCommits +=
          (yearData.totalCommitContributions ?? 0) +
          (yearData.restrictedContributionsCount ?? 0)
      }
    }

    return totalCommits
  } catch (err) {
    console.error('Error fetching commits:', err)
    throw new Error(
      `Failed to fetch commits: ${(err as Error).message}`,
      { cause: err },
    )
  }
}
