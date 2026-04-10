import { motion } from "motion/react";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Budi Santoso",
      role: "CEO of TechCorp",
      text: "Simpluse benar-benar mengerti apa yang kami butuhkan. Website kami sekarang jauh lebih cepat dan modern.",
      avatar: "https://picsum.photos/seed/person1/100/100",
    },
    {
      name: "Siti Aminah",
      role: "Owner of Bloom Florist",
      text: "Landing page yang dibuat sangat membantu meningkatkan penjualan kami hingga 40% dalam sebulan!",
      avatar: "https://picsum.photos/seed/person2/100/100",
    },
    {
      name: "Andi Wijaya",
      role: "Marketing Manager",
      text: "Kerja cepat, rapi, dan komunikatif. Sangat direkomendasikan untuk jasa web developer.",
      avatar: "https://picsum.photos/seed/person3/100/100",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Apa Kata <span className="gradient-text">Klien</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Kepercayaan klien adalah prioritas utama kami.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl glass border border-white/10 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5" />
              <p className="text-text-secondary italic mb-8 relative z-10">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-orange"
                />
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-xs text-text-secondary">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
