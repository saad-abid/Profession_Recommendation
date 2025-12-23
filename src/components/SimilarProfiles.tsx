import ProfileAvatar from "./ProfileAvatar";

const profiles = [
  { name: "Alex", color: "yellow" as const, label: "Designer" },
  { name: "Sarah", color: "pink" as const, label: "Developer" },
  { name: "Mike", color: "cyan" as const, label: "Manager" },
  { name: "Emma", color: "teal" as const, label: "Analyst" },
];

const SimilarProfiles = () => {
  return (
    <div className="text-center">
      <h4 className="text-sm font-medium text-foreground mb-4">Similar Profiles</h4>
      <div className="flex justify-center gap-3">
        {profiles.map((profile, index) => (
          <ProfileAvatar 
            key={index}
            name={profile.name}
            color={profile.color}
            size="sm"
            showLabel
            label={profile.label}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarProfiles;
