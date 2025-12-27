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
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import jsPDF from "jspdf";

/* ---------------- TYPES ---------------- */

type ProfileData = {
  id: number;
  biography: string;
  predicted_profession: string;
  reason: string;
  confidence_score: number;
};

/* ---------------- COMPONENT ---------------- */

const RecommendationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "ai";

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- Manual Recommendation ---- */
  const [manualProfession, setManualProfession] = useState("");
  const [manualConfidence, setManualConfidence] = useState<
    "low" | "moderate" | "high" | null
  >(null);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Biography", href: `/biography/${id}` },
    { label: tab === "ai" ? "AI Recommendation" : "Manual Recommendation" },
  ];

  /* ---- Load JSON ---- */
  useEffect(() => {
    fetch("/profession_predictions.json")
      .then((res) => res.json())
      .then((data: ProfileData[]) => {
        const found = data.find((item) => item.id === Number(id));
        setProfile(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------------- PDF GENERATION ---------------- */

 const generatePdf = () => {
  if (!profile) return;

  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  const confidenceText =
    tab === "ai"
      ? "High"
      : manualConfidence === "high"
      ? "High"
      : manualConfidence === "moderate"
      ? "Moderate"
      : "Low";

  let y = 20;

  /* ---------- TITLE ---------- */
  doc.setFontSize(16);
  doc.text("Biography Report", 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${timestamp}`, 14, y);

  /* ---------- BIOGRAPHY ID ---------- */
  y += 12;
  doc.setFontSize(12);
  doc.text(`Biography ID: ${profile.id + 1}`, 14, y);

  /* ---------- BIOGRAPHY ---------- */
  y += 10;
  doc.setFontSize(12);
  doc.text("Biography", 14, y);

  y += 2;
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);

  y += 6;
  doc.setFontSize(11);
  const bioText = doc.splitTextToSize(profile.biography, 180);
  doc.text(bioText, 14, y);

  y += bioText.length * 6 + 6;

  /* ---------- RECOMMENDATION SUMMARY ---------- */
  doc.setFontSize(12);
  doc.text("Recommendation Summary", 14, y);

  y += 2;
  doc.line(14, y, 196, y);

  y += 6;
  doc.setFontSize(11);
  doc.text(`Type: ${tab === "ai" ? "AI Assisted" : "Manual"}`, 14, y);

  y += 6;
  doc.text(
    `Profession: ${
      tab === "ai" ? profile.predicted_profession : manualProfession
    }`,
    14,
    y
  );

  y += 6;
  const aiConfidenceDisplay =
  tab === "ai"
    ? `${confidenceText} (${profile.confidence_score}%)`
    : confidenceText;

  doc.text(`Confidence: ${aiConfidenceDisplay}`, 14, y);


  /* ---------- EXPLANATION ---------- */
  y += 10;
  doc.setFontSize(12);
  doc.text("Explanation", 14, y);

  y += 2;
  doc.line(14, y, 196, y);

  y += 6;
  doc.setFontSize(11);
  const explanationText =
    tab === "ai"
      ? profile.reason
      : "This recommendation was made manually based on user interpretation of the biography.";

  doc.text(doc.splitTextToSize(explanationText, 180), 14, y);

  /* ---------- SAVE ---------- */
  doc.save(`Biography_${profile.id + 1}_Report.pdf`);
};

  /* ---------------- RENDER ---------------- */

  if (loading) return <p className="p-6">Loading recommendation...</p>;
  if (!profile) return <p className="p-6">Recommendation not found.</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-4" />

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
            {/* MAIN CARD */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Recommended Profession
                  </h3>

                  {tab === "ai" ? (
                    <>
                      <p className="text-muted-foreground mb-4 capitalize">
                        {profile.predicted_profession}
                      </p>

                      <h4 className="text-sm font-semibold uppercase mb-2">
                        Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {profile.reason}
                      </p>

                      <p className="text-xs text-muted-foreground italic">
                        AI confidence reflects model certainty, not correctness.
                      </p>
                    </>
                  ) : (
                    <>
                      <Select
                        value={manualProfession}
                        onValueChange={setManualProfession}
                      >
                        <SelectTrigger className="w-64 mb-4">
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

                      {manualProfession && (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">
                            Manually selected profession:{" "}
                            <strong>{manualProfession}</strong>
                          </p>

                          <h4 className="text-sm font-semibold mb-2">
                            How confident are you?
                          </h4>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setManualConfidence("low")}
                              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                                manualConfidence === "low"
                                  ? "bg-red-100 border-red-400"
                                  : "hover:bg-secondary"
                              }`}
                              title="Uncertain, weak match"
                            >
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              Low
                            </button>

                            <button
                              onClick={() => setManualConfidence("moderate")}
                              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                                manualConfidence === "moderate"
                                  ? "bg-yellow-100 border-yellow-400"
                                  : "hover:bg-secondary"
                              }`}
                              title="Some evidence in biography"
                            >
                              <HelpCircle className="w-4 h-4 text-yellow-500" />
                              Moderate
                            </button>

                            <button
                              onClick={() => setManualConfidence("high")}
                              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                                manualConfidence === "high"
                                  ? "bg-green-100 border-green-400"
                                  : "hover:bg-secondary"
                              }`}
                              title="Strong alignment with profession"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              High
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-center">
                  {tab === "ai" ? (
                    <ConfidenceScore score={profile.confidence_score} />
                  ) : manualConfidence ? (
                    <ConfidenceScore
                      score={
                        manualConfidence === "low"
                          ? 33
                          : manualConfidence === "moderate"
                          ? 66
                          : 100
                      }
                      label="User Confidence"
                    />
                  ) : (
                    <ConfidenceScore score={0} label="Select Confidence" />
                  )}
                </div>
              </div>
            </div>

            {/* PDF BUTTON */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={generatePdf}
                disabled={tab === "manual" && !manualConfidence}
                className={`py-3 px-8 rounded-lg font-medium ${
                  tab === "manual" && !manualConfidence
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                Generate PDF
              </button>

              {tab === "manual" && !manualConfidence && (
                <p className="text-xs text-muted-foreground">
                  Please select confidence level to continue
                </p>
              )}
            </div>

            <div className="mt-10">
              <SimilarProfiles />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
