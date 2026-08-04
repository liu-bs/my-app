// ponytail: 非平凡逻辑自检 — slug/parseTags/generateSummary
// 运行方式: JWT_SECRET=self-check node --experimental-transform-types ./self-check.mjs
import { register } from 'node:module';
import assert from 'node:assert/strict';

register('./test-resolver.mjs', import.meta.url);

const { slug, parseTags } = await import('./src/server/modules/blog/services/blog.service.ts');
const { generateSummary } = await import('./src/server/modules/blog/services/summary.service.ts');

// slug
assert.equal(slug('Hello World'), 'hello-world');
assert.equal(slug('测试文章 标题'), '测试文章-标题');
assert.equal(slug('café résumé'), 'cafe-resume');
assert.equal(slug('a'.repeat(50)).length, 30);
assert.equal(slug('!!!???'), '');

// parseTags
assert.deepEqual(parseTags('React, Vue, Angular'), ['react', 'vue', 'angular']);
assert.deepEqual(parseTags(['Next.js', 'React']), ['next.js', 'react']);
assert.deepEqual(parseTags('React, react, REACT'), ['react']);
assert.deepEqual(parseTags('  spaced  ,  tags  '), ['spaced', 'tags']);
assert.equal(parseTags(Array.from({ length: 25 }, (_, i) => `tag${i}`)).length, 20);
assert.deepEqual(parseTags(undefined), []);

// generateSummary
assert.equal(generateSummary('## Hello\n\nThis is **bold** text.'), 'Hello This is bold text.');
assert.equal(generateSummary(''), '（无正文摘要）');

console.log('self-check: all assertions passed');
