
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Star, GitFork, Code } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Repository } from "@/services/github";

interface RepositoryCardProps {
  repo: Repository;
  className?: string;
  animationDelay?: number;
}

const RepositoryCard = ({
  repo,
  className,
  animationDelay = 0,
}: RepositoryCardProps) => {
  const languageColor = useMemo(() => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      HTML: "bg-pink-500",
      CSS: "bg-indigo-500",
      Ruby: "bg-red-600",
      PHP: "bg-indigo-400",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-400",
      Dart: "bg-blue-400",
      C: "bg-gray-500",
      "C#": "bg-green-600",
      Shell: "bg-gray-400",
      default: "bg-gray-300",
    };
    
    return colors[repo.language || ""] || colors.default;
  }, [repo.language]);

  const formattedDate = useMemo(() => {
    return formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true });
  }, [repo.updated_at]);

  return (
    <Link
      to={`/repository/${repo.owner.login}/${repo.name}`}
      className={cn(
        "glass-card h-full flex flex-col animate-slide-in opacity-0",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "forwards" }}
    >
      <h3 className="text-lg font-semibold truncate text-foreground">{repo.name}</h3>
      
      {repo.description && (
        <p className="text-sm text-muted-foreground mt-2 flex-grow line-clamp-2">
          {repo.description}
        </p>
      )}
      
      <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center justify-end space-x-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className="w-3 h-3 mr-1" />
            <span>{repo.stargazers_count}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <GitFork className="w-3 h-3 mr-1" />
            <span>{repo.forks_count}</span>
          </div>
        </div>
      </div>
      
      {repo.language && (
        <div className="mt-3 flex items-center">
          <span className={cn("w-3 h-3 rounded-full mr-2", languageColor)}></span>
          <span className="text-xs text-muted-foreground">{repo.language}</span>
        </div>
      )}
    </Link>
  );
};

export default RepositoryCard;
