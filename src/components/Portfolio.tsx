import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useApp } from "../AppContext";

export default function Portfolio() {
  const { content } = useApp();

  const defaultProjects = [
    {
      title: "Khidmah Abadi",
      description: "Platform layanan masyarakat dengan fitur manajemen kegiatan dan informasi terpadu.",
      tech: ["Next.js", "Tailwind CSS", "Firebase"],
      image: "https://picsum.photos/seed/community/800/600",
      link: "https://khidmah-abadi.vercel.app/",
    },
    {
      title: "CAEM System",
      description: "Sistem manajemen operasional cerdas untuk efisiensi alur kerja perusahaan.",
      tech: ["React", "Node.js", "PostgreSQL"],
      image: "https://picsum.photos/seed/system/800/600",
      link: "https://caem-system.vercel.app/",
    },
    {
      title: "SIMAK An-Sor Tasik",
      description: "Sistem Informasi Akademik terintegrasi untuk pengelolaan data pendidikan dan santri.",
      tech: ["React", "Express", "MongoDB"],
      image: "https://picsum.photos/seed/school/800/600",
      link: "https://simakansortasik.vercel.app/",
    },
  ];

  const projects = content?.portfolio || defaultProjects;

  return (
    <section id="portfolio" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Portofolio <span className="gradient-text">Terbaik</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Beberapa project unggulan yang telah kami selesaikan dengan standar profesional tinggi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden glass border border-white/10 flex flex-col h-full"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/10 text-brand-orange">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-text-secondary mb-6 flex-grow">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-bold group-hover:text-brand-orange transition-colors mt-auto"
                >
                  Lihat Demo <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              {/* Soft Glow Effect */}
              <div className="absolute inset-0 bg-linear-to-t from-brand-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
