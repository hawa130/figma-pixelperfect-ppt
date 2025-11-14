import { watch } from 'fs'
import { mkdir, rmdir, stat } from 'fs/promises'
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

interface BuildResult {
  duration: number
  files: { name: string; size: number }[]
}

// Format file size to human readable format
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// Format duration to human readable format
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

// Get file size
async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await stat(filePath)
    return stats.size
  } catch {
    return 0
  }
}

// Print concise build summary (for non-watch mode)
function printBuildSummary(allFiles: { name: string; size: number }[], totalDuration: number) {
  console.log(`Bundled in ${formatDuration(totalDuration)}`)
  console.log('')
  for (const file of allFiles) {
    console.log(`  ${file.name.padEnd(20)} ${formatSize(file.size)}`)
  }
}

// Print single line build info (for watch mode)
function printWatchInfo(result: BuildResult, buildType: string) {
  const totalSize = result.files.reduce((sum, file) => sum + file.size, 0)
  const filesList = result.files.map((f) => f.name).join(', ')
  console.log(`${buildType} built in ${formatDuration(result.duration)} - ${filesList} (${formatSize(totalSize)})`)
}

// build main bundle
async function buildMain(): Promise<BuildResult> {
  const startTime = performance.now()
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
  const outputFile = join(buildOptions.outdir, 'main.js')
  await bundle.write({
    format: 'es',
    file: outputFile,
    inlineDynamicImports: true,
  })
  await bundle.close()
  return {
    duration: performance.now() - startTime,
    files: [{ name: 'main.js', size: await getFileSize(outputFile) }],
  }
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
async function buildUiAndHtml(): Promise<BuildResult> {
  const startTime = performance.now()
  const { code, css } = await buildUi()
  await buildHtml(code, css)
  return {
    duration: performance.now() - startTime,
    files: [{ name: 'ui.html', size: await getFileSize(join(buildOptions.outdir, 'ui.html')) }],
  }
}

// copy manifest.json
async function copyManifest(): Promise<BuildResult> {
  const startTime = performance.now()
  const manifest = await Bun.file(buildOptions.entries.manifest).text()
  try {
    const json = JSON.parse(manifest) as Record<string, unknown>
    json.main = 'main.js'
    json.ui = 'ui.html'
    const outputFile = join(buildOptions.outdir, 'manifest.json')
    await Bun.write(outputFile, JSON.stringify(json, null, 2))
    return {
      duration: performance.now() - startTime,
      files: [{ name: 'manifest.json', size: await getFileSize(outputFile) }],
    }
  } catch (error) {
    console.error('Malformed manifest.json:', error)
    return {
      duration: performance.now() - startTime,
      files: [],
    }
  }
}

function watchMainBuild() {
  const watcher = watch(dirname(buildOptions.entries.main), { recursive: true }, (event) => {
    if (event === 'change') {
      buildMain()
        .then((result) => {
          printWatchInfo(result, 'Main')
        })
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
      buildUiAndHtml()
        .then((result) => {
          printWatchInfo(result, 'UI')
        })
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
      copyManifest()
        .then((result) => {
          printWatchInfo(result, 'Manifest')
        })
        .catch((error) => {
          console.log('Error copying manifest:', error)
        })
    }
  })
  return () => watcher.close()
}

async function buildAll() {
  const startTime = performance.now()
  const mainResult = await buildMain()
  const uiResult = await buildUiAndHtml()
  const manifestResult = await copyManifest()
  const totalDuration = performance.now() - startTime

  // Print concise summary
  const allFiles = [...mainResult.files, ...uiResult.files, ...manifestResult.files]
  printBuildSummary(allFiles, totalDuration)
  if (buildOptions.watch) {
    console.log('')
  }
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
  console.log('\nOptions:')
  console.log('  --watch (-w)      Watch for changes and rebuild automatically (default: false)')
  console.log('  --main=<path>     Main entry point for the plugin (default: main/index.ts)')
  console.log('  --ui=<path>       UI entry point for the plugin (default: ui/index.tsx)')
  console.log('  --uiHtml=<path>   UI HTML entry point for the plugin (default: ui/index.html)')
  console.log('  --manifest=<path> Manifest entry point for the plugin (default: manifest.json)')
  console.log('  --outdir=<path>   Output directory (default: dist)')
  console.log('  --help (-h)       Print this help message')
  console.log('  --clean (-c)      Clean the dist directory')
}

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }
  for (const arg of args) {
    if (arg === '--clean' || arg === '-c') {
      buildOptions.clean = true
    } else if (arg === '--watch' || arg === '-w') {
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
