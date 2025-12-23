import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SimilarProfiles from "@/components/SimilarProfiles";
import { Bot, PenLine } from "lucide-react";

/* ---------------- TYPES ---------------- */

type ProfileData = {
  id: number;
  biography: string;
  predicted_profession: string;
  reason: string;
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
      .catch((err) => {
        console.error("Failed to load biography", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ---- Loading / Error ---- */
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
      <Breadcrumb items={breadcrumbItems} />

      <main className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="bg-secondary/50 px-6 py-3 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">
              Biography {profile.id + 1}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT: Biography */}
              <div className="bg-card rounded-xl border border-border p-6 min-h-[300px]">
                <h3 className="font-semibold text-foreground mb-4">
                  Biography Details
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {profile.biography}
                </p>
              </div>

              {/* RIGHT: Recommendation Mode */}
              <div className="bg-card rounded-xl border border-border p-6 flex flex-col">
                <h3 className="text-center font-semibold text-foreground mb-6">
                  Select Recommendation Mode
                </h3>

                <div className="space-y-3">
                  <Link
                    to={`/recommendations/${profile.id}?tab=ai`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
                  >
                    AI Assisted Recommendations
                    <Bot className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/recommendations/${profile.id}?tab=manual`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted"
                  >
                    Manual Recommendations
                    <PenLine className="w-4 h-4" />
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
