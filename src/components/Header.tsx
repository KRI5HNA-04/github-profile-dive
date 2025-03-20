
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Github, Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/profile/${searchQuery}`;
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openAuthModal = (view: "login" | "signup") => {
    setAuthView(view);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
          scrolled ? "glass shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
            onClick={closeMobileMenu}
          >
            <Github className="w-6 h-6" />
            <span className="animate-fade-in">Insights Explorer</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search GitHub username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-full bg-background/50 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openAuthModal("login")}
                className="ml-2"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                size="sm" 
                onClick={() => openAuthModal("signup")}
              >
                Sign up
              </Button>
            </div>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass py-4 px-6 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search GitHub username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-full bg-background/50 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  openAuthModal("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  openAuthModal("signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Sign up
              </Button>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultView={authView} 
      />
    </>
  );
};

export default Header;
