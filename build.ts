import { copyFile } from 'fs/promises'

import tailwind from '@tailwindcss/postcss'
import postcss from 'postcss'
import { rolldown } from 'rolldown'

// build main bundle
async function buildMain() {
  const bundle = await rolldown({
    input: 'main/index.ts',
    platform: 'browser',
  })
  await bundle.write({
    format: 'es',
    file: 'dist/main.js',
    cleanDir: true,
  })
  await bundle.close()
}

// build ui bundle
async function buildUi() {
  const bundleUi = await rolldown({
    input: 'ui/index.tsx',
    platform: 'browser',
  })
  const { output: uiOutput } = await bundleUi.generate({
    format: 'iife',
    minify: true,
    dir: 'dist',
  })
  await bundleUi.close()
  const code = uiOutput.find((out) => out.type === 'chunk')?.code ?? ''

  // build css
  const { css } = await postcss([tailwind]).process(await Bun.file('ui/globals.css').text(), {
    from: 'ui/globals.css',
  })
  return { code, css }
}

// build entry html
async function buildHtml(code: string, css: string) {
  const rewriter = new HTMLRewriter()
    .on('script[type="module"]', {
      element(element) {
        element.setInnerContent(code, { html: true })
      },
    })
    .on('style[type="text/css"]', {
      element(element) {
        element.setInnerContent(css, { html: true })
      },
    })

  const resultHtml = rewriter.transform(await Bun.file('ui/index.html').text())
  await Bun.write('dist/ui.html', resultHtml)
}

// copy manifest.json
async function copyManifest() {
  await copyFile('manifest.json', 'dist/manifest.json')
}

await buildMain()
const { code, css } = await buildUi()
await buildHtml(code, css)
await copyManifest()
