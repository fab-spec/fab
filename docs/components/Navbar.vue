<template>
  <nav class="fixed top-0 z-40 w-full bg-blue-900" @click="scrollToTop">
    <div class="container mx-auto px-4 md:px-8 flex-1">
      <div class="flex items-center justify-between h-16 text-gray-100">
        <div class="w-1/6" @click.stop="noop">
          <NuxtLink
            :to="'/'"
            class="text-xl font-bold tracking-tight flex items-center flex-shrink-0"
            style="width: 104px;"
            aria-label="FAB Logo"
          >
            <IconLogo v-if="$colorMode.value === 'light'" class="h-8 w-auto" />
            <IconLogo v-else class="h-8 w-auto" />
          </NuxtLink>
        </div>
        <div class="hidden flex-1 md:flex justify-center ml-4 mr-2 md:mx-8 w-4/6">
          <SearchInput />
        </div>
        <div class="flex items-center justify-end w-1/6">
          <a
            href="https://twitter.com/fab_spec"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
            name="Twitter"
            class="hidden md:block hover:text-blue-600 mr-2"
          >
            <IconTwitter class="w-6 h-6" />
          </a>
          <a
            href="https://github.com/fab-spec/fab"
            target="_blank"
            rel="noopener noreferrer"
            title="Github"
            name="Github"
            class="hidden md:block hover:text-blue-600 mr-4"
          >
            <IconGithub class="w-6 h-6" />
          </a>
          <button
            class="md:hidden p-2 pr-0 rounded-md hover:text-blue-600 focus:outline-none"
            aria-label="Hamburger Menu"
            @click.stop="menu = !menu"
          >
            <IconX v-if="menu" class="w-6 h-6" />
            <IconMenu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    menu: {
      get () {
        return this.$store.state.menu.open
      },
      set (val) {
        this.$store.commit('menu/toggle', val)
      }
    }
  },
  methods: {
    scrollToTop () {
      if (window.innerWidth >= 1280) {
        return
      }
      window.scrollTo(0, 0)
    },
    noop () {}
  }
}
</script>
