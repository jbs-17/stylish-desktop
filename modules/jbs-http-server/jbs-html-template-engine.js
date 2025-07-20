//core
import fs from 'node:fs/promises';
import path from 'node:path';
import constants from 'node:constants';

function errorMessage(error) {
  return error
}
//baca direktori penyimpana file file template
async function readdirTemplates(pathDir) {
  if (typeof pathDir !== 'string') {
    throw errorMessage(new Error(`no such directory: ${pathDir}`));
  }
  try {
    await fs.access(pathDir, constants.R_OK);
  } catch (error) {
    throw errorMessage(error);
  }
  let templates = await fs.readdir(pathDir);
  templates = templates.map(template => path.normalize(path.join(pathDir, template)));
  return templates;
}
//baca satu file template untuk menemukan hubungan dengan template lain untuk di tempel sampai batas depth
async function readTemplate(templates, template, depth = 10) {
  if (typeof depth !== 'number') {
    throw errorMessage(new Error('depth must be number!'))
  }
  if (depth > 100) {
    throw errorMessage(new Error('max depth is 100!!!'))
  }
  let textTemplate = '';
  const templatesNames = templates.map(t => `<(${path.parse(t).name})>`);
  let readAllTemplates = templates?.map(t => fs.readFile(t, 'utf8'));
  readAllTemplates = await Promise.all(readAllTemplates);
  readAllTemplates = readAllTemplates.map((t, i) => {
    const name = templatesNames[i];
    return [name, t]
  })
  const allTemplatesKeyValue = Object.fromEntries(readAllTemplates);
  let index = null;
  for (let i = 0; i < templates?.length; i++) {
    if (path.parse(templates[i]).name === template) {
      index = i;
      break;
    }
  }
  if (index === null) {
    throw errorMessage(new Error(`template ${template} not found!`));
  }
  textTemplate = readAllTemplates[index][1];
  let isIncludesOtherView = templatesNames.filter(name => {
    return textTemplate.includes(name);
  });
  while (isIncludesOtherView.length) {
    if (depth === 0) { break; };
    depth = depth - 1;
    isIncludesOtherView.forEach(name => {
      textTemplate = textTemplate.replaceAll(name, allTemplatesKeyValue[name])
    })
    isIncludesOtherView = templatesNames.filter(name => {
      return textTemplate.includes(name);
    })
  }
  return textTemplate
}
//template engine utama untuk mereplace key dengan value pada template
function templateEngine(template, data = {}) {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'function' || typeof value === 'symbol') {
      throw errorMessage(new Error(`${key} : ${String(value)} => ${typeof value} is not allowed!`));
    }

    if (Array.isArray(value)) {
      if (value.some(x => Array.isArray(x))) {
        throw errorMessage(new Error(`${key} : ${JSON.stringify(value)} => nested Array is forbidden!!!`));
      }
    } else if (typeof value === 'object' && value !== null) {
      if (Object.values(value).some(x => typeof x === 'object' && x !== null)) {
        throw errorMessage(new Error(`${key} : ${JSON.stringify(value)} => nested Object is forbidden!!!`));
      }
    }
  }
  let container = [];
  let a = '';
  let x = '';
  let v = false;
  for (const _ of template) {
    x += _;
    if (v) {
      a += _
    }
    if (x.endsWith('<|')) {
      v = true;
      a += '<|'
    }
    if (x.endsWith('|>')) {
      v = false;
      container.push(a);
      a = '';
    }
  }

  const keys = Object.getOwnPropertyNames(data).map(key => [key, data[key]]);
  const xxx = container;
  const yyy = container.map((t) => {
    t = t.replaceAll('<|', '').replaceAll('|>', '').trim();
    let exe = t;
    for (const [key, value] of keys) {
      if (exe.includes(key)) {
        const type = typeof value;
        if (type === 'object') {
          if (Array.isArray(value)) {
            const elements = value.map((e, i) => {
              return [`${key}[${i}]`, `${e}`];
            })
            elements.forEach(([x, y]) => {
              exe = exe.replaceAll(x, y);
            });
          } else {
            const elements = Object.entries(value)
            let e1 = elements.map(([x, y]) => {
              return [`${key}.${x}`, `${y}`]
            });
            let e2 = elements.map(([x, y]) => {
              return [`${key}["${x}"]`, `${y}`]
            });
            const e = [...e1, ...e2];
            e.forEach(([x, y]) => {
              exe = exe.replaceAll(x, y);
            });
          }
        } else {
          exe = exe.replaceAll(key, `${value}`);
        }
      }
    }
    return exe
  });

  while (xxx.length && yyy.length) {
    const a = xxx.shift();
    const b = yyy.shift();
    template = template.replace(a, b);
  }
  return template
};

/*
FUNGSI readReplaceResult UNTUK MENJALAN KAN 
1. baca direktori tempat file file template
2. baca satu nama template yang dipilih dan evaluasi jika ada template terkait hingga depth maximal
3. replate tiap key dengan value sesusai data yg dikasih
4. retun hasil
*/
async function readReplaceResult(templates, template, data) {
  template = await readTemplate(templates, template, 10);
  return templateEngine(template, data)
}

/*
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const templates = await readdirTemplates('./views');
const result = await readReplaceResult(templates, 'main', { title: 'JBS-SIMPLE-HTML-TEMPLATE-ENGINE', creator: 'JBS',  })
console.log({ result: escapeHtml(result) });
*/
const readTemplatesAndServe = readReplaceResult;
export default { readdirTemplates, readTemplatesAndServe, templateEngine, };
export {  readdirTemplates, readTemplatesAndServe, templateEngine }