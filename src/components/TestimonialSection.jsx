import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Dengan LATIVA, proses pengawasan menjadi lebih cepat dan transparan. Kami dapat memantau kinerja pejabat secara real-time dan objektif.",
      author: "Drs. Ahmad Sudrajat, M.Si",
      position: "Inspektur Kabupaten Purwakarta",
      avatar: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      quote: "Sebagai warga Purwakarta, saya merasa lebih aman karena tahu bahwa kota kita dipantau 24/7. Sistem ini benar-benar meningkatkan rasa aman masyarakat.",
      author: "Siti Nurhaliza",
      position: "Warga Purwakarta",
      avatar: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      quote: "LATIVA adalah terobosan luar biasa dalam smart governance. Kombinasi AI dan transparansi menciptakan ekosistem pemerintahan yang lebih bersih.",
      author: "Dr. Budi Santoso, S.T., M.T.",
      position: "Tim Pengembang LATIVA",
      avatar: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      quote: "Respon cepat terhadap insiden keamanan membuat kami bisa bertindak lebih efektif. Data yang akurat membantu pengambilan keputusan yang tepat.",
      author: "AKBP Rudi Hermawan",
      position: "Kepala Kepolisian Resor Purwakarta",
      avatar: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Apa Kata Mereka
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimoni dari berbagai stakeholder yang telah merasakan dampak LATIVA
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-white/50">
            <Quote className="w-16 h-16 text-[#009688] opacity-20 mb-6" />

            <div className="min-h-[250px] flex flex-col justify-between">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].quote}"
              </p>

              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-xl ${testimonials[currentIndex].avatar} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl font-bold text-white">
                    {testimonials[currentIndex].author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-lg text-[#0A4D8C]">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].position}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2">
            <button
              onClick={goToPrevious}
              className="bg-white text-[#0A4D8C] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2">
            <button
              onClick={goToNext}
              className="bg-white text-[#0A4D8C] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#0A4D8C] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
