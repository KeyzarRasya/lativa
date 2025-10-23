import { useState } from 'react';
import { Camera, Shield, AlertTriangle, Users, Filter, X, Calendar, User, BarChart3, Quote } from 'lucide-react';
import postsData from '../data/transparencyPosts.json';

export default function TransparencyFeed() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filters = ['Semua', 'Kriminalitas', 'Aktivitas Pejabat', 'Publikasi Kota'];

  const posts = postsData;

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  const filteredPosts = activeFilter === 'Semua'
    ? posts
    : posts.filter(post => post.category === activeFilter);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Kriminalitas':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Aktivitas Pejabat':
        return <Shield className="w-5 h-5" />;
      case 'Publikasi Kota':
        return <Users className="w-5 h-5" />;
      default:
        return <Camera className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Kriminalitas':
        return 'from-red-500 to-orange-500';
      case 'Aktivitas Pejabat':
        return 'from-blue-500 to-cyan-500';
      case 'Publikasi Kota':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-24 pt-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A4D8C] mb-4">
            Transparency Feed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informasi publik real-time tentang keamanan kota dan aktivitas pejabat
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <div className="flex items-center space-x-2 text-gray-600 mr-4">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#0A4D8C] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => openModal(post)}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#009688] group fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(post.category)}`}></div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(post.category)} text-white`}>
                    {getCategoryIcon(post.category)}
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>

                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#0A4D8C]/10 text-[#0A4D8C] rounded-full text-xs font-semibold mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#0A4D8C] mb-2 group-hover:text-[#009688] transition-colors">
                    {post.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                  <Camera className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs">
                    <span className="text-gray-500">AI Confidence: </span>
                    <span className="font-bold text-[#009688]">{post.confidence}%</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'Terverifikasi'
                      ? 'bg-blue-100 text-blue-700'
                      : post.status === 'Ditangani'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {post.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-[#0A4D8C] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#083a6b] transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <span>Lihat Semua Publikasi</span>
          </button>
        </div>
      </div>

      {/* Modal Detail Artikel */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <div className="min-h-screen px-4 flex items-center justify-center py-8">
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Header */}
              <div className={`h-3 bg-gradient-to-r ${getCategoryColor(selectedPost.category)}`}></div>
              
              {/* Content */}
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                {/* Category Badge */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedPost.category)} text-white`}>
                    {getCategoryIcon(selectedPost.category)}
                  </div>
                  <span className="px-4 py-1.5 bg-[#0A4D8C]/10 text-[#0A4D8C] rounded-full text-sm font-semibold">
                    {selectedPost.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#0A4D8C] mb-4">
                  {selectedPost.title}
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{selectedPost.fullArticle.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedPost.fullArticle.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>{selectedPost.location}</span>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedPost.status === 'Terverifikasi'
                        ? 'bg-blue-100 text-blue-700'
                        : selectedPost.status === 'Ditangani'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedPost.status}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose max-w-none">
                  {selectedPost.fullArticle.content.map((section, index) => {
                    if (section.type === 'paragraph') {
                      return (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                          {section.text}
                        </p>
                      );
                    }
                    if (section.type === 'heading') {
                      return (
                        <h3 key={index} className="text-2xl font-bold text-[#0A4D8C] mt-8 mb-4">
                          {section.text}
                        </h3>
                      );
                    }
                    if (section.type === 'quote') {
                      return (
                        <div key={index} className="bg-gradient-to-r from-[#0A4D8C]/5 to-[#009688]/5 border-l-4 border-[#0A4D8C] p-6 my-6 rounded-r-xl">
                          <Quote className="w-8 h-8 text-[#0A4D8C] mb-3" />
                          <p className="text-gray-800 italic text-lg mb-2">"{section.text}"</p>
                          <p className="text-sm text-gray-600 font-semibold">— {section.author}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Statistics */}
                <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[#0A4D8C]" />
                    <h4 className="font-bold text-gray-800 text-lg">Statistik</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedPost.fullArticle.statistics.map((stat, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-[#0A4D8C] mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#0A4D8C]/10 to-[#009688]/10 text-[#0A4D8C] rounded-lg text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* AI Confidence */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Confidence Score:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0A4D8C] to-[#009688]"
                          style={{ width: `${selectedPost.confidence}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-[#009688]">{selectedPost.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
