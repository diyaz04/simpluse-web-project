import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, Zap, CheckCircle2, AlertCircle, Loader2, DollarSign, ListChecks } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";

interface EstimationResult {
  complexity: string;
  features: string[];
  estimatedPriceRange: string;
  reasoning: string;
}

export default function AIEstimator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Scrape the URL via our proxy server
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!scrapeRes.ok) {
        throw new Error("Gagal mengambil data website. Pastikan URL benar dan website bisa diakses.");
      }

      const scrapedData = await scrapeRes.json();

      // 2. Use Gemini to estimate
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Analisis konten website berikut dan berikan estimasi harga pengembangan website serupa dalam Rupiah (IDR).
        Gunakan data berikut:
        Judul: ${scrapedData.title}
        Deskripsi: ${scrapedData.description}
        Konten Teks (Potongan): ${scrapedData.bodyText}

        Berikan keluaran dalam format JSON dengan struktur:
        {
          "complexity": "Sederhana / Menengah / Kompleks",
          "features": ["Fitur 1", "Fitur 2", ...],
          "estimatedPriceRange": "Rp X - Rp Y",
          "reasoning": "Penjelasan singkat mengapa harganya sekian."
        }
      `;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              complexity: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedPriceRange: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["complexity", "features", "estimatedPriceRange", "reasoning"]
          }
        }
      });

      const estimation = JSON.parse(aiResponse.text || "{}");
      setResult(estimation);
    } catch (err: any) {
      console.error("Estimation failed:", err);
      setError(err.message || "Terjadi kesalahan saat memproses estimasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-estimator" className="py-24 bg-bg-dark border-y border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/20 text-brand-orange text-sm font-bold mb-6"
          >
            <Zap className="w-4 h-4" /> AI Powered Tool
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">AI <span className="gradient-text">Website Price</span> Estimator</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Punya referensi website orang lain? Tempelkan link-nya di sini, AI kami akan menganalisis fitur dan memberikan perkiraan harga untuk membuatnya untuk Anda.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="url"
                  placeholder="https://contoh-website.com"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-orange transition-colors"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button
                onClick={handleEstimate}
                disabled={loading || !url}
                className="gradient-bg text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analisis Sekarang
                  </>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-4"
                >
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
                      <div className="flex items-center gap-3 mb-4 text-brand-orange">
                        <DollarSign className="w-5 h-5" />
                        <h4 className="font-bold">Estimasi Harga</h4>
                      </div>
                      <p className="text-3xl font-display font-bold text-white mb-2">{result.estimatedPriceRange}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider">
                        Kompleksitas: {result.complexity}
                      </div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
                      <div className="flex items-center gap-3 mb-4 text-blue-400">
                        <ListChecks className="w-5 h-5" />
                        <h4 className="font-bold">Fitur Terdeteksi</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.features.map((feature, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-text-secondary flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
                    <h4 className="font-bold mb-3 flex items-center gap-3">
                      <div className="w-1.5 h-4 gradient-bg rounded-full" />
                      Analisis AI
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {result.reasoning}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-text-secondary text-center">
                      *Ini hanyalah estimasi awal berdasarkan analisis visual AI. Harga akhir tetap ditentukan melalui konsultasi detail.
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 font-bold text-brand-orange hover:underline"
                    >
                      Bicarakan detail proyek dengan kami <Zap className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
