<script setup lang="ts">
import { computed, ref } from 'vue'
import LanguageSelect from '@/features/LanguageSelect/LanguageSelect.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from './composables/fetch'
import { useOctokit } from './composables/oktokit'

type Language = {
  title: string
  value: string
}

const currentLanguage = ref('')

const {
  data: languages,
  error: lanError,
  loading: langLoading,
} = useFetch<Language[]>(
  'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json',
)

const [{ repo, loading: repoLoading, error: repoError }, getRepos] = useOctokit()

const isRepo = computed(() => repo.value !== null)

function handleSelect(val: string) {
  currentLanguage.value = val
}
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div v-if="langLoading" class="flex flex-col space-y-3">
      <Skeleton class="h-[125px] w-[250px] rounded-xl" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>
    <div v-else-if="lanError">{{ lanError.message }}</div>
    <div :class="`grid grid-cols-${isRepo ? 2 : 1} gap-2 max-w-[800px]`" v-else>
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Random repo github</CardTitle>
          <CardDescription>Select language and search</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col space-y-1.5">
            <Label for="framework">Language </Label>
            <LanguageSelect :items="languages ?? []" @select-lang="handleSelect" />
          </div>
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button @click="getRepos(currentLanguage)" :disabled="repoLoading">Search</Button>
        </CardFooter>
      </Card>
      <Card class="w-[350px]" v-if="repo">
        <CardHeader>
          <CardTitle>{{ repo.name }}</CardTitle>
        </CardHeader>
        <CardContent>
          {{ repo.description }}
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          {{ repo.forks }}
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
