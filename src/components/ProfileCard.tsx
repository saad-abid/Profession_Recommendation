type ProfileCardProps = {
  id: string;
  name: string;
  color: "cyan" | "yellow" | "teal" | "pink";
  skillDomain?: string;
  confidence?: string;
  preview?: string;
  onClick?: () => void;
};

const colorMap = {
  cyan: "bg-cyan-400",
  yellow: "bg-yellow-400",
  teal: "bg-teal-400",
  pink: "bg-pink-400",
};

const ProfileCard = ({
  name,
  color,
  skillDomain,
  confidence,
  preview,
  onClick,
}: ProfileCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${colorMap[color]}`}
        >
          B
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">Biography Profile</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skillDomain && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-foreground">
            {skillDomain}
          </span>
        )}
        {confidence && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
            {confidence}
          </span>
        )}
      </div>

      {/* Biography Preview */}
      {preview && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {preview}
        </p>
      )}

      {/* Footer */}
      <p className="mt-4 text-xs text-primary font-medium">
        View Biography →
      </p>
    </div>
  );
};

export default ProfileCard;
