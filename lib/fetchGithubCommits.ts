interface Repo {
  name: string
  fork: boolean
}

/**
 * Fetch total commit count using the Contributors Stats API.
 * This avoids the N+1 problem of fetching commits per-repo individually.
 * Falls back to contributor stats which returns aggregate counts.
 */
export const fetchGitHubCommits = async (
  username: string,
  token: string,
): Promise<number> => {
  if (!token) {
    console.warn('GitHub token not provided, returning default value')
    return 300
  }

  const encodedUsername = encodeURIComponent(username)
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'Node.js',
    Accept: 'application/vnd.github.v3+json',
  }

  try {
    // Fetch all repositories (paginated)
    const repos: Repo[] = []
    let page = 1

    while (true) {
      const repoResponse = await fetch(
        `https://api.github.com/users/${encodedUsername}/repos?per_page=100&page=${page}`,
        {
          headers,
          next: { revalidate: 86400 }, // Revalidate daily instead of force-cache forever
        },
      )

      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch repos: ${repoResponse.status}`)
      }
      const repoData: Repo[] = await repoResponse.json()
      if (repoData.length === 0) break
      repos.push(...repoData) // push instead of spread copy (2.11)
      page++
    }

    let totalCommits = 0

    // Use /stats/contributors endpoint — returns aggregate commit counts per contributor
    // This significantly reduces API calls (1 per repo instead of N pages of commits)
    const nonForkRepos = repos.filter((r) => !r.fork)

    const commitCounts = await Promise.all(
      nonForkRepos.map(async (repo) => {
        try {
          const statsResponse = await fetch(
            `https://api.github.com/repos/${encodedUsername}/${encodeURIComponent(repo.name)}/stats/contributors`,
            {
              headers,
              next: { revalidate: 86400 },
            },
          )

          if (!statsResponse.ok) {
            console.warn(`Skipping ${repo.name}, got status: ${statsResponse.status}`)
            return 0
          }

          const stats = await statsResponse.json()
          if (!Array.isArray(stats)) return 0

          // Find the contributor matching our username
          const userStats = stats.find(
            (s: { author?: { login?: string } }) =>
              s.author?.login?.toLowerCase() === username.toLowerCase(),
          )

          return userStats?.total ?? 0
        } catch {
          return 0
        }
      }),
    )

    totalCommits = commitCounts.reduce((sum, count) => sum + count, 0)
    return totalCommits
  } catch (err) {
    console.error('Error fetching commits:', err)
    throw new Error(
      `Failed to fetch commits: ${(err as Error).message}`,
      { cause: err },
    )
  }
}
