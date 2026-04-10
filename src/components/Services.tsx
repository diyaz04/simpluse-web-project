import { motion } from "motion/react";
import { Layout, School, Rocket, Settings, BarChart3, ShieldCheck } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Company Profile",
      description: "Website representasi bisnis yang elegan dan profesional.",
      icon: <Layout className="w-8 h-8" />,
    },
    {
      title: "Sekolah & Pesantren",
      description: "Sistem informasi dan portal edukasi modern.",
      icon: <School className="w-8 h-8" />,
    },
    {
      title: "Landing Page",
      description: "Halaman promosi dengan konversi tinggi.",
      icon: <Rocket className="w-8 h-8" />,
    },
    {
      title: "Custom Web App",
      description: "Aplikasi web sesuai kebutuhan bisnis spesifik.",
      icon: <Settings className="w-8 h-8" />,
    },
    {
      title: "Dashboard Admin",
      description: "Sistem manajemen data yang intuitif.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Maintenance",
      description: "Pemeliharaan rutin dan optimasi performa.",
      icon: <ShieldCheck className="w-8 h-8" />,
    },
  ];

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Layanan <span className="gradient-text">Kami</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Kami menawarkan berbagai solusi digital untuk membantu bisnis Anda bertransformasi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-10 rounded-3xl glass border border-white/10 hover:border-brand-orange/30 transition-all hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-brand-orange/20 group-hover:text-brand-orange transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
