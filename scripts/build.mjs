import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure directories
const contentDir = path.join(__dirname, '../assets/content');
const templatePath = path.join(__dirname, '../_templates/blog-layout.html');
const outputDir = path.join(__dirname, '../blogs');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read template
const template = fs.readFileSync(templatePath, 'utf8');

// Function to parse front matter
function parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return {
            attributes: {},
            body: content
        };
    }

    const frontMatterBlock = match[1];
    const body = match[2];
    const attributes = {};

    frontMatterBlock.split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) {
            attributes[key.trim()] = value.join(':').trim();
        }
    });

    return { attributes, body };
}

// Process files
try {
    const files = fs.readdirSync(contentDir);

    files.forEach((file) => {
        if (path.extname(file) !== '.md') return;

        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { attributes, body } = parseFrontMatter(fileContent);

        // Convert Markdown to HTML
        const htmlContent = marked.parse(body);

        // Replace placeholders in template
        let finalHtml = template
            .replace('{{TITLE}}', attributes.title || 'Blog Post')
            .replace('{{DESCRIPTION}}', attributes.description || 'Saga Data Blog Post')
            .replace('{{DATE}}', attributes.date || 'Recently')
            .replace('{{CATEGORY}}', attributes.category || 'General')
            .replace('{{CONTENT}}', htmlContent);

        // Write HTML file
        const outputFilename = path.basename(file, '.md') + '.html';
        const outputPath = path.join(outputDir, outputFilename);

        fs.writeFileSync(outputPath, finalHtml);
        console.log(`Generated: ${outputFilename}`);
    });
} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
