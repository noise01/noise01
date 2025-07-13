// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/color-mode",
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {},
        rehypePlugins: {
          "rehype-external-links": {},
          "rehype-katex": {},
        },
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: [
            "json",
            "yaml",
            "csv",
            "markdown",
            "md",
            "c",
            "cpp",
            "python",
            "py",
            "matlab",
            "latex",
            "tex",
            "bibtex",
            "dotenv",
            "bash",
            "sh",
          ],
        },
      },
    },
    renderer: {
      anchorLinks: {
        h2: false,
        h3: false,
        h4: false,
      },
    },
  },
});
