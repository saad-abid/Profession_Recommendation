import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ConfidenceScore from "@/components/ConfidenceScore";
import SimilarProfiles from "@/components/SimilarProfiles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileData = {
  id: number;
  predicted_profession: string;
  reason: string;
};

const RecommendationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "ai";

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Manual recommendation state
  const [manualProfession, setManualProfession] = useState<string>("");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Biography", href: `/biography/${id}` },
    { label: tab === "ai" ? "AI Recommendation" : "Manual Recommendation" },
  ];

  /* ---- Load from JSON ---- */
  useEffect(() => {
    fetch("/profession_predictions.json")
      .then((res) => res.json())
      .then((data: ProfileData[]) => {
        const found = data.find((item) => item.id === Number(id));
        setProfile(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const generatePdf = () => {
    alert("PDF generated successfully!");
  };

  if (loading) return <p className="p-6">Loading recommendation...</p>;
  if (!profile) return <p className="p-6">Recommendation not found.</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <main className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-border">
            <div className="px-6 py-3 text-sm font-medium bg-secondary/50 border-r border-border">
              Biography {profile.id + 1}
            </div>

            <Link
              to={`/recommendations/${profile.id}?tab=ai`}
              className={`flex-1 px-6 py-3 text-sm font-medium text-center ${
                tab === "ai"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              Automatic Recommendations
            </Link>

            <Link
              to={`/recommendations/${profile.id}?tab=manual`}
              className={`flex-1 px-6 py-3 text-sm font-medium text-center ${
                tab === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              Manual Recommendations
            </Link>
          </div>

          <div className="p-6">
            {tab === "ai" ? (
              <>
                {/* AI Recommendation */}
                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-1">
                        Recommended Profession
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {profile.predicted_profession}
                      </p>

                      <h4 className="text-sm font-semibold uppercase tracking-wide mb-2">
                        Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.reason}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <ConfidenceScore score={90} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Manual Recommendation */}
                <div className="mb-6 flex justify-center">
                  <Select
                    value={manualProfession}
                    onValueChange={setManualProfession}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Architect">Architect</SelectItem>
                      <SelectItem value="Chiropractor">Chiropractor</SelectItem>
                      <SelectItem value="Comedian">Comedian</SelectItem>
                      <SelectItem value="Composer">Composer</SelectItem>
                      <SelectItem value="Dentist">Dentist</SelectItem>
                      <SelectItem value="Dietitian">Dietitian</SelectItem>
                      <SelectItem value="Filmmaker">Filmmaker</SelectItem>
                      <SelectItem value="Journalist">Journalist</SelectItem>
                      <SelectItem value="Painter">Painter</SelectItem>
                      <SelectItem value="Paralegal">Paralegal</SelectItem>
                      <SelectItem value="Model">Model</SelectItem>
                      <SelectItem value="Software engineer">Software engineer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {manualProfession && (
                  <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-1">
                      Recommended Profession
                    </h3>
                    <p className="text-muted-foreground">
                      {manualProfession}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Generate PDF */}
            <div className="flex justify-center mt-6">
              <button
                onClick={generatePdf}
                className="py-3 px-8 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90"
              >
                Generate PDF
              </button>
            </div>

            <div className="mt-8">
              <SimilarProfiles />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
