#!/usr/bin/env node
// 零依赖 Node ESM 脚本：扫描 docs/ 目录自动生成 Docsify 的 docs/_sidebar.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 以脚本所在位置定位 docs 目录（scripts/ 的同级 docs/）
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const SIDEBAR_PATH = path.join(DOCS_DIR, '_sidebar.md');

const EXCLUDED_BASENAMES = new Set(['_sidebar.md', '_navbar.md']);
// 置顶关键词（出现在文件名中则排在组内最前）
const PRIORITY_HINTS = ['index', 'getting-started', 'intro'];

/**
 * 递归收集 docs 下所有 .md 文件的绝对路径。
 * @param {string} dir
 * @param {string[]} acc
 * @returns {string[]}
 */
function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * 读取 md 文件第一个一级标题；没有则用文件名美化。
 * @param {string} absPath
 * @returns {string}
 */
function getTitle(absPath) {
  let content = '';
  try {
    content = fs.readFileSync(absPath, 'utf8');
  } catch {
    content = '';
  }
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const m = /^#\s+(.+?)\s*#*\s*$/.exec(line.trim());
    if (m) return m[1].trim();
  }
  // 回退：文件名去扩展名，- 和 _ 换空格
  const base = path.basename(absPath).replace(/\.md$/i, '');
  return base.replace(/[-_]/g, ' ').trim();
}

/** 目录名首字母大写（其余原样）。 */
function cap(name) {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** 文件是否属于组内置顶项。 */
function isPriority(basename) {
  const lower = basename.toLowerCase();
  if (lower === 'readme.md') return true;
  const stem = lower.replace(/\.md$/, '');
  return PRIORITY_HINTS.some((h) => stem.includes(h));
}

/** 组内排序比较器：置顶项在前，再按文件名字母序。 */
function fileCompare(a, b) {
  const pa = isPriority(path.basename(a));
  const pb = isPriority(path.basename(b));
  if (pa !== pb) return pa ? -1 : 1;
  return path.basename(a).toLowerCase().localeCompare(path.basename(b).toLowerCase());
}

/** 生成以 / 开头、相对 docs 根、用 / 分隔的链接路径。 */
function toLink(absPath) {
  const rel = path.relative(DOCS_DIR, absPath).split(path.sep).join('/');
  return '/' + rel;
}

function main() {
  // docs 目录可能还不存在（其他 agent 可能在并发创建），先确保存在
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const allMd = walk(DOCS_DIR);

  const topLevelFiles = []; // docs 根目录的文件（不含排除项）
  const groups = new Map(); // dirKey(相对路径) -> 文件绝对路径数组

  for (const abs of allMd) {
    const rel = path.relative(DOCS_DIR, abs);
    const parts = rel.split(path.sep);
    const basename = parts[parts.length - 1];
    const lowerBase = basename.toLowerCase();

    // 排除 _sidebar.md / _navbar.md（任何层级）
    if (EXCLUDED_BASENAMES.has(lowerBase)) continue;

    if (parts.length === 1) {
      // 根目录文件：排除根 README.md（它是首页）
      if (lowerBase === 'readme.md') continue;
      topLevelFiles.push(abs);
    } else {
      // 子目录文件：按直接父目录（第一层子目录）分组
      const dirKey = parts.slice(0, parts.length - 1).join('/');
      if (!groups.has(dirKey)) groups.set(dirKey, []);
      groups.get(dirKey).push(abs);
    }
  }

  topLevelFiles.sort(fileCompare);

  const lines = [];
  lines.push('<!-- 此文件由 scripts/gen-sidebar.mjs 自动生成，可手动编辑，但重跑脚本会覆盖 -->');
  lines.push('- [🏠 首页](/)');

  let entryCount = 0;

  // 顶层文件
  for (const abs of topLevelFiles) {
    lines.push(`- [${getTitle(abs)}](${toLink(abs)})`);
    entryCount++;
  }

  // 子目录分组（按目录 key 字母序）
  const dirKeys = [...groups.keys()].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  for (const dirKey of dirKeys) {
    const files = groups.get(dirKey).sort(fileCompare);
    // 分组标题：用该目录（dirKey 的最后一段）名，首字母大写
    const groupName = cap(dirKey.split('/').pop());
    lines.push(`- ${groupName}`);
    for (const abs of files) {
      lines.push(`  - [${getTitle(abs)}](${toLink(abs)})`);
      entryCount++;
    }
  }

  const output = lines.join('\n') + '\n';
  fs.writeFileSync(SIDEBAR_PATH, output, 'utf8');

  console.log(`✅ 已写入 ${entryCount} 个文档条目到 ${SIDEBAR_PATH}`);
}

main();
