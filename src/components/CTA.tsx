import { motion } from "motion/react";
import { MessageCircle, Send } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-10 blur-[100px]" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-[3rem] glass border border-white/20 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Siap punya website <span className="gradient-text">profesional?</span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Konsultasikan ide Anda sekarang dan biarkan kami mewujudkannya menjadi kenyataan digital yang luar biasa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#25D366] text-white font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Kami
            </a>
            <a
              href="#"
              className="w-full sm:w-auto px-10 py-5 rounded-full gradient-bg text-white font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              <Send className="w-6 h-6" />
              Mulai Project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
