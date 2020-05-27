<template>
  <div class="flex justify-between items-center">
    <NuxtLink
      v-if="prev"
      :to="toLink(prev.slug)"
      class="text-blue-600 font-bold hover:underline flex items-center p-2 pl-0"
    >
      <IconArrowLeft class="w-4 h-4 mr-1" />
      {{ prev.title }}
    </NuxtLink>
    <span v-else>&nbsp;</span>
    <NuxtLink
      v-if="next"
      :to="toLink(next.slug)"
      class="text-blue-600 font-bold hover:underline flex items-center p-2 pr-0"
    >
      {{ next.title }}
      <IconArrowRight class="w-4 h-4 ml-1" />
    </NuxtLink>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
export default {
  props: {
    prev: {
      type: Object,
      default: () => null
    },
    next: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    toLink(slug) {
      //console.log({slug})
      //console.log(this.localePath({ name: 'slug', params: { slug } }))
      if (slug === 'index') {
        return '/' //this.localePath('slug')
      }
      return '/' + slug //this.localePath({ name: 'slug', params: { slug } })
    },
  }
}
</script>
