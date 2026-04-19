import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useApp } from "../AppContext";
import { motion } from "motion/react";
import { Save, LogOut, Plus, Trash2, LayoutDashboard, Calculator, FileEdit } from "lucide-react";
import { auth } from "../firebase";
import PriceCalculator from "./PriceCalculator";

export default function Dashboard() {
  const { content } = useApp();
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "calculator">("content");

  useEffect(() => {
    if (content) {
      setFormData(content);
    } else {
      // Fallback default data if Firestore is empty
      setFormData({
        hero: {
          title: "Simpluse Web Project",
          subtitle: "Solusi Website Profesional, Modern, dan Sesuai Kebutuhan Anda. Kami membantu bisnis Anda tumbuh dengan teknologi web terkini."
        },
        about: {
          title: "Membangun Masa Depan Digital dengan Presisi",
          description: "Simpluse Web Project adalah layanan pembuatan website dan aplikasi berbasis web dengan desain modern dan performa cepat. Kami berfokus pada pengalaman pengguna dan skalabilitas bisnis Anda."
        },
        portfolio: [
          {
            title: "Khidmah Abadi",
            description: "Platform layanan masyarakat dengan fitur manajemen kegiatan dan informasi terpadu.",
            tech: ["Next.js", "Tailwind CSS", "Firebase"],
            image: "https://lh3.googleusercontent.com/d/1ca_gOp-q18Aqc99JCqlAtuv_XtkuSCls",
            link: "https://khidmah-abadi.vercel.app/",
          },
          {
            title: "CAEM System",
            description: "Sistem manajemen operasional cerdas untuk efisiensi alur kerja perusahaan.",
            tech: ["React", "Node.js", "PostgreSQL"],
            image: "https://lh3.googleusercontent.com/d/1FN_BT50W5VS6MERj_9P6oNWrQUG0g8hV",
            link: "https://caem-system.vercel.app/",
          },
          {
            title: "SIMAK An-Sor Tasik",
            description: "Sistem Informasi Akademik terintegrasi untuk pengelolaan data pendidikan dan santri.",
            tech: ["React", "Express", "MongoDB"],
            image: "https://lh3.googleusercontent.com/d/1FqF_GwJSm9s4g19zQxfU13v14VpMgDFh",
            link: "https://simakansortasik.vercel.app/",
          },
        ],
        services: [
          { title: "Company Profile", description: "Website representasi bisnis yang elegan dan profesional.", iconName: "Layout" },
          { title: "Sekolah & Pesantren", description: "Sistem informasi dan portal edukasi modern.", iconName: "School" },
          { title: "Landing Page", description: "Halaman promosi dengan konversi tinggi.", iconName: "Rocket" },
          { title: "Custom Web App", description: "Aplikasi web sesuai kebutuhan bisnis spesifik.", iconName: "Settings" },
          { title: "Dashboard Admin", description: "Sistem manajemen data yang intuitif.", iconName: "BarChart3" },
          { title: "Maintenance", description: "Pemeliharaan rutin dan optimasi performa.", iconName: "ShieldCheck" },
        ],
        pricing: [
          { name: "Basic Package", price: "500K - 1M", features: ["1-3 Halaman", "Desain Simpel", "Mobile Friendly", "Basic SEO", "1x Revisi"], recommended: false },
          { name: "Standard Package", price: "1.5M - 3M", features: ["3-7 Halaman", "Desain Custom", "SEO Basic", "Admin Sederhana", "3x Revisi", "Free Hosting 1th"], recommended: true },
          { name: "Premium Package", price: "3.5M - 10M+", features: ["Full Custom", "Login User", "Dashboard Admin", "Database Integration", "Unlimited Revisi", "Premium Support"], recommended: false },
        ],
        testimonials: [
          { name: "Budi Santoso", role: "CEO of TechCorp", text: "Simpluse benar-benar mengerti apa yang kami butuhkan. Website kami sekarang jauh lebih cepat dan modern.", avatar: "https://picsum.photos/seed/person1/100/100" },
          { name: "Siti Aminah", role: "Owner of Bloom Florist", text: "Landing page yang dibuat sangat membantu meningkatkan penjualan kami hingga 40% dalam sebulan!", avatar: "https://picsum.photos/seed/person2/100/100" },
          { name: "Andi Wijaya", role: "Marketing Manager", text: "Kerja cepat, rapi, dan komunikatif. Sangat direkomendasikan untuk jasa web developer.", avatar: "https://picsum.photos/seed/person3/100/100" },
        ],
        calculator: {
          categories: [
            {
              id: "cat-1",
              name: "Landasan Utama (Dasar)",
              features: [
                { id: "f-1", name: "Landas Tunggal (1 Halaman)", normalPrice: 750000, promoPrice: 500000, iconName: "Monitor" },
                { id: "f-2", name: "Struktur Multi (3-5 Halaman)", normalPrice: 1500000, promoPrice: 1250000, iconName: "Globe" },
                { id: "f-3", name: "Arsitektur Kompleks (5-10 Halaman)", normalPrice: 3000000, promoPrice: 2500000, iconName: "Globe" },
              ]
            },
            {
              id: "cat-2",
              name: "Fitur Fungsional",
              features: [
                { id: "f-4", name: "Sistem Login & Register", normalPrice: 1200000, promoPrice: 1000000, iconName: "Lock" },
                { id: "f-5", name: "Dashboard Admin", normalPrice: 2000000, promoPrice: 1500000, iconName: "Zap" },
                { id: "f-6", name: "Integrasi Database", normalPrice: 1500000, promoPrice: 1000000, iconName: "Database" },
                { id: "f-7", name: "Sistem Pembayaran (Payment Gateway)", normalPrice: 2500000, promoPrice: 2000000, iconName: "ShoppingCart" },
                { id: "f-8", name: "Fitur Chat / WhatsApp Integration", normalPrice: 300000, promoPrice: 200000, iconName: "MessageSquare" },
              ]
            },
            {
              id: "cat-3",
              name: "Layanan Tambahan",
              features: [
                { id: "f-9", name: "Optimasi SEO Global", normalPrice: 750000, promoPrice: 500000, iconName: "Search" },
                { id: "f-10", name: "Email Bisnis Profesional", normalPrice: 300000, promoPrice: 250000, iconName: "Mail" },
                { id: "f-11", name: "Keamanan SSL & Proteksi", normalPrice: 500000, promoPrice: 350000, iconName: "ShieldCheck" },
              ]
            }
          ],
          discountThreshold: 5000000,
          discountPercentage: 10
        }
      });
    }
  }, [content]);

  if (!formData) return <div className="p-20 text-center">Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "content", "landing"), formData);
      alert("Perubahan berhasil disimpan!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "content/landing");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field: string, value: string) => {
    setFormData({ ...formData, hero: { ...formData.hero, [field]: value } });
  };

  const updateAbout = (field: string, value: string) => {
    setFormData({ ...formData, about: { ...formData.about, [field]: value } });
  };

  const updatePortfolio = (index: number, field: string, value: any) => {
    const newPortfolio = [...formData.portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setFormData({ ...formData, portfolio: newPortfolio });
  };

  const addPortfolio = () => {
    setFormData({
      ...formData,
      portfolio: [
        ...formData.portfolio,
        { title: "New Project", description: "", tech: [], link: "", image: "https://picsum.photos/seed/new/800/600" }
      ]
    });
  };

  const removePortfolio = (index: number) => {
    const newPortfolio = formData.portfolio.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, portfolio: newPortfolio });
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const updatePricing = (index: number, field: string, value: any) => {
    const newPricing = [...formData.pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setFormData({ ...formData, pricing: newPricing });
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const newTestimonials = [...formData.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  const updateCalculatorCategory = (catIndex: number, field: string, value: string) => {
    const newCategories = [...formData.calculator.categories];
    newCategories[catIndex] = { ...newCategories[catIndex], [field]: value };
    setFormData({ ...formData, calculator: { ...formData.calculator, categories: newCategories } });
  };

  const updateCalculatorFeature = (catIndex: number, featIndex: number, field: string, value: any) => {
    const newCategories = [...formData.calculator.categories];
    const newFeatures = [...newCategories[catIndex].features];
    newFeatures[featIndex] = { ...newFeatures[featIndex], [field]: value };
    newCategories[catIndex].features = newFeatures;
    setFormData({ ...formData, calculator: { ...formData.calculator, categories: newCategories } });
  };

  const addCalculatorFeature = (catIndex: number) => {
    const newCategories = [...formData.calculator.categories];
    const newFeatures = [
      ...newCategories[catIndex].features,
      { id: `f-${Date.now()}`, name: "New Feature", normalPrice: 0, promoPrice: 0, iconName: "Zap" }
    ];
    newCategories[catIndex].features = newFeatures;
    setFormData({ ...formData, calculator: { ...formData.calculator, categories: newCategories } });
  };

  const removeCalculatorFeature = (catIndex: number, featIndex: number) => {
    const newCategories = [...formData.calculator.categories];
    newCategories[catIndex].features = newCategories[catIndex].features.filter((_: any, i: number) => i !== featIndex);
    setFormData({ ...formData, calculator: { ...formData.calculator, categories: newCategories } });
  };

  return (
    <div className="min-h-screen bg-bg-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Admin <span className="gradient-text">Panel</span></h1>
            <p className="text-text-secondary">Kelola landing page dan generate penawaran harga.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 no-scrollbar overflow-x-auto">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "content" ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                }`}
              >
                <FileEdit className="w-4 h-4" /> Edit Konten
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "calculator" ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                }`}
              >
                <Calculator className="w-4 h-4" /> Kalkulator Invoice
              </button>
            </div>

            <div className="h-10 w-px bg-white/10 hidden md:block" />

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 gradient-bg px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Simpan Perubahan"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("simpluse_admin_bypass");
                auth.signOut();
              }}
              className="flex items-center gap-2 glass px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </header>

        {activeTab === "calculator" ? (
          <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
            <PriceCalculator />
          </div>
        ) : (
          <div className="space-y-12 pb-20">
            {/* Hero Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              Hero Section
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Subtitle</label>
                <textarea
                  value={formData.hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand-orange outline-none h-32"
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              About Section
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={(e) => updateAbout("title", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Description</label>
                <textarea
                  value={formData.about.description}
                  onChange={(e) => updateAbout("description", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-brand-orange outline-none h-32"
                />
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 gradient-bg rounded-full" />
                Portfolio Section
              </h2>
              <button
                onClick={addPortfolio}
                className="flex items-center gap-2 text-brand-orange font-bold hover:underline"
              >
                <Plus className="w-5 h-5" /> Tambah Project
              </button>
            </div>
            
            <div className="grid gap-8">
              {formData.portfolio.map((project: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group">
                  <button
                    onClick={() => removePortfolio(i)}
                    className="absolute top-4 right-4 p-2 text-brand-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updatePortfolio(i, "title", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">Link</label>
                        <input
                          type="text"
                          value={project.link}
                          onChange={(e) => updatePortfolio(i, "link", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">Image URL</label>
                        <input
                          type="text"
                          value={project.image}
                          onChange={(e) => updatePortfolio(i, "image", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updatePortfolio(i, "description", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none h-32"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              Services Section
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {formData.services.map((service: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(i, "title", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Icon Name (Lucide Icon)</label>
                      <input
                        type="text"
                        value={service.iconName}
                        onChange={(e) => updateService(i, "iconName", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                        placeholder="Layout, School, Rocket, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(i, "description", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none h-24"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              Pricing Section
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {formData.pricing.map((plan: any, i: number) => (
                <div key={i} className={`p-6 rounded-2xl bg-white/5 border ${plan.recommended ? 'border-brand-orange/50' : 'border-white/5'}`}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Plan Name</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updatePricing(i, "name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Price Label</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => updatePricing(i, "price", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Original Price (optional strikeout)</label>
                      <input
                        type="text"
                        value={plan.originalPrice || ""}
                        onChange={(e) => updatePricing(i, "originalPrice", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                        placeholder="e.g. 5M"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={plan.recommended}
                        onChange={(e) => updatePricing(i, "recommended", e.target.checked)}
                        id={`recommended-${i}`}
                      />
                      <label htmlFor={`recommended-${i}`} className="text-sm text-text-secondary">Recommended Plan</label>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Features (one per line)</label>
                      <textarea
                        value={plan.features.join('\n')}
                        onChange={(e) => updatePricing(i, "features", e.target.value.split('\n'))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none h-32"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              Testimonials Section
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {formData.testimonials.map((review: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Client Name</label>
                      <input
                        type="text"
                        value={review.name}
                        onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Role</label>
                      <input
                        type="text"
                        value={review.role}
                        onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Avatar URL</label>
                      <input
                        type="text"
                        value={review.avatar}
                        onChange={(e) => updateTestimonial(i, "avatar", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Review Text</label>
                      <textarea
                        value={review.text}
                        onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none h-32"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Calculator Section */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 gradient-bg rounded-full" />
              Calculator Setup
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Discount Threshold (total min. for discount)</label>
                <input
                  type="number"
                  value={formData.calculator.discountThreshold}
                  onChange={(e) => setFormData({...formData, calculator: {...formData.calculator, discountThreshold: Number(e.target.value)}})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={formData.calculator.discountPercentage}
                  onChange={(e) => setFormData({...formData, calculator: {...formData.calculator, discountPercentage: Number(e.target.value)}})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-orange outline-none"
                />
              </div>
            </div>

            <div className="space-y-8">
              {formData.calculator.categories.map((cat: any, catIdx: number) => (
                <div key={cat.id} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      className="text-xl font-bold bg-transparent border-b border-white/10 focus:border-brand-orange outline-none pb-1"
                      value={cat.name}
                      onChange={(e) => updateCalculatorCategory(catIdx, "name", e.target.value)}
                    />
                    <button
                      onClick={() => addCalculatorFeature(catIdx)}
                      className="flex items-center gap-2 text-sm text-brand-orange hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Feature
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {cat.features.map((feat: any, featIdx: number) => (
                      <div key={feat.id} className="grid md:grid-cols-5 gap-3 items-end p-4 rounded-xl bg-white/5 border border-white/5 group">
                        <div className="md:col-span-2">
                          <label className="text-[10px] uppercase text-text-secondary mb-1 block">Feature Name</label>
                          <input
                            type="text"
                            value={feat.name}
                            onChange={(e) => updateCalculatorFeature(catIdx, featIdx, "name", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-text-secondary mb-1 block">Normal Price (Strikeout)</label>
                          <input
                            type="number"
                            value={feat.normalPrice}
                            onChange={(e) => updateCalculatorFeature(catIdx, featIdx, "normalPrice", Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-text-secondary mb-1 block">Promo Price</label>
                          <input
                            type="number"
                            value={feat.promoPrice}
                            onChange={(e) => updateCalculatorFeature(catIdx, featIdx, "promoPrice", Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] uppercase text-text-secondary mb-1 block">Icon</label>
                            <input
                              type="text"
                              value={feat.iconName}
                              onChange={(e) => updateCalculatorFeature(catIdx, featIdx, "iconName", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none"
                            />
                          </div>
                          <button
                            onClick={() => removeCalculatorFeature(catIdx, featIdx)}
                            className="p-2 text-brand-red opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          </div>
        )}
      </div>
    </div>
  );
}
