const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

function convertMdToMdx(srcPath, destPath, options = {}) {
  const {
    defaultAuthor = 'content/authors/Rioto3.md',
    defaultHeroImg = '', 
    generateExcerpt = true,
  } = options;

  const mdContent = fs.readFileSync(srcPath, 'utf8');
  const { data: frontMatter, content } = matter(mdContent);
  
  const mdxFrontMatter = {
    tags: frontMatter.topics || [],
    title: frontMatter.title,
    heroImg: defaultHeroImg,
    excerpt: generateExcerpt 
      ? generateExcerptFromContent(content, frontMatter.title) 
      : frontMatter.title,
    author: defaultAuthor,
    date: options.date || new Date().toISOString(),
  };
  
  const mdxContent = `---
${yaml.dump(mdxFrontMatter)}---

${content}`;
  
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.writeFileSync(destPath, mdxContent, 'utf8');
  
  return {
    srcPath,
    destPath,
    frontMatter: mdxFrontMatter
  };
}

function generateExcerptFromContent(content, title) {
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
  
  if (paragraphs.length === 0) {
    return title;
  }
  
  let excerpt = paragraphs[0].trim();
  
  excerpt = excerpt
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  
  if (excerpt.length > 150) {
    excerpt = excerpt.substring(0, 147) + '...';
  }
  
  return excerpt;
}

function main() {
  const sourceDir = process.env.SOURCE_DIR || './zenn-contents/articles';
  const destDir = process.env.DEST_DIR || './portfolio/content/posts';
  const specificFile = process.env.SPECIFIC_FILE || '';
  
  let sourceFiles;
  
  if (specificFile) {
    // 特定のファイルのみ処理
    if (fs.existsSync(path.join(sourceDir, specificFile))) {
      sourceFiles = [specificFile];
    } else {
      console.error(`指定されたファイル ${specificFile} は存在しません`);
      process.exit(1);
    }
  } else {
    // すべてのファイルを処理
    sourceFiles = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('_'));
  }
  
  console.log(`Converting ${sourceFiles.length} files from ${sourceDir} to ${destDir}`);
  
  for (const file of sourceFiles) {
    const srcPath = path.join(sourceDir, file);
    const destFileName = file.replace(/\.md$/, '.mdx');
    const destPath = path.join(destDir, destFileName);
    
    try {
      const result = convertMdToMdx(srcPath, destPath, {
        date: new Date().toISOString(),
        defaultHeroImg: '',
      });
      
      console.log(`✅ Converted: ${result.srcPath} -> ${result.destPath}`);
    } catch (error) {
      console.error(`❌ Error converting ${srcPath}: ${error.message}`);
    }
  }
}

main();
