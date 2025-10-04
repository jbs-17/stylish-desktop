import fs from 'node:fs/promises';
import path from 'node:path';
import constants from 'node:constants';
import errorMessage from './jbs-error-message.js';



// Escape HTML untuk mencegah XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Membaca isi direktori template
async function readdirTemplates(pathDir) {
  if (typeof pathDir !== 'string') throw errorMessage(new Error(`no such directory: ${pathDir}`));
  try {
    await fs.access(pathDir, constants.R_OK);
  } catch (error) {
    throw errorMessage(error);
  }
  const templates = await fs.readdir(pathDir);
  return templates.map(t => path.normalize(path.join(pathDir, t)));
}

// Membaca isi file template dan menyatukan semua template berelasi (dengan depth maksimum)
async function readTemplate(templates, template, depth = 3) {
  if (typeof depth !== 'number') throw errorMessage(new Error('depth must be number!'));
  if (depth > 100) throw errorMessage(new Error('max depth is 100!!!'));

  const templatesNames = templates.map(t => `<(${path.parse(t).name})>`);
  const templateContents = await Promise.all(templates.map(t => fs.readFile(t, 'utf8')));
  const templateMap = Object.fromEntries(templatesNames.map((name, i) => [name, templateContents[i]]));

  const index = templates.findIndex(t => path.parse(t).name === template);
  if (index === -1) throw errorMessage(new Error(`template ${template} not found!`));

  let textTemplate = templateContents[index];
  let includes = templatesNames.filter(name => textTemplate.includes(name));

  while (includes.length && depth > 0) {
    depth--;
    for (const name of includes) {
      textTemplate = textTemplate.replaceAll(name, templateMap[name]);
    }
    includes = templatesNames.filter(name => textTemplate.includes(name));
  }

  return textTemplate;
}

// Template engine inti untuk mengganti ekspresi dengan data
function templateEngine(template, data = {}) {
  // Validasi isi data (tidak boleh nested object/array, function, dll)
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'function' || typeof value === 'symbol') {
      throw errorMessage(new Error(`${key}: ${String(value)} => ${typeof value} is not allowed!`));
    }

    if (Array.isArray(value) && value.some(x => Array.isArray(x))) {
      throw errorMessage(new Error(`${key}: nested array is forbidden!`));
    }

    if (typeof value === 'object' && value !== null && Object.values(value).some(x => typeof x === 'object')) {
      throw errorMessage(new Error(`${key}: nested object is forbidden!`));
    }
  }

  // Regex untuk menangkap ekspresi <| ... |>
  const regex = /<\|\s*([\s\S]+?)\s*\|>/g;

  const result = template.replace(regex, (_, expr) => {
    try {
      // Evaluasi ekspresi secara dinamis
      const val = new Function(...Object.keys(data), `return ${expr}`)(...Object.values(data));
      return val;
    } catch {
      return '';
    }
  });

  return result;
}

// Proses gabungan baca template dan render
async function readReplaceResult(templates, template='', data) {
  if(template.endsWith('html')){
    template = template.slice(0,template.length - 5)
  }
  const tpl = await readTemplate(templates, template, 10);
  return templateEngine(tpl, data);
}

const readTemplatesAndServe = readReplaceResult;
export default { readdirTemplates, readTemplatesAndServe, templateEngine };
export { readdirTemplates, readTemplatesAndServe, templateEngine };
