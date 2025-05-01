<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useFetch } from './composables/fetch'
import { useOctokit } from './composables/oktokit'
import { Card, Select } from 'primevue'

type Language = {
  title: string
  value: string
}

const currentLanguage = ref<Language | null>(null)

const {
  data: languages,
  error: lanError,
  loading: langLoading,
} = useFetch<Language[]>(
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json',
)

const [{ repo, loading: repoLoading, error: repoError }, getRepos] = useOctokit()
</script>

<template>
  <div v-if="langLoading">Loading</div>
  <div v-else-if="lanError">{{ lanError.message }}</div>
  <div v-else class="grid grid-cols-2 gap-2 p-8">
    <Card>
      <template #title>Random repo github</template>
      <template #subtitle>Select language and search</template>
      <template #content>
        <div class="flex flex-col space-y-1.5">
          <label>Language</label>
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
        <Button @click="getRepos(currentLanguage?.value)" :disabled="repoLoading" label="Search" />
      </template>
    </Card>
    <Card v-if="repo">
      <template #title>{{ repo.name }}</template>
      <template #content>
        {{ repo.description }}
      </template>
      <template #footer>
        {{ repo.forks }}
      </template>
    </Card>
  </div>
</template>
