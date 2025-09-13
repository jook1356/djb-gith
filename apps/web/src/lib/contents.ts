import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

import type {
  Post,
  PostMeta,
  BoardConfig,
  GlobalConfig,
  BoardInfo,
} from "@/types/contents";

const CONTENTS_DIR = path.join(process.cwd(), "../../contents");
const BOARDS_DIR = path.join(CONTENTS_DIR, "boards");

/**
 * 마크다운을 HTML로 변환
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

/**
 * 전역 설정 불러오기
 */
export function getGlobalConfig(): GlobalConfig {
  const configPath = path.join(CONTENTS_DIR, "boards-config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("Global config not found");
  }

  const configContent = fs.readFileSync(configPath, "utf8");
  return JSON.parse(configContent) as GlobalConfig;
}

/**
 * 게시판 설정 불러오기
 */
export function getBoardConfig(boardName: string): BoardConfig {
  const configPath = path.join(BOARDS_DIR, boardName, "_config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Board config not found: ${boardName}`);
  }

  const configContent = fs.readFileSync(configPath, "utf8");
  return JSON.parse(configContent) as BoardConfig;
}

/**
 * 모든 게시판 목록 가져오기
 */
export function getAllBoards(): string[] {
  if (!fs.existsSync(BOARDS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BOARDS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !name.startsWith("_")); // _config.json 등 제외
}

/**
 * 게시판의 모든 게시글 메타데이터 가져오기
 */
export function getBoardPosts(boardName: string): PostMeta[] {
  const boardPath = path.join(BOARDS_DIR, boardName);

  if (!fs.existsSync(boardPath)) {
    return [];
  }

  const postFolders = fs
    .readdirSync(boardPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !dirent.name.startsWith("_"))
    .map((dirent) => dirent.name);

  const posts: PostMeta[] = [];

  for (const folder of postFolders) {
    const metaPath = path.join(boardPath, folder, "meta.json");

    if (fs.existsSync(metaPath)) {
      const metaContent = fs.readFileSync(metaPath, "utf8");
      const meta = JSON.parse(metaContent) as PostMeta;

      // 게시판 정보가 누락된 경우 추가
      if (!meta.board) {
        meta.board = boardName;
      }

      posts.push(meta);
    }
  }

  // 생성일 기준으로 내림차순 정렬
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * 특정 게시글 가져오기
 */
export async function getPost(
  boardName: string,
  postId: string
): Promise<Post | null> {
  const postPath = path.join(BOARDS_DIR, boardName, postId);
  const metaPath = path.join(postPath, "meta.json");
  const contentPath = path.join(postPath, "index.md");

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
    return null;
  }

  // 메타데이터 읽기
  const metaContent = fs.readFileSync(metaPath, "utf8");
  const meta = JSON.parse(metaContent) as PostMeta;

  // 마크다운 내용 읽기
  const markdownContent = fs.readFileSync(contentPath, "utf8");
  const { content } = matter(markdownContent);

  // HTML로 변환
  const htmlContent = await markdownToHtml(content);

  return {
    meta,
    content: htmlContent,
    path: postPath,
  };
}

/**
 * 게시판 정보와 게시글 목록 함께 가져오기
 */
export function getBoardInfo(boardName: string): BoardInfo {
  const config = getBoardConfig(boardName);
  const posts = getBoardPosts(boardName);

  return {
    name: boardName,
    config,
    posts,
  };
}

/**
 * 폴더명에서 정보 파싱 (가이드에 따른 형식)
 */
export function parsePostFolder(folderName: string) {
  const parts = folderName.split("_");
  if (parts.length < 4) {
    return null;
  }

  const [date, time, ...titleAndHash] = parts;
  const hash = titleAndHash.pop();
  const title = titleAndHash.join("_");

  return {
    date, // "2024-01-15"
    time, // "1430"
    title, // "react-hooks-완벽-가이드"
    hash, // "a1b2c3d4"
  };
}

/**
 * 모든 게시글 검색 (제목, 내용, 태그)
 */
export function searchPosts(query: string): PostMeta[] {
  const allBoards = getAllBoards();
  const allPosts: PostMeta[] = [];

  for (const boardName of allBoards) {
    const posts = getBoardPosts(boardName);
    allPosts.push(...posts);
  }

  const searchQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.description.toLowerCase().includes(searchQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
  );
}
