import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

test('patched dev-only glob matcher preserves the exact API used by typescript-estree', () => {
  const requireFromParser = createRequire(new URL('../node_modules/@typescript-eslint/typescript-estree/package.json', import.meta.url));
  const { minimatch } = requireFromParser('minimatch');
  // Caller: allowDefaultProject.some(pattern => minimatch(filePath, pattern, {dot:true})).
  assert.equal(minimatch('src/.config.ts', 'src/*.ts', {dot:true}), true);
  assert.equal(minimatch('src/file.ts', 'src/*.ts', {dot:true}), true);
  assert.equal(minimatch('src/nested/file.ts', 'src/*.ts', {dot:true}), false);
  assert.equal(minimatch('src/nested/file.ts', 'src/**/*.ts', {dot:true}), true);
  assert.equal(minimatch('src/file.js', 'src/*.ts', {dot:true}), false);
});
