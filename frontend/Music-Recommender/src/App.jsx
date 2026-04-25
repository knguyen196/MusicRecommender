import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { SearchSection } from "./components/SearchSection";
import { BrowseSection } from "./components/BrowseSection";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { RatedSongs } from "./components/RatedSongs";
import { RecommendationsView } from "./components/RecommendationsView";

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");

  // Load ratings from localStorage on initial render
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem("songRatings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  useEffect(() => {
    localStorage.setItem("songRatings", JSON.stringify(ratings));
  }, [ratings]);

  const handleRate = (songId, rating, song) => {
    if (rating === null) {
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[songId];
        return newRatings;
      });
    } else {
      setRatings((prev) => ({
        ...prev,
        [songId]: { song, rating },
      }));
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "recommendations":
        return <RecommendationsView ratings={ratings} onRate={handleRate} />;
      case "browse":
        return <BrowseSection ratings={ratings} onRate={handleRate} />;
      case "about":
        return <AboutSection />;
      case "rated":
        return <RatedSongs ratings={ratings} onRate={handleRate} />;
      default:
        return (
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            ratings={ratings}
            onRate={handleRate}
          />
        );
    }
  };

  return (
    <div className="page-container">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="main-content">
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
