const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

/**
 * Zennの記事（MD）をポートフォリオサイト用（MDX）に変換する
 */
function convertMdToMdx(srcPath, destPath, options = {}) {
  const {
    defaultAuthor = 'content/authors/Rioto3.md',
    defaultHeroImg = '', // 省略時は空に
    generateExcerpt = true, // 自動的に概要を生成するかどうか
  } = options;

  // ファイルを読み込む
  const mdContent = fs.readFileSync(srcPath, 'utf8');
  
  // front matter を解析
  const { data: frontMatter, content } = matter(mdContent);
  
  // MDX用のフロントマターを生成
  const mdxFrontMatter = {
    // タグの変換（Zennのtopicsをタグに）
    tags: frontMatter.topics || [],
    
    // タイトルはそのまま使用
    title: frontMatter.title,
    
    // ヒーロー画像は指定があれば使用、なければデフォルト
    heroImg: defaultHeroImg,
    
    // 概要（excerpt）の生成
    excerpt: generateExcerpt 
      ? generateExcerptFromContent(content, frontMatter.title) 
      : frontMatter.title,
    
    // 著者情報
    author: defaultAuthor,
    
    // 日付は現在時刻またはオプションで指定
    date: options.date || new Date().toISOString(),
  };
  
  // MDXファイルの内容を構築
  const mdxContent = `---
${yaml.dump(mdxFrontMatter)}---

${content}`;
  
  // 出力ディレクトリが存在しない場合は作成
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // ファイルに書き込む
  fs.writeFileSync(destPath, mdxContent, 'utf8');
  
  return {
    srcPath,
    destPath,
    frontMatter: mdxFrontMatter
  };
}

/**
 * 記事の内容から概要（excerpt）を生成する
 * 最初の段落または適切な長さの文章を抽出
 */
function generateExcerptFromContent(content, title) {
  // 記事本文から最初の段落を抽出
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
  
  if (paragraphs.length === 0) {
    return title;
  }
  
  let excerpt = paragraphs[0].trim();
  
  // Markdownのリンクや強調などの記法を除去
  excerpt = excerpt
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 強調・太字
    .replace(/`([^`]+)`/g, '$1'); // インラインコード
  
  // 長すぎる場合は切り詰める
  if (excerpt.length > 150) {
    excerpt = excerpt.substring(0, 147) + '...';
  }
  
  return excerpt;
}

/**
 * メイン関数
 */
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
        defaultHeroImg: '/uploads/default-hero.png',
      });
      
      console.log(`✅ Converted: ${result.srcPath} -> ${result.destPath}`);
    } catch (error) {
      console.error(`❌ Error converting ${srcPath}: ${error.message}`);
    }
  }
}

// メイン関数を実行
main();
