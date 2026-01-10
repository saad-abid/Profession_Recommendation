import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FilterChip from "@/components/FilterChip";
import ProfileCard from "@/components/ProfileCard";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, XCircle } from "lucide-react";

/* ---------------- TYPES ---------------- */

type ProfileData = {
  id: number;
  biography: string;
  predicted_label: number;
  predicted_profession: string;
  reason: string;
  skill_domain: string;
  experience_level: number;
  confidence_score: number;
  ai_confidence: string;
  biography_length: string;
};

/* ---------------- CONSTANTS ---------------- */

const ITEMS_PER_PAGE = 10;

const skillDomains = ["Education", "Arts", "Business", "Design", "Science", "Healthcare"];
const aiConfidenceLevels = ["High Confidence", "Medium Confidence", "Low Confidence"];
const biographyLengths = ["Short Biography", "Medium Biography", "Detailed Biography"];

const profileColors = ["cyan", "yellow", "teal", "cyan", "pink", "teal"] as const;

/* ---------------- COMPONENT ---------------- */

const SearchPage = () => {
  const navigate = useNavigate();

  /* ---- Search & Filters ---- */
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceRange, setExperienceRange] = useState([0]);
  const [activeDomains, setActiveDomains] = useState<string[]>([]);
  const [activeConfidence, setActiveConfidence] = useState<string[]>([]);
  const [activeBioLengths, setActiveBioLengths] = useState<string[]>([]);

  /* ---- Pagination ---- */
  const [currentPage, setCurrentPage] = useState(1);

  /* ---- Profiles ---- */
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  /* ---- Load JSON ---- */
  useEffect(() => {
    setLoadingProfiles(true);
    fetch("/profession_predictions.json")
      .then((res) => res.json())
      .then((data: ProfileData[]) => setProfiles(data))
      .catch(() => setProfiles([]))
      .finally(() => setLoadingProfiles(false));
  }, []);

  /* ---- Reset page on filter/search change ---- */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, experienceRange, activeDomains, activeConfidence, activeBioLengths]);

  /* ---- Toggle Filter ---- */
  const toggleFilter = (
    value: string,
    activeList: string[],
    setActiveList: (list: string[]) => void
  ) => {
    setActiveList(
      activeList.includes(value)
        ? activeList.filter((v) => v !== value)
        : [...activeList, value]
    );
  };

  /* ---- Remove chip by category (prevents removing from wrong list) ---- */
  const removeChip = (chip: { type: "domain" | "confidence" | "bio"; value: string }) => {
    if (chip.type === "domain") setActiveDomains((prev) => prev.filter((v) => v !== chip.value));
    if (chip.type === "confidence")
      setActiveConfidence((prev) => prev.filter((v) => v !== chip.value));
    if (chip.type === "bio") setActiveBioLengths((prev) => prev.filter((v) => v !== chip.value));
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setExperienceRange([0]);
    setActiveDomains([]);
    setActiveConfidence([]);
    setActiveBioLengths([]);
  };

  /* ---- Apply Search + Filters ---- */
  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return profiles.filter((profile) => {
      const bioText = profile.biography.toLowerCase();

      const matchesSearch = q === "" || bioText.includes(q);
      const matchesDomain = activeDomains.length === 0 || activeDomains.includes(profile.skill_domain);
      const matchesConfidence =
        activeConfidence.length === 0 || activeConfidence.includes(profile.ai_confidence);
      const matchesBioLength =
        activeBioLengths.length === 0 || activeBioLengths.includes(profile.biography_length);
      const matchesExperience = profile.experience_level >= experienceRange[0];

      return (
        matchesSearch &&
        matchesDomain &&
        matchesConfidence &&
        matchesBioLength &&
        matchesExperience
      );
    });
  }, [profiles, searchQuery, activeDomains, activeConfidence, activeBioLengths, experienceRange]);

  /* ---- Pagination ---- */
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* ---- Active Chips (grouped) ---- */
  const activeChips = useMemo(() => {
    const chips: { type: "domain" | "confidence" | "bio"; value: string }[] = [];
    activeDomains.forEach((v) => chips.push({ type: "domain", value: v }));
    activeConfidence.forEach((v) => chips.push({ type: "confidence", value: v }));
    activeBioLengths.forEach((v) => chips.push({ type: "bio", value: v }));
    return chips;
  }, [activeDomains, activeConfidence, activeBioLengths]);

  const hasAnyFilter =
    searchQuery.trim() !== "" ||
    experienceRange[0] > 0 ||
    activeDomains.length > 0 ||
    activeConfidence.length > 0 ||
    activeBioLengths.length > 0;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">Home</p>

        <div className="bg-card rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ---------------- FILTER SIDEBAR ---------------- */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-xl p-4">
                <h2 className="text-lg font-bold mb-4">SEARCH</h2>

                <div className="bg-card rounded-lg p-4 space-y-6">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">Filter Biographies</p>
                      <p className="text-xs text-muted-foreground">Explore before prediction</p>
                    </div>
                  </div>

                  {/* Keyword */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Biography</label>
                    <input
                      type="text"
                      placeholder="Search keywords (e.g. doctor, music)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium block">Minimum Experience Level</label>
                      <span className="text-xs text-muted-foreground">{experienceRange[0]}</span>
                    </div>
                    <Slider
                      value={experienceRange}
                      onValueChange={setExperienceRange}
                      max={100}
                      step={5}
                    />
                  </div>

                  {/* Skill Domain */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skill Domain</label>
                    <div className="grid grid-cols-2 gap-2">
                      {skillDomains.map((domain) => (
                        <FilterChip
                          key={domain}
                          label={domain}
                          active={activeDomains.includes(domain)}
                          onClick={() => toggleFilter(domain, activeDomains, setActiveDomains)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* AI Confidence */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Confidence</label>
                    <div className="grid grid-cols-2 gap-2">
                      {aiConfidenceLevels.map((level) => (
                        <FilterChip
                          key={level}
                          label={level}
                          active={activeConfidence.includes(level)}
                          onClick={() => toggleFilter(level, activeConfidence, setActiveConfidence)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Biography Length */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Biography Detail</label>
                    <div className="grid grid-cols-2 gap-2">
                      {biographyLengths.map((length) => (
                        <FilterChip
                          key={length}
                          label={length}
                          active={activeBioLengths.includes(length)}
                          onClick={() => toggleFilter(length, activeBioLengths, setActiveBioLengths)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    onClick={resetAllFilters}
                    className="w-full py-2 rounded-md text-sm bg-secondary hover:bg-muted"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------- PROFILE GRID ---------------- */}
            <div className="lg:col-span-3">
              {/* Filter chips + counts */}
              {!loadingProfiles && (
                <>
                  {/* Chips row */}
                  {hasAnyFilter && (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {/* Search chip */}
                      {searchQuery.trim() !== "" && (
                        <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-xs">
                          Search: “{searchQuery.trim()}”
                          <XCircle
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => setSearchQuery("")}
                          />
                        </span>
                      )}

                      {/* Experience chip */}
                      {experienceRange[0] > 0 && (
                        <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-xs">
                          Min exp: {experienceRange[0]}
                          <XCircle
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => setExperienceRange([0])}
                          />
                        </span>
                      )}

                      {/* Grouped chips */}
                      {activeChips.map((chip) => (
                        <span
                          key={`${chip.type}-${chip.value}`}
                          className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-xs"
                        >
                          {chip.value}
                          <XCircle
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeChip(chip)}
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Result count */}
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {filteredProfiles.length} of {profiles.length} biographies
                  </p>
                </>
              )}

              {loadingProfiles ? (
                <p>Loading profiles...</p>
              ) : paginatedProfiles.length === 0 ? (
                /* Empty State */
                <div className="text-center py-16">
                  <p className="text-lg font-medium mb-2">No biographies match your filters</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting or clearing your filters to see more results.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedProfiles.map((profile, index) => (
                      <div
                        key={profile.id}
                        onClick={() => navigate(`/biography/${profile.id}`)}
                        className="cursor-pointer hover:shadow-md transition"
                      >
                        <ProfileCard
                          id={profile.id.toString()}
                          name={`Biography ${profile.id + 1}`}
                          color={profileColors[index % profileColors.length]}
                          skillDomain={profile.skill_domain}
                          confidence={profile.ai_confidence}
                          preview={profile.biography.slice(0, 120) + "..."}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-md text-sm ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
