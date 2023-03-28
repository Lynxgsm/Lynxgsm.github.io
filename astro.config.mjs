import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
  site: "https://lynxgsm.github.io",
  markdown: {
    rehypePlugins: [rehypeRaw],
    remarkPlugins: [gfm],
  },
  integrations: [mdx(), sitemap(), tailwind()],
});
