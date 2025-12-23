interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const FilterChip = ({ label, active = false, onClick }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={active ? "filter-chip-active" : "filter-chip-default"}
    >
      {label}
    </button>
  );
};

export default FilterChip;
