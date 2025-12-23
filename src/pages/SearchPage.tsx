import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FilterChip from "@/components/FilterChip";
import ProfileCard from "@/components/ProfileCard";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft } from "lucide-react";

/* ---------------- TYPES ---------------- */

type ProfileData = {
  id: number;
  biography: string;
  predicted_label: number;
  predicted_profession: string;
  reason: string;
};

/* ---------------- CONSTANTS ---------------- */

const professionalScores = ["4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "5.0"];
const services = ["Name", "Name", "Name", "Name", "Name", "Name", "Name", "Name"];
const responseTimes = ["1 hr", "2 hr", "3 hr", "6 hr", "8 hr", "12 hr", "18 hr", "24 hr"];

const profileColors = ["cyan", "yellow", "teal", "cyan", "pink", "teal"] as const;

/* ---------------- COMPONENT ---------------- */

const SearchPage = () => {
  const navigate = useNavigate();

  /* ---- Filters ---- */
  const [budget, setBudget] = useState([50]);
  const [activeScores, setActiveScores] = useState<string[]>(["4.5"]);
  const [activeServices, setActiveServices] = useState<string[]>(["Name"]);
  const [activeResponseTimes, setActiveResponseTimes] = useState<string[]>(["2 hr", "6 hr", "24 hr"]);

  /* ---- Profiles ---- */
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  /* ---- Load JSON ---- */
  useEffect(() => {
    fetch("/profession_predictions.json")
      .then((res) => res.json())
      .then((data: ProfileData[]) => setProfiles(data))
      .catch((err) => console.error("Failed to load profiles", err))
      .finally(() => setLoadingProfiles(false));
  }, []);

  /* ---- Filter Toggle ---- */
  const toggleFilter = (
    value: string,
    activeList: string[],
    setActiveList: (list: string[]) => void
  ) => {
    if (activeList.includes(value)) {
      setActiveList(activeList.filter((v) => v !== value));
    } else {
      setActiveList([...activeList, value]);
    }
  };

  /* ---- Navigate to Biography Page ---- */
  const openBiography = (profile: ProfileData) => {
    navigate(`/biography/${profile.id}`, {
      state: profile, // 👈 PASS DATA HERE
    });
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">Home</p>

        <div className="bg-card rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* FILTER SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-xl p-4">
                <h2 className="text-lg font-bold text-foreground mb-4">SEARCH</h2>

                <div className="bg-card rounded-lg p-4 space-y-6">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Filter to Enhance AI
                      </p>
                      <p className="text-xs text-muted-foreground">
                        search Based Results
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Budget
                    </label>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Professional Score:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {professionalScores.map((score) => (
                        <FilterChip
                          key={score}
                          label={score}
                          active={activeScores.includes(score)}
                          onClick={() =>
                            toggleFilter(score, activeScores, setActiveScores)
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Services:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {services.map((service, idx) => (
                        <FilterChip
                          key={idx}
                          label={service}
                          active={activeServices.includes(service)}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Punctuality/Response Rate:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {responseTimes.map((time) => (
                        <FilterChip
                          key={time}
                          label={time}
                          active={activeResponseTimes.includes(time)}
                          onClick={() =>
                            toggleFilter(time, activeResponseTimes, setActiveResponseTimes)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PROFILE GRID */}
            <div className="lg:col-span-3">
              {loadingProfiles ? (
                <p>Loading profiles...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map((profile, index) => (
                    <ProfileCard
                      key={profile.id}
                      id={profile.id.toString()}
                      name={`Biography ${profile.id + 1}`}
                      color={profileColors[index % profileColors.length]}
                      onClick={() => openBiography(profile)} // 👈 CLICK HANDLER
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
