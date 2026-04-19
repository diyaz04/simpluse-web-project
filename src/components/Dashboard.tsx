import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useApp } from "../AppContext";
import { motion } from "motion/react";
import { Save, LogOut, Plus, Trash2 } from "lucide-react";
import { auth } from "../firebase";

export default function Dashboard() {
  const { content } = useApp();
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

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
        ]
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

  return (
    <div className="min-h-screen bg-bg-dark p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-display font-bold">Admin <span className="gradient-text">Dashboard</span></h1>
          <div className="flex gap-4">
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
        </div>

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
        </div>
      </div>
    </div>
  );
}
