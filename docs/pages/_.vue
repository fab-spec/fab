<template>
  <div class="flex flex-wrap-reverse suka">
    <div class="w-full xl:w-3/4 py-4 md:pt-8 md:pb-4 dark:border-gray-800">
      <article class="md:px-8">
        <nuxt-content :document="doc" />
      </article>
      <EditOnGithub :document="doc" />
      <ArticlePrevNext :prev="prev" :next="next" class="md:px-8 mt-4" />
    </div>
    <ArticleToc
      class="hidden xl:block"
      v-if="doc.toc && doc.toc.length"
      :toc="doc.toc" />
  </div>
</template>

<script>
import { getDocs } from '../store'

export default {
  name: 'PageSlug',
  middleware({ params, redirect }) {
    if (params.slug === 'index') {
      redirect('/')
    }
  },
  async asyncData({ $content, store, app, params, error }) {
    const slug = params.pathMatch || 'index'

    let doc
    try {
      doc = await $content(app.i18n.locale, slug).fetch()
    } catch (e) {
      return error({ statusCode: 404, message: 'Page not found' })
    }

    const allDocs = await getDocs({ $content, $i18n: app.i18n }, (query) =>
      query.only(['title', 'slug']).sortBy('position', 'asc')
    )
    let thisDocIndex = 0
    for (; thisDocIndex < allDocs.length; thisDocIndex++) {
      if (allDocs[thisDocIndex].slug === slug) break
    }

    return {
      doc,
      prev: allDocs[thisDocIndex - 1],
      next: allDocs[thisDocIndex + 1],
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.doc.description,
        },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: this.doc.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.doc.description,
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.doc.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.doc.description,
        },
      ],
    }
  },
}
</script>

<style lang="postcss">
.dark-mode .nuxt-content {
  & h2,
  & h3,
  & blockquote {
    @apply border-gray-800;
  }

  & > code,
  & li > code,
  & p > code,
  & h3 > code {
    @apply bg-gray-800;
  }
}

.nuxt-content h1 {
  @apply text-5xl font-light mt-8 mb-12 leading-none text-center;
  & small {
    @apply block text-2xl mt-4;
  }
}

.nuxt-content h2 {
  @apply text-3xl font-extrabold mb-4 pb-1 -mt-16 pt-24;

  & > a {
    @apply ml-6;
    &::before {
      content: '#';
      @apply text-blue-700 font-normal -ml-6 pr-1 absolute opacity-100;
    }
  }

  &:hover {
    & > a::before {
      @apply opacity-100;
    }
  }
}
.nuxt-content h3 {
  @apply text-2xl font-extrabold mb-2 pb-1 -mt-16 pt-20;

  & > a {
    @apply ml-6;
    &::before {
      content: '#';
      @apply text-blue-700 font-normal -ml-5 pr-1 absolute opacity-100;
    }
  }

  &:hover {
    & > a::before {
      @apply opacity-100;
    }
  }
}

@screen lg {
  .nuxt-content h2 a,
  .nuxt-content h3 a {
    @apply ml-0;
    &::before {
      @apply opacity-0;
    }
  }
}

.nuxt-content ul,
.nuxt-content ol {
  @apply list-disc list-inside mb-4;

  & > li {
    @apply leading-7;

    & > ul {
      @apply pl-4;
    }
  }
}

.nuxt-content ol {
  @apply list-decimal;
}

.nuxt-content {
  & a {
    @apply underline;
  }

  & p {
    @apply mb-4 leading-7;
  }

  & blockquote {
    @apply py-2 pl-4 mb-4 border-l-4;

    > p:last-child {
      @apply mb-0;
    }
  }

  & > code,
  & li > code,
  & p > code {
    @apply bg-gray-100 p-1 text-sm shadow-xs rounded;
  }

  & h3 > code {
    @apply bg-gray-100 p-1 text-lg shadow-xs rounded;
  }

  & pre[class*='language-'] {
    @apply rounded mt-0 mb-4 bg-gray-800 text-sm relative;

    > code {
      @apply bg-gray-800 relative;
      text-shadow: none;
    }
  }

  & h5 {
    @apply pb-4 text-xl font-bold;
    & a {
      @apply no-underline;
    }
  }

  & video {
    @apply w-full border rounded shadow-md;
  }
  & .inline-images + p {
    @apply pb-4;
    & img {
      @apply inline;
    }
  }

  & .inline-video {
    @apply mt-8 mb-8;
    width: 100%;
    padding-top: 56.25%;
    position: relative;

    & > iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}

.nuxt-content-highlight {
  @apply relative;

  & > .filename {
    @apply absolute right-0 text-gray-600 font-light z-10 mr-2 mt-1 text-sm;
  }
}
</style>
