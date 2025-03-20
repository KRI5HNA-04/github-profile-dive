
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Github, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
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

        <div className="hidden md:flex items-center space-x-8">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder="Search GitHub username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
              className="w-full px-4 py-2 pr-10 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
