const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../../../frontend/src');

function replaceInFile(filePath) {
    const stat = fs.statSync(filePath);
    if (stat.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css'))) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        if (content.includes('/images/')) {
            content = content.replace(/\/images\//g, 'https://images.meditea.vn/images/');
            changed = true;
        }
        
        if (content.includes('/3D/')) {
            content = content.replace(/\/3D\//g, 'https://images.meditea.vn/3D/');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } else if (stat.isDirectory()) {
        const files = fs.readdirSync(filePath);
        for (let file of files) {
            replaceInFile(path.join(filePath, file));
        }
    }
}

replaceInFile(directory);
console.log('Replacement complete.');
