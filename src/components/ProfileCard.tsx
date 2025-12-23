import { Link } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

interface ProfileCardProps {
  id: string;
  name: string;
  subtitle?: string;
  color: 'cyan' | 'yellow' | 'pink' | 'teal' | 'orange';
}

const ProfileCard = ({ id, name, subtitle = "Info details", color }: ProfileCardProps) => {
  return (
    <Link to={`/biography/${id}`} className="profile-card block">
      <div className="bg-secondary/50 px-4 py-2">
        <h3 className="text-sm font-medium text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="p-6 flex justify-center">
        <ProfileAvatar name={name} color={color} size="lg" />
      </div>
    </Link>
  );
};

export default ProfileCard;
