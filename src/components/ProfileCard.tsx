
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Link2, Users, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/services/github";

interface ProfileCardProps {
  profile: UserProfile;
  className?: string;
}

const ProfileCard = ({ profile, className }: ProfileCardProps) => {
  const joinDate = useMemo(() => {
    return format(new Date(profile.created_at), "MMMM yyyy");
  }, [profile.created_at]);

  return (
    <div className={cn("glass-card animate-fade-in", className)}>
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-shrink-0">
          <img
            src={profile.avatar_url}
            alt={`${profile.login}'s avatar`}
            className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-md animate-fade-in"
            loading="lazy"
          />
        </div>
        
        <div className="flex-grow space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.name || profile.login}</h1>
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary hover:underline flex items-center mt-1"
            >
              @{profile.login}
            </a>
          </div>
          
          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
            {profile.company && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{profile.company}</span>
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile.blog && (
              <div className="flex items-center">
                <Link2 className="w-4 h-4 mr-1" />
                <a 
                  href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {profile.blog}
                </a>
              </div>
            )}
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-background/60 p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Repositories</p>
              <p className="text-xl font-semibold">{profile.public_repos}</p>
            </div>
            
            <div className="bg-background/60 p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Followers</p>
              <p className="text-xl font-semibold">{profile.followers}</p>
            </div>
            
            <div className="bg-background/60 p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Following</p>
              <p className="text-xl font-semibold">{profile.following}</p>
            </div>
            
            <div className="bg-background/60 p-3 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Gists</p>
              <p className="text-xl font-semibold">{profile.public_gists}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
