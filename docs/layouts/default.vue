<template>
  <div class="pt-16">
    <Navbar />
    <main class="container mx-auto px-4 md:px-8">
      <div class="flex flex-wrap relative">
        <aside
          class="h-screen w-full md:w-1/5 fixed md:sticky top-0 left-0 bottom-0 pt-16 md:-mt-16 md:block bg-white dark:bg-gray-900 md:bg-transparent z-30 md:border-r"
          :class="{ block: menu, hidden: !menu }"
        >
          <div class="container mx-auto overflow-auto h-full">
            <div class="md:hidden flex-1 flex justify-center px-4 mt-8 mb-4 w-full">
              <SearchInput />
            </div>
            <ul class="md:pl-0 p-4 md:py-8 md:pr-8">
              <li
                v-for="(docs, category) in categories"
                :key="category"
                class="mb-6 last:mb-0"
              >
                <template v-if="category === 'Home'">
                  <NuxtLink :to="toLink('index')">
                    <h3 class="aside-title">{{ category }}</h3>
                  </NuxtLink>
                </template>
                <template v-else>
                  <h3 class="aside-title">{{ category }}</h3>
                  <ul>
                    <li v-for="doc of docs" :key="doc.slug">
                      <NuxtLink
                        :to="toLink(doc.slug)"
                        class="leading-snug lg:px-2 text-sm lg:text-base rounded font-medium py-1 block text-gray-600 dark:text-gray-500 hover:text-gray-700 dark-hover:text-gray-100"
                        exact-active-class="text-blue-600 bg-blue-100 hover:text-blue-600 dark:text-green-200 dark:bg-green-900 dark-hover:text-green-200"
                      >
                        {{ doc.title }}
                      </NuxtLink>
                    </li>
                  </ul>
                </template>
              </li>
            </ul>
            <div class="md:hidden flex items-center px-4">
              <a
                href="https://twitter.com/nuxt_js"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                name="Twitter"
                class="hover:text-blue-600 mr-4 ml-2"
              >
                <icon-twitter class="w-6 h-6" />
              </a>

              <a
                href="https://github.com/nuxt/content"
                target="_blank"
                rel="noopener noreferrer"
                title="Github"
                name="Github"
                class="hover:text-blue-600 mr-4"
              >
                <icon-github class="w-6 h-6" />
              </a>
            </div>
          </div>
        </aside>
        <Nuxt class="w-full md:w-4/5" />
      </div>
    </main>
    <script
      data-goatcounter="https://fab.goatcounter.com/count"
      async
      src="https://gc.zgo.at/count.js"
    />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
//import TheFooter from '@/components/TheFooter'
import SearchInput from '@/components/SearchInput'

export default {
  components: {
    Navbar,
    //TheFooter,
    SearchInput,
  },
  computed: {
    bodyClass() {
      return this.$store.state.menu.open
        ? ['h-screen md:h-auto overflow-y-hidden md:overflow-y-auto']
        : []
    },
    menu: {
      get() {
        return this.$store.state.menu.open
      },
      set(val) {
        this.$store.commit('menu/toggle', val)
      },
    },
    categories() {
      return this.$store.state.categories[this.$i18n.locale]
    },
  },
  methods: {
    toLink(slug) {
      if (slug === 'index') {
        return '/'
      }
      return '/' + slug
    },
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()

    return {
      bodyAttrs: {
        class: [
          ...this.bodyClass,
          'antialiased text-gray-800 leading-normal bg-white dark:bg-gray-900 dark:text-gray-100',
        ],
      },
      ...i18nSeo,
    }
  },
}
</script>

<style type="postcss">
.aside-title {
  @apply mb-3 text-gray-700 uppercase tracking-wide font-bold text-sm;
}
.dark-mode .aside-title {
  @apply text-gray-600;
}
@screen md {
  .aside-title {
    @apply mb-2 text-xs;
  }
}
@screen lg {
  .aside-title {
    @apply text-gray-500;
  }
}
</style>
