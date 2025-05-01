import { Octokit } from '@octokit/core'
import { ref } from 'vue'

type Repo = {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  forks: number
}

function getRandomRepo(repos: Repo[]) {
  return repos[Math.floor(Math.random() * repos.length)]
}

export function useOctokit() {
  const kit = new Octokit()

  const repo = ref<Repo | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  async function getRepos(q?: string) {
    if (!q) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const res = await kit.request('GET /search/repositories', {
        q,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })

      repo.value = getRandomRepo(res.data.items)
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  return [{ repo, loading, error }, getRepos] as const
}
