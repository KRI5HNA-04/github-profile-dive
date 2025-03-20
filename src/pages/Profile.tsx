
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Code, GitBranch, Star, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import RepositoryList from "@/components/RepositoryList";
import StatsCard from "@/components/StatsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchUserProfile, fetchUserRepositories, UserProfile, Repository } from "@/services/github";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [topLanguages, setTopLanguages] = useState<{ name: string; count: number }[]>([]);
  
  const { 
    data: profile, 
    isLoading: isLoadingProfile, 
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => fetchUserProfile(username!),
    enabled: !!username,
  });
  
  const { 
    data: repositories, 
    isLoading: isLoadingRepos, 
    error: reposError 
  } = useQuery({
    queryKey: ['userRepositories', username],
    queryFn: () => fetchUserRepositories(username!),
    enabled: !!username,
  });
  
  // Calculate top languages from repositories
  useEffect(() => {
    if (repositories) {
      const languagesMap: Record<string, number> = {};
      
      repositories.forEach(repo => {
        if (repo.language) {
          languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
        }
      });
      
      const sortedLanguages = Object.entries(languagesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      setTopLanguages(sortedLanguages);
    }
  }, [repositories]);
  
  // Calculate repository statistics
  const repoStats = useMemo(() => {
    if (!repositories) return null;
    
    return {
      totalStars: repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repositories.reduce((sum, repo) => sum + repo.forks_count, 0),
      ownedRepos: repositories.filter(repo => !repo.fork).length,
      forkedRepos: repositories.filter(repo => repo.fork).length,
    };
  }, [repositories]);
  
  const isLoading = isLoadingProfile || isLoadingRepos;
  const error = profileError || reposError;
  
  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
          <div className="glass-card flex flex-col items-center text-center p-10">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-6">
              {(error as Error).message || "Failed to load GitHub profile data."}
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
            <p className="mt-4 text-muted-foreground">Loading profile data...</p>
          </div>
        ) : (
          profile && repositories && (
            <div className="space-y-10 animate-fade-in">
              <ProfileCard profile={profile} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Total Stars"
                  value={repoStats?.totalStars || 0}
                  icon={<Star className="w-4 h-4" />}
                />
                <StatsCard
                  title="Total Forks"
                  value={repoStats?.totalForks || 0}
                  icon={<GitBranch className="w-4 h-4" />}
                />
                <StatsCard
                  title="Public Repositories"
                  value={profile.public_repos}
                  icon={<Code className="w-4 h-4" />}
                />
              </div>
              
              {topLanguages.length > 0 && (
                <div className="glass-card animate-slide-in">
                  <h3 className="text-lg font-medium mb-4">Top Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {topLanguages.map(lang => (
                      <div 
                        key={lang.name}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {lang.name} ({lang.count})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="animate-slide-in delay-200">
                <h2 className="text-2xl font-bold mb-6">Repositories</h2>
                <RepositoryList repositories={repositories} />
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Profile;
