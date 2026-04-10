import { motion } from "motion/react";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Basic Package",
      price: "500K - 1M",
      features: ["1-3 Halaman", "Desain Simpel", "Mobile Friendly", "Basic SEO", "1x Revisi"],
      color: "border-green-500/30",
      recommended: false,
    },
    {
      name: "Standard Package",
      price: "1.5M - 3M",
      features: ["3-7 Halaman", "Desain Custom", "SEO Basic", "Admin Sederhana", "3x Revisi", "Free Hosting 1th"],
      color: "border-blue-500/30",
      recommended: true,
    },
    {
      name: "Premium Package",
      price: "3.5M - 10M+",
      features: ["Full Custom", "Login User", "Dashboard Admin", "Database Integration", "Unlimited Revisi", "Premium Support"],
      color: "border-purple-500/30",
      recommended: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Pilihan <span className="gradient-text">Paket</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Pilih paket yang paling sesuai dengan kebutuhan dan budget bisnis Anda.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`p-10 rounded-3xl glass border ${plan.color} relative ${plan.recommended ? 'scale-105 z-10 gradient-border' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Recommended
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm text-text-secondary">Rp</span>
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-4 rounded-xl font-bold transition-all ${
                  plan.recommended 
                    ? 'gradient-bg text-white hover:opacity-90' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Pilih Paket
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl glass border border-brand-orange/20 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">Custom Project</h3>
          <p className="text-text-secondary mb-6">
            Sistem kompleks (SIMAK, ERP, dll) dengan harga menyesuaikan kebutuhan spesifik Anda.
          </p>
          <a href="#contact" className="text-brand-orange font-bold hover:underline">Hubungi Kami untuk Penawaran Khusus →</a>
        </div>
      </div>
    </section>
  );
}
