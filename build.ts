import { watch } from 'fs'
import { mkdir, rmdir } from 'fs/promises'
import { dirname, join } from 'path'

import tailwind from '@tailwindcss/postcss'
import postcss from 'postcss'
import { rolldown } from 'rolldown'

interface BuildOptions {
  // Whether to watch for changes and rebuild automatically
  watch: boolean
  // Entries for the plugin
  entries: {
    // Main entry point for the plugin
    main: string
    // UI entry point for the plugin
    ui: string
    // UI HTML entry point for the plugin
    uiHtml: string
    // Manifest entry point for the plugin
    manifest: string
  }
  // Clean the dist directory
  clean: boolean
  // Output directory
  outdir: string
}

const buildOptions: BuildOptions = {
  watch: false,
  entries: {
    main: 'main/index.ts',
    ui: 'ui/index.tsx',
    uiHtml: 'ui/index.html',
    manifest: 'manifest.json',
  },
  clean: false,
  outdir: 'dist',
}

// build main bundle
async function buildMain() {
  const bundle = await rolldown({
    input: buildOptions.entries.main,
    platform: 'browser',
    transform: {
      target: 'es2017',
    },
    treeshake: {
      propertyWriteSideEffects: false,
    },
  })
  await bundle.write({
    format: 'es',
    file: join(buildOptions.outdir, 'main.js'),
    inlineDynamicImports: true,
  })
  await bundle.close()
}

// build react ui bundle
async function buildUi() {
  const bundle = await rolldown({
    input: buildOptions.entries.ui,
    platform: 'browser',
  })
  const { output: uiOutput } = await bundle.generate({
    format: 'iife',
    minify: true,
    dir: buildOptions.outdir,
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

  const resultHtml = rewriter.transform(await Bun.file(buildOptions.entries.uiHtml).text())
  await Bun.write(join(buildOptions.outdir, 'ui.html'), resultHtml)
}

// build ui and html
async function buildUiAndHtml() {
  const { code, css } = await buildUi()
  await buildHtml(code, css)
}

// copy manifest.json
async function copyManifest() {
  const manifest = await Bun.file(buildOptions.entries.manifest).text()
  try {
    const json = JSON.parse(manifest) as Record<string, unknown>
    json.main = 'main.js'
    json.ui = 'ui.html'
    await Bun.write(join(buildOptions.outdir, 'manifest.json'), JSON.stringify(json, null, 2))
  } catch (error) {
    console.error('Malformed manifest.json:', error)
  }
}

function watchMainBuild() {
  const watcher = watch(dirname(buildOptions.entries.main), { recursive: true }, (event) => {
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
  const watcher = watch(dirname(buildOptions.entries.ui), { recursive: true }, (event) => {
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
  const watcher = watch(buildOptions.entries.manifest, (event) => {
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

function printHelp() {
  console.log('Usage: bun run build.ts [options]')
  console.log('  --watch           Watch for changes and rebuild automatically (default: false)')
  console.log('  --main=<path>     Main entry point for the plugin (default: main/index.ts)')
  console.log('  --ui=<path>       UI entry point for the plugin (default: ui/index.tsx)')
  console.log('  --uiHtml=<path>   UI HTML entry point for the plugin (default: ui/index.html)')
  console.log('  --manifest=<path> Manifest entry point for the plugin (default: manifest.json)')
  console.log('  --outdir=<path>   Output directory (default: dist)')
  console.log('  --help            Print this help message')
  console.log('  --clean           Clean the dist directory')
}

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }
  for (const arg of args) {
    if (arg === '--clean') {
      buildOptions.clean = true
    } else if (arg === '--watch') {
      buildOptions.watch = true
    } else if (arg.startsWith('--main=')) {
      buildOptions.entries.main = arg.slice(7)
    } else if (arg.startsWith('--ui=')) {
      buildOptions.entries.ui = arg.slice(5)
    } else if (arg.startsWith('--uiHtml=')) {
      buildOptions.entries.uiHtml = arg.slice(9)
    } else if (arg.startsWith('--manifest=')) {
      buildOptions.entries.manifest = arg.slice(11)
    } else if (arg.startsWith('--outdir=')) {
      buildOptions.outdir = arg.slice(9)
    }
  }
  return buildOptions
}

async function cleanDist() {
  await rmdir(buildOptions.outdir, { recursive: true })
  await mkdir(buildOptions.outdir)
}

async function main() {
  const args = parseArgs()
  if (args.clean) {
    await cleanDist()
    return
  }
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
