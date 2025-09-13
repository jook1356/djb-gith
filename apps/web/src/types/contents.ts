export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  board: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: string[];
  categories: string[];
  language: string;
  thumbnail?: string;
  readTime?: number;
  featured?: boolean;
  difficulty?: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
  path: string;
}

export interface BoardConfig {
  extends: string;
  boardInfo: {
    displayName: string;
    description: string;
    icon: string;
    enabled: boolean;
  };
  overrides: {
    showTags: boolean;
    [key: string]: any;
  };
}

export interface GlobalConfig {
  defaultSettings: {
    allowComments: boolean;
    showAuthor: boolean;
    showDate: boolean;
    pagination: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  siteWide: {
    theme: string;
    language: string;
    timezone: string;
  };
}

export interface BoardInfo {
  name: string;
  config: BoardConfig;
  posts: PostMeta[];
}
