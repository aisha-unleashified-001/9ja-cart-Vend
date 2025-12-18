import { motion } from "framer-motion";
import { Play, AlertCircle } from "lucide-react";
import { useState } from "react";
// YouTube thumbnail will be loaded dynamically

const TrailerSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // YouTube video ID extracted from: https://youtu.be/doghYogcJJw?si=RCidG1lyaENJRlOW
  const youtubeVideoId = "doghYogcJJw";

  const handlePlayClick = () => {
    if (!youtubeVideoId) {
      setVideoError(true);
      return;
    }
    setIsPlaying(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="relative py-20 bg-[#193540] overflow-hidden" id="about">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Left side circles */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute border border-white/10 rounded-full"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
                left: `${i * -20}px`,
                top: `${i * -20}px`,
              }}
            />
          ))}
        </div>

        {/* Right side circles */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute border border-white/10 rounded-full"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
                right: `${i * -20}px`,
                top: `${i * -20}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {/* A Sneak Peek */}
              Not Convinced Yet?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Here's how easy it is for customers to buy from you
            </p>
          </motion.div>
        </div>

        {/* Video Container */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {!isPlaying ? (
              // Video Thumbnail with Play Button
              <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group cursor-pointer">
                {/* YouTube Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
                  alt="9jacart Demo Video Thumbnail"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to standard quality thumbnail if maxres fails
                    e.currentTarget.src = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                  }}
                />
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                {/* Play Button Overlay */}
                <button
                  onClick={handlePlayClick}
                  className="absolute inset-0 w-full h-full focus:outline-none focus:ring-4 focus:ring-white/50 rounded-2xl"
                  aria-label="Play video"
                >
                  <span className="sr-only">Play video demonstration</span>
                </button>
              </div>
            ) : videoError ? (
              // Error State
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                  <p className="text-lg font-medium mb-2">Video Unavailable</p>
                  <p className="text-sm text-gray-300">
                    Please check the video configuration or try again later.
                  </p>
                </div>
              </div>
            ) : (
              // YouTube Embed
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title="9jacart Demo Video"
                className="w-full h-full"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={handleVideoError}
              />
            )}
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-white/70 text-sm md:text-base">
            See how seamless the shopping experience is for your customers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrailerSection;
