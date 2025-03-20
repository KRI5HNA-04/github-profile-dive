
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Search, Code, GitBranch, Users, ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const exampleRepos = [
    { name: "react", owner: "facebook", stars: "209k", description: "A JavaScript library for building user interfaces" },
    { name: "vscode", owner: "microsoft", stars: "149k", description: "Visual Studio Code" },
    { name: "tensorflow", owner: "tensorflow", stars: "178k", description: "An open-source machine learning framework" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <div className="relative w-full bg-gradient-to-b from-primary/5 to-background pt-32 pb-20 px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20 pointer-events-none">
              <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="300" r="250" fill="url(#paint0_radial)"/>
                <defs>
                  <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 300) rotate(90) scale(300)">
                    <stop stopColor="var(--color-primary)"/>
                    <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 relative">
            <div className="animate-float mb-8 rounded-full bg-primary/10 p-4">
              <Github className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
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
                className="w-full px-6 py-4 pr-12 text-lg rounded-full glass shadow-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-md"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full aspect-square p-2"
                size="icon"
                disabled={!searchQuery.trim()}
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fade-in delay-200">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card flex flex-col items-center text-center p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Example Repositories Section */}
        <div className="py-20 px-6 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Popular Repositories</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Explore these popular repositories to see what our tool can do
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exampleRepos.map((repo, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground">{repo.owner}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/repository/${repo.owner}/${repo.name}`)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-10 border-t border-border/50 bg-background">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Github className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium">GitHub Insights Explorer</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} · All rights reserved
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
