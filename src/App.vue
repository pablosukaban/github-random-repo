<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useFetch } from './composables/fetch'
import { useOctokit } from './composables/oktokit'
import { useToast } from 'primevue'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Select from 'primevue/select'

type Language = {
  title: string
  value: string
}

const currentLanguage = ref<Language | null>(null)

const toast = useToast()

const {
  data: languages,
  error: lanError,
  loading: langLoading,
} = useFetch<Language[]>(
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json',
)

const [{ repo, loading: repoLoading, error: repoError }, getRepos] = useOctokit()

function handleSearch() {
  if (!currentLanguage.value) {
    toast.add({ severity: 'error', summary: 'Select language', life: 3000, closable: true })

    return
  }

  getRepos(currentLanguage?.value.value)
}
</script>

<template>
  <div v-if="langLoading">Loading</div>
  <div v-else-if="lanError">{{ lanError.message }}</div>
  <div v-else class="grid grid-cols-1 gap-2 p-8 max-w-lg mx-auto">
    <Card>
      <template #title>Random repo github</template>
      <template #subtitle>Select language and search</template>
      <template #content>
        <div class="flex flex-col space-y-1.5">
          <Select
            v-model="currentLanguage"
            :options="languages ?? undefined"
            editable
            optionLabel="title"
            placeholder="Select a City"
            class="w-full md:w-56"
          />
        </div>
      </template>
      <template #footer>
        <Button @click="handleSearch" :disabled="repoLoading" label="Search" />
      </template>
    </Card>
    <Card v-if="repo" class="justify-between h-full">
      <template #title>
        <div class="flex justify-between h-full">
          <span>
            {{ repo.full_name }}
          </span>
          <a target="_blank" :href="repo.html_url">
            <i class="pi pi-external-link text-blue-300"></i>
          </a>
        </div>
      </template>
      <template #subtitle>
        <div class="h-full">
          {{ repo.description }}
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between gap-2 mt-auto">
          <div class="flex justify-center items-center gap-2">
            <i class="pi pi-circle-fill"></i>
            {{ currentLanguage?.title }}
          </div>
          <div class="flex justify-center items-center gap-2">
            <i class="pi pi-star-fill text-amber-200"></i>
            {{ repo.stargazers_count }}
          </div>
          <div class="flex justify-center items-center gap-2">
            <i class="pi pi-info-circle"></i>
            {{ repo.open_issues_count }}
          </div>
        </div>
      </template>
    </Card>
  </div>
  <Toast position="bottom-left" />
</template>
