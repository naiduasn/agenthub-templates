import Ajv2020 from 'ajv/dist/2020.js';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const templateKinds = ['agents', 'workflows', 'skills', 'connections'];
const kindByDirectory = {
  agents: 'agent',
  workflows: 'workflow',
  skills: 'skill',
  connections: 'connection',
};

const args = new Set(process.argv.slice(2));
const outIndex = process.argv.indexOf('--out');
const outputPath = outIndex >= 0 ? process.argv[outIndex + 1] : undefined;
const checkOnly = args.has('--check');

const ajv = new Ajv2020({ allErrors: true, strict: false });
const schemas = {};

for (const kind of Object.values(kindByDirectory)) {
  const schemaPath = path.join(root, 'schemas', `${kind}-template.schema.json`);
  schemas[kind] = ajv.compile(JSON.parse(await readFile(schemaPath, 'utf8')));
}

const catalog = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: {
    repository: process.env.GITHUB_REPOSITORY || 'local',
    ref: process.env.GITHUB_REF_NAME || 'local',
    sha: process.env.GITHUB_SHA || 'local',
  },
  templates: {
    agents: [],
    workflows: [],
    skills: [],
    connections: [],
  },
};

const seen = new Set();

for (const directory of templateKinds) {
  const base = path.join(root, 'templates', directory);
  const entries = await readdir(base, { withFileTypes: true }).catch(() => []);
  for (const entry of entries.filter((item) => item.isDirectory())) {
    const templateDir = path.join(base, entry.name);
    const templatePath = path.join(templateDir, 'template.yaml');
    const raw = await readFile(templatePath, 'utf8');
    const parsed = YAML.parse(raw);
    const kind = kindByDirectory[directory];

    if (parsed?.kind !== kind) {
      throw new Error(`${templatePath} declares kind "${parsed?.kind}" but must be "${kind}".`);
    }

    const validate = schemas[kind];
    if (!validate(parsed)) {
      const details = ajv.errorsText(validate.errors, { separator: '\n' });
      throw new Error(`${templatePath} failed schema validation:\n${details}`);
    }

    const key = `${kind}:${parsed.id}`;
    if (seen.has(key)) throw new Error(`Duplicate template id ${key}`);
    seen.add(key);

    catalog.templates[directory].push(await withReferencedFiles(templateDir, parsed));
  }
}

for (const directory of templateKinds) {
  catalog.templates[directory].sort((a, b) => a.id.localeCompare(b.id));
}

catalog.counts = Object.fromEntries(
  templateKinds.map((directory) => [directory, catalog.templates[directory].length]),
);

if (checkOnly) {
  console.log(`Validated ${seen.size} templates.`);
} else {
  const target = path.join(root, outputPath || 'dist/catalog.json');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, target)} with ${seen.size} templates.`);
}

async function withReferencedFiles(templateDir, template) {
  const hydrated = { ...template };
  if (template.instructionsFile) {
    hydrated.instructionsText = await readLocalFile(templateDir, template.instructionsFile);
  }
  if (template.skillFile) {
    hydrated.skillText = await readLocalFile(templateDir, template.skillFile);
  }
  if (template.readmeFile) {
    hydrated.readmeText = await readLocalFile(templateDir, template.readmeFile);
  }
  return hydrated;
}

async function readLocalFile(templateDir, relativePath) {
  const resolved = path.resolve(templateDir, relativePath);
  if (!resolved.startsWith(path.resolve(templateDir))) {
    throw new Error(`Referenced file escapes template directory: ${relativePath}`);
  }
  return readFile(resolved, 'utf8');
}
