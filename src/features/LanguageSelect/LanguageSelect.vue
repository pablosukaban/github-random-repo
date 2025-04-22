<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref } from 'vue'

type Language = {
  title: string
  value: string
}

const val = ref('')

const { items } = defineProps<{ items: Language[] }>()

defineEmits<{
  selectLang: [lang: string]
}>()
</script>

<template>
  <Select v-model="val" @update:model-value="$emit('selectLang', val)">
    <SelectTrigger>
      <SelectValue placeholder="Select a language" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Languages</SelectLabel>
        <SelectItem
          v-for="item in items.filter((item) => item.value.length > 0)"
          :key="item.value"
          :value="item.value"
        >
          {{ item.title }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
