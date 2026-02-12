"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    users: "",
    constraints: "",
    type: "Web App",
  });

  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [currentSpecId, setCurrentSpecId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  // Fetch last 5 specs
  const fetchHistory = async () => {
    const res = await fetch("/api/specs");
    const data = await res.json();
    if (data.success) {
      setHistory(data.specs);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultText("");
    setCurrentSpecId(null);

    if (!formData.title || !formData.goal) {
      setError("Title and Goal are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const formatted = formatPlanToText(data.data);

      setResultText(formatted);
      setCurrentSpecId(data.specId);

      await fetchHistory();

    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!currentSpecId) {
      alert("No spec selected.");
      return;
    }

    try {
      const res = await fetch("/api/update-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentSpecId,
          updatedContent: resultText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      alert("Changes saved successfully!");

      // Close editor
      setResultText("");
      setCurrentSpecId(null);

      await fetchHistory();

    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(resultText);
    alert("Copied to clipboard!");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([resultText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "feature-plan.md";
    a.click();

    URL.revokeObjectURL(url);
  };

  const formatPlanToText = (data: any) => {
    return `
# User Stories
${data.userStories.map((item: string) => "- " + item).join("\n")}

# Engineering Tasks

## Frontend
${data.engineeringTasks.frontend.map((item: string) => "- " + item).join("\n")}

## Backend
${data.engineeringTasks.backend.map((item: string) => "- " + item).join("\n")}

## Database
${data.engineeringTasks.database.map((item: string) => "- " + item).join("\n")}

## DevOps
${data.engineeringTasks.devops.map((item: string) => "- " + item).join("\n")}

# Risks and Unknowns
${data.risks.map((item: string) => "- " + item).join("\n")}

# Milestones
${data.milestones.map((item: string) => "- " + item).join("\n")}
`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tasks Generator
          </h1>
          <p className="text-gray-400 text-lg">Transform ideas into actionable engineering plans</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-blue-400">✨</span> Create New Specification
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feature Title *
              </label>
              <input
                name="title"
                placeholder="e.g., User Authentication System"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-600 p-3 rounded-lg bg-gray-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goal *
              </label>
              <textarea
                name="goal"
                placeholder="Describe the main objective and what you want to achieve..."
                value={formData.goal}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-600 p-3 rounded-lg bg-gray-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Users
                </label>
                <input
                  name="users"
                  placeholder="e.g., End users, Admins"
                  value={formData.users}
                  onChange={handleChange}
                  className="w-full border border-gray-600 p-3 rounded-lg bg-gray-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-600 p-3 rounded-lg bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>Internal Tool</option>
                  <option>SaaS Product</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Constraints
              </label>
              <input
                name="constraints"
                placeholder="e.g., Must be completed in 2 weeks, Budget limited"
                value={formData.constraints}
                onChange={handleChange}
                className="w-full border border-gray-600 p-3 rounded-lg bg-gray-900/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating Your Plan...
                </span>
              ) : (
                "🚀 Generate Plan"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}
        </div>

      {/* Editable Output */}
      {resultText && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-green-400">📝</span> Generated Plan
            </h2>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-gray-600"
              >
                <span>📋</span> Copy
              </button>
              <button
                onClick={downloadMarkdown}
                className="bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-gray-600"
              >
                <span>⬇️</span> Download
              </button>
            </div>
          </div>

          <textarea
            value={resultText}
            onChange={(e) => setResultText(e.target.value)}
            className="w-full h-96 border border-gray-600 p-4 rounded-lg bg-gray-900/70 text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            spellCheck={false}
          />

          <button
            onClick={handleSave}
            className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <span>💾</span> Save Changes
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-purple-400">📚</span> Recent Specifications
          </h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-700 p-5 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 transition-all hover:border-gray-600 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      <span>🕐</span>
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-blue-600 hover:to-purple-600 px-5 py-2.5 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(item.output_markdown);
                        const formatted = formatPlanToText(parsed);

                        setResultText(formatted);
                        setCurrentSpecId(item.id);
                      } catch {
                        // fallback if already plain text
                        setResultText(item.output_markdown);
                        setCurrentSpecId(item.id);
                      }
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
