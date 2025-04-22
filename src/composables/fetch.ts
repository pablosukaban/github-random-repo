import { ref } from 'vue'

interface UseFetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: BodyInit | null
}

export function useFetch<T = unknown>(url: string, options: UseFetchOptions = {}) {
  const data = ref<T | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null,
      })

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  // Инициируем запрос при создании композабла
  fetchData()

  return { data, loading, error }
}
