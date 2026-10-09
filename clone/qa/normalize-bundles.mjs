// GLSL whitespace in Three.js template strings is insignificant. Normalize only
// trailing spaces/tabs for clean generated diffs, never alter other string data.
import {readFileSync,writeFileSync} from 'node:fs';
for(const file of ['dist/app-bundle.js','dist/runner-bundle.js','dist/author-bundle.js']) {
 const source=readFileSync(file,'utf8');
 writeFileSync(file,source.replace(/[ \t]+$/gm,''));
}
