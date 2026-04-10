import { motion } from "motion/react";
import { CheckCircle2, Cpu, Globe, Zap } from "lucide-react";
import { useApp } from "../AppContext";

export default function About() {
  const { content } = useApp();

  const title = content?.about?.title || "Membangun Masa Depan Digital dengan Presisi";
  const description = content?.about?.description || "Simpluse Web Project adalah layanan pembuatan website dan aplikasi berbasis web dengan desain modern dan performa cepat. Kami berfokus pada pengalaman pengguna dan skalabilitas bisnis Anda.";

  const skills = [
    { name: "HTML, CSS, JavaScript", icon: <Globe className="w-6 h-6" /> },
    { name: "React / Next.js", icon: <Cpu className="w-6 h-6" /> },
    { name: "Firebase / Backend", icon: <Zap className="w-6 h-6" /> },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {title}
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="space-y-4 mb-10">
              {[
                "Desain Responsif & Modern",
                "Optimasi SEO & Kecepatan",
                "Integrasi Backend yang Aman",
                "Dukungan Maintenance 24/7"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {skills.map((skill, i) => (
              <div key={i} className="p-8 rounded-2xl glass border border-white/10 hover:border-brand-orange/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
                <p className="text-sm text-text-secondary">
                  Keahlian mendalam dalam membangun arsitektur web yang kuat.
                </p>
              </div>
            ))}
            <div className="p-8 rounded-2xl gradient-bg flex flex-col justify-center items-center text-center">
              <span className="text-4xl font-bold mb-2">50+</span>
              <span className="text-sm font-medium uppercase tracking-widest">Project Selesai</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
