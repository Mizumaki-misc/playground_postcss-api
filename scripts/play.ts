import fs from 'fs';
import path from 'path';
import postcss, { Declaration, Rule } from 'postcss';

const basePath = path.resolve(__dirname, '.');

const cssFile = fs.readFileSync(path.resolve(basePath, './css/play.css'));
const root = postcss.parse(cssFile);

// https://postcss.org/api/#root-walkrules
root.walkRules((rule, index) => {
  // console.log(rule.selector);

  // You can use "`walkRules` with selector filter" instead
  if (rule.selector === '.bar') {
    const newRule = new Rule({ selector: '.bar::before' });
    const decl = new Declaration({ prop: 'content', value: '"Before bar, go to French restaurant!"' });
    newRule.append(decl);
    newRule.append('display: block; z-index: 10;')
    rule.cloneAfter(newRule);
  }

  if (rule.selector === '.bar::after') {
    rule.walkDecls('background-color', (decl, i) => {
      // Override `background-color` to `green`
      decl.value = 'green';
      // Add `display: block`
      decl.cloneAfter({ prop: 'display', value: 'block' });
    });
  }
});

// You can confirm that `.bar::before` is added, and the value of `.bar::after` is correctly overridden
console.log(root.toString());

// `walkRules` with selector filter
root.walkRules('.bar', (rule, index) => {
  // console.log(rule.selector);
});

// https://postcss.org/api/#root-walkdecls
root.walkDecls((decl, index) => {
  // console.log({ decl });
});

// https://postcss.org/api/#root-walkatrules
root.walkAtRules('media', (atRule, index) => {
  // console.log({ atRule });
});
