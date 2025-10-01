/**
 * Postinstall script: injects rn-semver scripts into consumer package.json
 * without overwriting existing commands. Uses INIT_CWD to detect
 * the installing project's root.
 */

import * as fs from 'fs';
import * as path from 'path';

type Scripts = Record<string, string>;

function safeAssignScripts(
  existing: Scripts,
  toAdd: Scripts
): { updated: Scripts; added: string[] } {
  const updated: Scripts = { ...existing };
  const added: string[] = [];
  for (const [key, value] of Object.entries(toAdd)) {
    if (!updated[key]) {
      updated[key] = value;
      added.push(key);
    }
  }
  return { updated, added };
}

function run(): void {
  // INIT_CWD points to the project that ran the install
  const targetRoot = process.env.INIT_CWD || process.cwd();
  const pkgPath = path.join(targetRoot, 'package.json');

  try {
    if (!fs.existsSync(pkgPath)) {
      console.log(
        '[react-native-semver-sync] Skipping postinstall: package.json not found at',
        pkgPath
      );
      return;
    }

    const raw = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);

    const scripts: Scripts = pkg.scripts || {};

    const recommended: Scripts = {
      'version:patch': 'rn-semver patch',
      'version:minor': 'rn-semver minor',
      'version:major': 'rn-semver major',
      'version:sync': 'rn-semver sync',
    };

    const { updated, added } = safeAssignScripts(scripts, recommended);
    if (added.length === 0) {
      console.log(
        '[react-native-semver-sync] Postinstall: scripts already present. No changes made.'
      );
      return;
    }

    pkg.scripts = updated;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

    console.log('\n[react-native-semver-sync] Added scripts to package.json:');
    for (const k of added) {
      console.log(`  - ${k}: ${recommended[k]}`);
    }
    console.log('\nUse:');
    console.log('  npm run version:patch   # 1.0.0 → 1.0.1');
    console.log('  npm run version:minor   # 1.0.1 → 1.1.0');
    console.log('  npm run version:major   # 1.1.0 → 2.0.0');
    console.log(
      '  npm run version:sync    # sync current version across platforms'
    );
  } catch (err) {
    console.log(
      '[react-native-semver-sync] Postinstall failed:',
      err instanceof Error ? err.message : err
    );
  }
}

run();
