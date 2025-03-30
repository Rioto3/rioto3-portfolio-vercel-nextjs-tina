import React from 'react';
import { useLayout } from '@/components/layout/layout-context';

// Notion風のパステルカラーパレット
const tagColors = {
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-700',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-700',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-700',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-700',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-700',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700',
  },
};

// タグのハッシュ関数（一貫したカラー割り当てのため）
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// タグカラーを決定する関数
const getTagColor = (tag: string) => {
  const colorKeys = Object.keys(tagColors);
  const colorIndex = hashCode(tag) % colorKeys.length;
  return colorKeys[colorIndex] as keyof typeof tagColors;
};

// タグコンポーネント
export const RichTags = ({ tags }: { tags?: (string | null)[] }) => {
  const { theme } = useLayout();

  // nullを除外し、空の配列の場合は null を返す
  const validTags = tags?.filter((tag): tag is string => tag !== null && tag.trim() !== '');

  if (!validTags || validTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4 px-4">
      {validTags.map((tag) => {
        const tagColor = getTagColor(tag);
        const colorSet = tagColors[tagColor];

        return (
          <span 
            key={tag} 
            className={`
              inline-flex items-center 
              px-2.5 py-1 
              rounded-md 
              text-xs 
              font-medium 
              border 
              transition-all 
              duration-200 
              ease-in-out
              cursor-pointer
              hover:opacity-80
              ${colorSet.bg}
              ${colorSet.text}
              ${colorSet.border}
            `}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
};

export default RichTags;