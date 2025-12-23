interface SkillIconProps {
  name: string;
  icon: React.ReactNode;
  color?: string;
}

const SkillIcon = ({ name, icon, color = "primary" }: SkillIconProps) => {
  return (
    <div className="skill-icon-wrapper">
      <div className="skill-icon bg-card">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground text-center">{name}</span>
    </div>
  );
};

export default SkillIcon;
