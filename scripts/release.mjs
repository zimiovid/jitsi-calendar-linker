#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function log(msg) { process.stdout.write(msg + '\n') }
function sh(cmd) { execSync(cmd, { stdio: 'inherit' }) }

const rawArg = process.argv[2]
if (!rawArg) { console.error('Usage: npm run release -- <version> (e.g. 1.0.2)'); process.exit(1) }
const version = rawArg.replace(/^v/, '')
const tag = 'v' + version

const root = process.cwd()
// Only version source files that are committed to git.
const files = [
    resolve(root, 'package.json'),
    resolve(root, 'src/manifest.json'),
]

for (const file of files) {
    const json = JSON.parse(readFileSync(file, 'utf8'))
    json.version = version
    writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
    log(`updated ${file} -> ${version}`)
}

// commit, tag, push
sh(`git add ${files.map(f => `'${f}'`).join(' ')}`)
sh(`git commit -m "chore: release ${tag}" || echo "nothing to commit"`)
sh('git push origin HEAD')
sh(`git tag ${tag} || echo "tag exists"`)
sh(`git push origin ${tag}`)

