
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Search, Code, GitBranch, Users } from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile/${searchQuery}`);
    }
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Profile Analysis",
      description: "Fetch complete GitHub profile details including repositories, followers, and contribution history.",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Repository Analysis",
      description: "Explore file structure, tech stack, and code complexity of any public repository.",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Codebase Exploration",
      description: "Browse core files, view code content and get auto-generated summaries.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div 
          className="w-full max-w-4xl mx-auto pt-20 flex flex-col items-center" 
        >
          <div className="animate-float mb-8">
            <Github className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 animate-fade-in">
            GitHub Insights Explorer
          </h1>
          
          <p className="text-xl text-center text-muted-foreground max-w-2xl mb-10 animate-fade-in delay-100">
            Discover in-depth analysis of any GitHub profile or repository with our powerful exploration tool.
          </p>
          
          <form 
            onSubmit={handleSearch} 
            className={cn(
              "relative w-full max-w-xl mb-16 transition-all duration-300 transform",
              isInputFocused ? "scale-105" : ""
            )}
          >
            <input
              type="text"
              placeholder="Enter a GitHub username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="w-full px-6 py-4 pr-12 text-lg rounded-full glass border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg"
            />
            <button 
              type="submit" 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
              disabled={!searchQuery.trim()}
            >
              <Search className="w-6 h-6" />
            </button>
          </form>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in delay-200">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card flex flex-col items-center text-center p-6"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Github className="w-5 h-5 mr-2 text-primary" />
            <span className="text-sm text-muted-foreground">GitHub Insights Explorer</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Explore GitHub with precision and elegance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
