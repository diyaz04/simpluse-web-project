import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  CheckCircle2, 
  FileText, 
  Download, 
  Trash2, 
  ArrowRight,
  Monitor,
  Smartphone,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Lock,
  MessageSquare,
  Search,
  ShoppingCart,
  Mail,
  HelpCircle,
  Tag
} from "lucide-react";
import { useApp } from "../AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
};

// Define it here to ensure it's available
const generatePDF = (customerInfo: any, totals: any, calculator: any, formatPrice: Function) => {
  try {
    const doc = new jsPDF() as any;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 100, 0); // Orange
    doc.text("INVOICE SIMPLUSE WEB", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Estimasi Harga Proyek Digital", 105, 28, { align: "center" });

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Klien Details:", 20, 45);
    doc.setFontSize(10);
    doc.text(`Nama: ${customerInfo.name}`, 20, 52);
    doc.text(`WhatsApp: ${customerInfo.whatsapp}`, 20, 58);
    doc.text(`Email: ${customerInfo.email || "-"}`, 20, 64);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 20, 70);

    // Table
    const tableRows = totals.items.map((item: any, index: number) => [
      index + 1,
      item.name,
      formatPrice(item.normalPrice),
      formatPrice(item.promoPrice)
    ]);

    // Use the autotable function directly
    autoTable(doc, {
      startY: 80,
      head: [['No', 'Fitur/Layanan', 'Harga Normal', 'Harga Promo']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [255, 100, 0] }
    });

    const lastY = (doc as any).lastAutoTable?.finalY || 150;
    const summaryY = lastY + 10;

    // Summary
    doc.setFontSize(11);
    doc.text(`Total Harga Normal:`, 120, summaryY);
    doc.text(formatPrice(totals.original), 160, summaryY);
    
    doc.text(`Total Harga Promo:`, 120, summaryY + 7);
    doc.text(formatPrice(totals.current), 160, summaryY + 7);

    if (totals.discount > 0) {
      doc.setTextColor(255, 0, 0);
      doc.text(`Diskon (${calculator.discountPercentage}%):`, 120, summaryY + 14);
      doc.text(`- ${formatPrice(totals.discount)}`, 160, summaryY + 14);
      doc.setTextColor(0);
    }

    const finalYPos = summaryY + (totals.discount > 0 ? 25 : 18);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL FINAL:`, 120, finalYPos);
    doc.text(formatPrice(totals.final), 160, finalYPos);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Catatan: Ini adalah estimasi harga. Harga akhir mungkin berubah berdasarkan spesifikasi detail.", 105, 280, { align: "center" });

    doc.save(`Invoice_Simpluse_${customerInfo.name.replace(/\s+/g, '_')}.pdf`);
    return true;
  } catch (err) {
    console.error("PDF internal error:", err);
    throw err;
  }
};

export default function PriceCalculator() {
  // ... rest of the component
  const { content } = useApp();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: "", whatsapp: "", email: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultCalculator = {
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
  };

  const calculator = content?.calculator || defaultCalculator;

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const totals = useMemo(() => {
    let original = 0;
    let current = 0;
    const items: any[] = [];

    calculator.categories.forEach(cat => {
      cat.features.forEach(feat => {
        if (selectedFeatures.includes(feat.id)) {
          original += feat.normalPrice;
          current += feat.promoPrice;
          items.push(feat);
        }
      });
    });

    let discount = 0;
    if (current >= calculator.discountThreshold) {
      discount = current * (calculator.discountPercentage / 100);
    }

    return { original, current, discount, final: current - discount, items };
  }, [selectedFeatures, calculator]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
  };

  const handleGenerateInvoice = async () => {
    if (!customerInfo.name || !customerInfo.whatsapp) {
      alert("Silakan lengkapi nama dan WhatsApp Anda.");
      return;
    }

    if (selectedFeatures.length === 0) {
      alert("Silakan pilih minimal satu fitur.");
      return;
    }

    setIsGenerating(true);
    
    // 1. Silent Firestore save (Non-blocking - Fire and Forget)
    // This makes the PDF generation feel instant instead of waiting for network
    const customerData = {
      ...customerInfo,
      features: totals.items.map(i => i.name),
      totalPrice: totals.final,
      discount: totals.discount,
      createdAt: new Date().toISOString()
    };
    
    addDoc(collection(db, "inquiries"), customerData).catch(err => {
      console.warn("Analytics tracking failed, but PDF is still generating:", err);
    });

    // 2. Immediate PDF Generation
    try {
      // Small timeout to allow UI to show loading state before CPU intensive task
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await generatePDF(customerInfo, totals, calculator, formatPrice);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      alert(`Gagal membuat PDF: ${error.message || "Kesalahan sistem"}. Mohon coba di browser lain.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="calculator" className="py-24 bg-bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/20 text-brand-orange text-sm font-bold mb-6"
          >
            <Calculator className="w-4 h-4" /> Kalkulator Cerdas
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Invoice <span className="gradient-text">Generator</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Gunakan kalkulator ini untuk membuat penawaran harga instan untuk klien Anda. Pilih fitur dan download invoice PDF.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left: Features Selection */}
          <div className="lg:col-span-2 space-y-10">
            {calculator.categories.map((category) => (
              <div key={category.id}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 gradient-bg rounded-full" />
                  {category.name}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {category.features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer p-6 rounded-2xl glass border transition-all ${
                        selectedFeatures.includes(feature.id) 
                          ? 'border-brand-orange bg-brand-orange/5' 
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedFeatures.includes(feature.id) ? 'gradient-bg text-white' : 'bg-white/5 text-brand-orange'
                        }`}>
                          {iconMap[feature.iconName] || <HelpCircle className="w-6 h-6" />}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedFeatures.includes(feature.id) ? 'bg-brand-orange border-brand-orange' : 'border-white/10'
                        }`}>
                          {selectedFeatures.includes(feature.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <h4 className="font-bold mb-2">{feature.name}</h4>
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary line-through">{formatPrice(feature.normalPrice)}</span>
                        <span className="text-lg font-bold text-brand-orange">{formatPrice(feature.promoPrice)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary & Customer Info */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-orange" /> Ringkasan Proyek
              </h3>
              
              <AnimatePresence mode="popLayout">
                {totals.items.length > 0 ? (
                  <div className="space-y-3 mb-8">
                    {totals.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-text-secondary truncate pr-4">{item.name}</span>
                        <span className="font-medium shrink-0">{formatPrice(item.promoPrice)}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-text-secondary text-sm border-2 border-dashed border-white/5 rounded-2xl mb-8">
                    Belum ada fitur dipilih
                  </div>
                )}
              </AnimatePresence>

              <div className="space-y-3 pt-6 border-t border-white/5 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">{formatPrice(totals.current)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Diskon {calculator.discountPercentage}%</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Estimasi Total</span>
                  <span className="gradient-text">{formatPrice(totals.final)}</span>
                </div>
              </div>

              {/* Form Info */}
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-orange text-sm"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="No. WhatsApp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-orange text-sm"
                  value={customerInfo.whatsapp}
                  onChange={(e) => setCustomerInfo({...customerInfo, whatsapp: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email (Opsional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-orange text-sm"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>

              <button
                onClick={handleGenerateInvoice}
                disabled={isGenerating || selectedFeatures.length === 0}
                className="w-full gradient-bg text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Generate Invoice PDF
                  </>
                )}
              </button>

              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Berhasil! Invoice sedang didownload.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="glass p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/20">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Butuh paket khusus?</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Kami juga melayani pengembangan sistem skala besar yang membutuhkan arsitektur custom.
                  </p>
                  <a href="#contact" className="text-xs text-brand-orange font-bold mt-2 inline-flex items-center gap-1 hover:underline">
                    Konsultasi Sekarang <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
