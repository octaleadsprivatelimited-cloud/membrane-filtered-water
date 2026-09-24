import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.jsx')) results.push(filePath);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replacements
  // For the exact logo <span>aqua<span>pure.</span></span>
  content = content.replace(/<span>aqua<span>pure\.<\/span><\/span>/gi, '<span>Aqua Safe <span>Water Technologies</span></span>');
  content = content.replace(/aquapure\./gi, 'Aqua Safe Water Technologies');
  content = content.replace(/AquaPure/g, 'Aqua Safe Water Technologies');
  content = content.replace(/AQUAPURE/g, 'AQUA SAFE WATER TECHNOLOGIES');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Brand updated across all JSX files');
