
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import RepositoryCard from "./RepositoryCard";
import { Repository } from "@/services/github";

interface RepositoryListProps {
  repositories: Repository[];
  className?: string;
}

const RepositoryList = ({ repositories, className }: RepositoryListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "forks">("updated");

  const filteredRepositories = repositories
    .filter((repo) => 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else if (sortBy === "stars") {
        return b.stargazers_count - a.stargazers_count;
      } else {
        return b.forks_count - a.forks_count;
      }
    });

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "updated" | "stars" | "forks")}
            className="px-4 py-2 rounded-lg bg-white/80 dark:bg-black/40 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
          </select>
        </div>
      </div>
      
      {filteredRepositories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No repositories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepositories.map((repo, index) => (
            <RepositoryCard 
              key={repo.id} 
              repo={repo} 
              animationDelay={index * 100}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
