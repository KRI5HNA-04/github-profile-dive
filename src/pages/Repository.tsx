
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Star, GitFork, Eye, AlertCircle, Calendar, Code, 
  GitCommit, File, FileText
} from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatsCard from "@/components/StatsCard";
import CodeExplorer from "@/components/CodeExplorer";
import { cn } from "@/lib/utils";
import { 
  fetchRepository, fetchRepositoryContents, fetchRepositoryCommits, 
  fetchRepositoryLanguages, fetchFileContent, buildFileTree, 
  Repository, TreeNode, RepositoryContent
} from "@/services/github";

const RepositoryPage = () => {
  const { owner, name } = useParams<{ owner: string; name: string }>();
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<TreeNode | null>(null);

  // Fetch repository details
  const { 
    data: repository,
    isLoading: isLoadingRepo,
    error: repoError
  } = useQuery({
    queryKey: ['repository', owner, name],
    queryFn: () => fetchRepository(owner!, name!),
    enabled: !!owner && !!name,
  });

  // Fetch repository contents
  const { 
    data: contents,
    isLoading: isLoadingContents,
    error: contentsError
  } = useQuery({
    queryKey: ['repositoryContents', owner, name],
    queryFn: () => fetchRepositoryContents(owner!, name!),
    enabled: !!owner && !!name,
  });

  // Fetch repository commits
  const { 
    data: commits,
    isLoading: isLoadingCommits,
    error: commitsError
  } = useQuery({
    queryKey: ['repositoryCommits', owner, name],
    queryFn: () => fetchRepositoryCommits(owner!, name!, 30),
    enabled: !!owner && !!name,
  });

  // Fetch repository languages
  const { 
    data: languages,
    isLoading: isLoadingLanguages,
    error: languagesError
  } = useQuery({
    queryKey: ['repositoryLanguages', owner, name],
    queryFn: () => fetchRepositoryLanguages(owner!, name!),
    enabled: !!owner && !!name,
  });

  // Process contents into a file tree
  useEffect(() => {
    if (contents) {
      const tree = buildFileTree(contents);
      setFileTree(tree);

      // Auto-select README.md file if it exists
      const readmeFile = contents.find(file => 
        file.type === 'file' && 
        file.name.toLowerCase() === 'readme.md'
      );
      
      if (readmeFile) {
        setSelectedFilePath(readmeFile.path);
      }
    }
  }, [contents]);

  // Fetch selected file content
  useEffect(() => {
    if (!selectedFilePath || !owner || !name) {
      setSelectedFileContent(null);
      return;
    }

    const fetchContent = async () => {
      try {
        const fileData = await fetchFileContent(owner, name, selectedFilePath);
        if (fileData.content && fileData.encoding === 'base64') {
          const decodedContent = atob(fileData.content.replace(/\n/g, ''));
          setSelectedFileContent(decodedContent);
        } else {
          setSelectedFileContent('Unable to display file content');
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
        setSelectedFileContent('Error loading file content');
      }
    };

    fetchContent();
  }, [selectedFilePath, owner, name]);

  // Format language data for display
  const formattedLanguages = languages 
    ? Object.entries(languages).map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / Object.values(languages).reduce((a, b) => a + b, 0)) * 100)
      }))
    : [];

  const handleSelectFile = (path: string) => {
    setSelectedFilePath(path);
  };

  const isLoading = isLoadingRepo || isLoadingContents || isLoadingCommits || isLoadingLanguages;
  const error = repoError || contentsError || commitsError || languagesError;

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
          <div className="glass-card flex flex-col items-center text-center p-10">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Repository</h2>
            <p className="text-muted-foreground mb-6">
              {(error as Error).message || "Failed to load repository data."}
            </p>
            <Link
              to="/"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-20 pt-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading repository data...</p>
          </div>
        ) : (
          repository && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center space-x-4 mb-6">
                <Link 
                  to={`/profile/${owner}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to {owner}
                </Link>
              </div>
              
              <div className="glass-card">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Link 
                      to={`/profile/${owner}`}
                      className="text-primary hover:underline"
                    >
                      {owner}
                    </Link>
                    <span className="mx-2 text-muted-foreground">/</span>
                    <h1 className="text-2xl font-bold">{name}</h1>
                  </div>
                  
                  {repository.description && (
                    <p className="text-muted-foreground mb-4">{repository.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repository.topics && repository.topics.map(topic => (
                      <span 
                        key={topic}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{repository.stargazers_count} stars</span>
                    </div>
                    
                    <div className="flex items-center">
                      <GitFork className="w-4 h-4 mr-1" />
                      <span>{repository.forks_count} forks</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{repository.watchers_count} watchers</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Updated {format(new Date(repository.updated_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in delay-100">
                <StatsCard
                  title="Stars"
                  value={repository.stargazers_count}
                  icon={<Star className="w-4 h-4" />}
                />
                <StatsCard
                  title="Forks"
                  value={repository.forks_count}
                  icon={<GitFork className="w-4 h-4" />}
                />
                <StatsCard
                  title="Open Issues"
                  value={repository.open_issues_count}
                  icon={<AlertCircle className="w-4 h-4" />}
                />
              </div>
              
              {formattedLanguages.length > 0 && (
                <div className="glass-card animate-slide-in delay-200">
                  <h2 className="text-lg font-medium mb-4">Languages</h2>
                  <div className="space-y-3">
                    {formattedLanguages.map(lang => (
                      <div key={lang.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{lang.name}</span>
                          <span className="text-muted-foreground">{lang.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in delay-300">
                {fileTree && (
                  <div className="lg:col-span-1">
                    <CodeExplorer 
                      tree={fileTree} 
                      onSelectFile={handleSelectFile}
                    />
                  </div>
                )}
                
                <div className="lg:col-span-2">
                  <div className="glass-card h-full">
                    {selectedFilePath ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <File className="w-4 h-4 mr-2 text-muted-foreground" />
                            <h3 className="text-lg font-medium">{selectedFilePath}</h3>
                          </div>
                          <a 
                            href={`${repository.html_url}/blob/${repository.default_branch}/${selectedFilePath}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            View on GitHub
                          </a>
                        </div>
                        
                        {selectedFileContent ? (
                          <div className="overflow-auto bg-muted/50 rounded-lg p-4 max-h-[500px]">
                            <pre className="text-sm whitespace-pre-wrap break-all">
                              {selectedFileContent}
                            </pre>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-10">
                            <LoadingSpinner size="md" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Select a file from the explorer to view its content
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {commits && commits.length > 0 && (
                <div className="glass-card animate-slide-in delay-400">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Recent Commits</h2>
                    <a 
                      href={`${repository.html_url}/commits/${repository.default_branch}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View all commits
                    </a>
                  </div>
                  
                  <div className="space-y-4 max-h-[500px] overflow-auto">
                    {commits.slice(0, 5).map(commit => (
                      <div 
                        key={commit.sha} 
                        className="p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <GitCommit className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            <div>
                              <a 
                                href={`${repository.html_url}/commit/${commit.sha}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                              >
                                {commit.commit.message}
                              </a>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <span>
                                  {commit.author?.login || commit.commit.author.name}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  {format(new Date(commit.commit.author.date), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <a 
                            href={`${repository.html_url}/commit/${commit.sha}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                          >
                            {commit.sha.substring(0, 7)}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default RepositoryPage;
