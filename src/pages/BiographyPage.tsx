import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SimilarProfiles from "@/components/SimilarProfiles";
import { Bot, PenLine, Info } from "lucide-react";

/* ---------------- TYPES ---------------- */

type ProfileData = {
  id: number;
  biography: string;
  predicted_profession: string;
  skill_domain: string;
  experience_level: number;
  biography_length: string;
};

/* ---------------- COMPONENT ---------------- */

const BiographyPage = () => {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Biography" },
  ];

  /* ---- Load biography from JSON ---- */
  useEffect(() => {
    fetch("/profession_predictions.json")
      .then((res) => res.json())
      .then((data: ProfileData[]) => {
        const found = data.find((item) => item.id === Number(id));
        setProfile(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-6">Loading biography...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-6">Biography not found.</p>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb aligned with Home/Search */}
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-4" />

        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {/* Page Header */}
          <div className="bg-secondary/50 px-6 py-3 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">
              Biography {profile.id + 1}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ---------------- LEFT: BIOGRAPHY ---------------- */}
              <div className="bg-card rounded-xl border border-border p-6">

                {/* 🔹 3.1 KEY SIGNALS SUMMARY */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <span className="bg-secondary px-3 py-1 rounded-full">
                    🎓 Skill Domain: <strong>{profile.skill_domain}</strong>
                  </span>
                  <span className="bg-secondary px-3 py-1 rounded-full">
                    📊 Experience Level: <strong>High</strong>
                  </span>
                  <span className="bg-secondary px-3 py-1 rounded-full">
                    📄 Biography Length: <strong>{profile.biography_length}</strong>
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-4">
                  Biography Details
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {profile.biography}
                </p>
              </div>

              {/* ---------------- RIGHT: RECOMMENDATION MODES ---------------- */}
              <div className="bg-card rounded-xl border border-border p-6 flex flex-col">

                <div className="flex items-center justify-center gap-2 mb-4">
                  <h3 className="font-semibold text-foreground">
                    Select Recommendation Mode
                  </h3>

                  {/* 🔹 3.3 TOOLTIP */}
                  <div className="group relative cursor-pointer">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <div className="absolute z-10 hidden group-hover:block bg-card border border-border text-xs text-muted-foreground p-3 rounded-lg w-64 -left-28 top-6 shadow-md">
                      Different recommendation modes help compare AI judgment
                      with human reasoning for better decision-making.
                    </div>
                  </div>
                </div>

                {/* 🔹 3.2 MICROCOPY */}
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Choose how you want the profession recommendation to be made.
                </p>

                <div className="space-y-3">
                  <Link
                    to={`/recommendations/${profile.id}?tab=ai`}
                    className="w-full flex flex-col items-center justify-center gap-1 py-4 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                  >
                    <div className="flex items-center gap-2">
                      AI Assisted Recommendations
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-xs opacity-90">
                      Based on trained model patterns
                    </span>
                  </Link>

                  <Link
                    to={`/recommendations/${profile.id}?tab=manual`}
                    className="w-full flex flex-col items-center justify-center gap-1 py-4 px-4 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted transition"
                  >
                    <div className="flex items-center gap-2">
                      Manual Recommendations
                      <PenLine className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Based on your own interpretation
                    </span>
                  </Link>
                </div>

                <div className="mt-auto pt-8">
                  <SimilarProfiles />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BiographyPage;
