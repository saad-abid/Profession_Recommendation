interface ProfileAvatarProps {
  name: string;
  image?: string;
  color: 'cyan' | 'yellow' | 'pink' | 'teal' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const colorClasses = {
  cyan: 'bg-avatar-cyan',
  yellow: 'bg-avatar-yellow',
  pink: 'bg-avatar-pink',
  teal: 'bg-avatar-teal',
  orange: 'bg-avatar-orange',
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
};

const ProfileAvatar = ({ 
  name, 
  image, 
  color, 
  size = 'md', 
  showLabel = false,
  label 
}: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {showLabel && label && (
        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
          {label}
        </span>
      )}
      <div className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center`}>
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-primary-foreground font-semibold text-lg">
            {name.charAt(0)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
