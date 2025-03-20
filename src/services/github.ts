
// GitHub API Types
export interface UserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
  topics: string[];
  visibility: string;
  default_branch: string;
}

export interface RepositoryContent {
  type: "file" | "dir";
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string | null;
  content?: string;
  encoding?: string;
}

export interface CommitStats {
  total: number;
  additions: number;
  deletions: number;
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  stats?: CommitStats;
}

const API_BASE_URL = "https://api.github.com";

// Fetch user profile information
export const fetchUserProfile = async (username: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/${username}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch user repositories
export const fetchUserRepositories = async (username: string): Promise<Repository[]> => {
  const response = await fetch(`${API_BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch repository details
export const fetchRepository = async (owner: string, repo: string): Promise<Repository> => {
  const response = await fetch(`${API_BASE_URL}/repos/${owner}/${repo}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repository: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch repository contents (files and directories)
export const fetchRepositoryContents = async (
  owner: string,
  repo: string,
  path: string = ""
): Promise<RepositoryContent[]> => {
  const url = path 
    ? `${API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`
    : `${API_BASE_URL}/repos/${owner}/${repo}/contents`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repository contents: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch file content
export const fetchFileContent = async (
  owner: string,
  repo: string,
  path: string
): Promise<RepositoryContent> => {
  const response = await fetch(`${API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch commits for a repository
export const fetchRepositoryCommits = async (
  owner: string,
  repo: string,
  perPage: number = 30
): Promise<Commit[]> => {
  const response = await fetch(`${API_BASE_URL}/repos/${owner}/${repo}/commits?per_page=${perPage}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch commits: ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch languages used in a repository
export const fetchRepositoryLanguages = async (
  owner: string,
  repo: string
): Promise<Record<string, number>> => {
  const response = await fetch(`${API_BASE_URL}/repos/${owner}/${repo}/languages`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }
  
  return response.json();
};

// Build file tree from flat contents
export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: TreeNode[];
}

export const buildFileTree = (contents: RepositoryContent[]): TreeNode => {
  const root: TreeNode = {
    name: "root",
    path: "",
    type: "dir",
    children: []
  };
  
  // Sort contents to have directories first, then files alphabetically
  const sortedContents = [...contents].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "dir" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
  
  for (const item of sortedContents) {
    const node: TreeNode = {
      name: item.name,
      path: item.path,
      type: item.type === "file" ? "file" : "dir"
    };
    
    if (node.type === "file") {
      root.children?.push(node);
    } else {
      // It's a directory
      node.children = [];
      root.children?.push(node);
    }
  }
  
  return root;
};
