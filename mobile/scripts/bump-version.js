const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const PKG_PATH = path.join(ROOT, 'package.json')
const GRADLE_PATH = path.join(ROOT, 'android', 'app', 'build.gradle')

const type = process.argv[2] || 'minor'
if (!['minor', 'patch'].includes(type)) {
  console.error('Uso: node scripts/bump-version.js <minor|patch>')
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
const [major, minor, patch] = pkg.version.split('.').map(Number)
let next
if (type === 'minor') next = [major, minor + 1, 0]
else next = [major, minor, patch + 1]
const nextVersion = next.join('.')
const versionCode = next[0] * 10000 + next[1] * 100 + next[2]

pkg.version = nextVersion
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n')

let gradle = fs.readFileSync(GRADLE_PATH, 'utf8')
const gradleRe = /versionCode\s+\d+/
const nameRe = /versionName\s+"[^"]*"/
if (!gradleRe.test(gradle) || !nameRe.test(gradle)) {
  console.error('No se encontró versionCode/versionName en build.gradle')
  process.exit(1)
}
gradle = gradle.replace(gradleRe, `versionCode ${versionCode}`)
gradle = gradle.replace(nameRe, `versionName "${nextVersion}"`)
fs.writeFileSync(GRADLE_PATH, gradle)

console.log(`Versión actualizada a ${nextVersion} (versionCode ${versionCode})`)
console.log('Recuerda agregar la entrada en mobile/src/constants/versionHistory.js')
