import { watch } from 'fs'
import { copyFile } from 'fs/promises'

import tailwind from '@tailwindcss/postcss'
import postcss from 'postcss'
import { rolldown } from 'rolldown'

interface BuildOptions {
  // Whether to watch for changes and rebuild automatically
  watch: boolean
}

// build main bundle
async function buildMain() {
  const bundle = await rolldown({
    input: 'main/index.ts',
    platform: 'browser',
  })
  await bundle.write({
    format: 'es',
    file: 'dist/main.js',
  })
  await bundle.close()
}

// build react ui bundle
async function buildUi() {
  const bundle = await rolldown({
    input: 'ui/index.tsx',
    platform: 'browser',
  })
  const { output: uiOutput } = await bundle.generate({
    format: 'iife',
    minify: true,
    dir: 'dist',
  })
  const code = uiOutput.find((out) => out.type === 'chunk')?.code ?? ''
  await bundle.close()

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

// build ui and html
async function buildUiAndHtml() {
  const { code, css } = await buildUi()
  await buildHtml(code, css)
}

// copy manifest.json
async function copyManifest() {
  await copyFile('manifest.json', 'dist/manifest.json')
}

function watchMainBuild() {
  const watcher = watch('main', { recursive: true }, (event) => {
    if (event === 'change') {
      console.log('Main changed, rebuilding...')
      buildMain()
        .then(() => console.log('Main rebuilt successfully'))
        .catch((error) => {
          console.log('Error building main:', error)
        })
    }
  })
  return () => watcher.close()
}

function watchUiBuild() {
  const watcher = watch('ui', { recursive: true }, (event) => {
    if (event === 'change') {
      console.log('UI changed, rebuilding...')
      buildUiAndHtml()
        .then(() => console.log('UI rebuilt successfully'))
        .catch((error) => {
          console.log('Error building UI:', error)
        })
    }
  })
  return () => watcher.close()
}

function watchManifest() {
  const watcher = watch('manifest.json', (event) => {
    if (event === 'change') {
      console.log('Manifest changed, copying...')
      copyManifest()
        .then(() => console.log('Manifest copied successfully'))
        .catch((error) => {
          console.log('Error copying manifest:', error)
        })
    }
  })
  return () => watcher.close()
}

async function buildAll() {
  await buildMain()
  await buildUiAndHtml()
  await copyManifest()
}

async function watchAll() {
  await buildAll()
  const mainWatcher = watchMainBuild()
  const uiWatcher = watchUiBuild()
  const manifestWatcher = watchManifest()
  return () => {
    mainWatcher()
    uiWatcher()
    manifestWatcher()
  }
}

function parseArgs() {
  const initialOptions: BuildOptions = { watch: false }
  const args = process.argv.slice(2)
  for (const arg of args) {
    if (arg === '--watch') {
      initialOptions.watch = true
    }
  }
  return initialOptions
}

async function main() {
  const args = parseArgs()
  if (args.watch) {
    console.log('Watching for changes...')
    const unwatch = await watchAll()
    process.on('SIGINT', () => {
      console.log('SIGINT received, exiting...')
      unwatch()
      process.exit(0)
    })
  } else {
    await buildAll()
  }
}

await main()
