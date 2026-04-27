﻿﻿// Browse page lets users explore songs and podcasts by mood or category
import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Podcast } from "lucide-react";
import SongCard from "./SongCard";

export function BrowseSection({ ratings, onRate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySongs, setCategorySongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "high-energy",
      name: "High Energy",
      colorClass: "browse-category-pop",
      icon: Music,
      description: "Loud, intense, powerful",
    },
    {
      id: "chill",
      name: "Chill",
      colorClass: "browse-category-electronic",
      icon: Music,
      description: "Calm, relaxed, mellow",
    },
    {
      id: "fast-tempo",
      name: "Fast Tempo",
      colorClass: "browse-category-rock",
      icon: Music,
      description: "Upbeat, danceable",
    },
    {
      id: "slow-tempo",
      name: "Slow Tempo",
      colorClass: "browse-category-jazz",
      icon: Music,
      description: "Slow, contemplative",
    },
    {
      id: "bright",
      name: "Bright",
      colorClass: "browse-category-classical",
      icon: Music,
      description: "Crisp, uplifting",
    },
    {
      id: "dark",
      name: "Dark",
      colorClass: "browse-category-hiphop",
      icon: Music,
      description: "Deep, moody",
    },
  ];

  const podcastCategories = [
    { name: "Technology", colorClass: "browse-category-tech", icon: Podcast },
    { name: "True Crime", colorClass: "browse-category-crime", icon: Podcast },
    { name: "Science", colorClass: "browse-category-science", icon: Podcast },
    { name: "Business", colorClass: "browse-category-business", icon: Podcast },
    { name: "Health", colorClass: "browse-category-health", icon: Podcast },
    { name: "Comedy", colorClass: "browse-category-comedy", icon: Podcast },
    { name: "History", colorClass: "browse-category-history", icon: Podcast },
    { name: "News", colorClass: "browse-category-news", icon: Podcast },
    { name: "Sports", colorClass: "browse-category-sports", icon: Podcast },
    {
      name: "Education",
      colorClass: "browse-category-education",
      icon: Podcast,
    },
  ];

  const handleCategoryClick = async (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName, type: "music" });
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/browse/mood/${categoryId}`,
      );
      const data = await response.json();
      setCategorySongs(data.songs || []);
    } catch (error) {
      console.error("Browse error:", error);
      setCategorySongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastCategoryClick = async (categoryName) => {
    setSelectedCategory({
      id: categoryName,
      name: categoryName,
      type: "podcast",
    });
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/podcasts/browse/${encodeURIComponent(categoryName)}`,
      );
      const data = await response.json();
      setCategorySongs(data.podcasts || []);
    } catch (error) {
      console.error("Browse podcasts error:", error);
      setCategorySongs([]);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCategory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="browse-section"
      >
        <div className="search-results">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              ← Back to Categories
            </button>
            <h2>{selectedCategory.name}</h2>
          </div>

          {loading ? (
            <div className="loading">
              <p>
                Loading{" "}
                {selectedCategory.type === "podcast" ? "podcasts" : "songs"}...
              </p>
            </div>
          ) : categorySongs.length > 0 ? (
            <div className="results-grid">
              {categorySongs.map((item) => (
                <SongCard
                  key={item.id}
                  song={item}
                  onRate={onRate}
                  userRating={ratings[item.id]?.rating}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>
                No {selectedCategory.type === "podcast" ? "podcasts" : "songs"}{" "}
                found for this category
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="browse-section"
    >
      <div className="browse-header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="browse-title"
        >
          Browse by Mood
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="browse-description"
        >
          Discover songs based on audio characteristics and mood
        </motion.p>
      </div>

      {/* Music Categories */}
      <div className="browse-category-section">
        <h2 className="browse-category-title">
          <Music className="section-title-icon-rose" />
          Music Moods
        </h2>
        <div className="browse-category-grid">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`browse-category-button ${cat.colorClass}`}
              onClick={() => handleCategoryClick(cat.id, cat.name)}
            >
              <cat.icon className="browse-category-icon" />
              <span className="browse-category-name">{cat.name}</span>
              <div
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.9,
                  marginTop: "0.25rem",
                }}
              >
                {cat.description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Podcast Categories*/}
      <div className="browse-category-section">
        <h2 className="browse-category-title">
          <Podcast className="section-title-icon-orange" />
          Podcast Categories
        </h2>
        <div className="browse-category-podcast">
          {podcastCategories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`browse-category-button ${cat.colorClass}`}
              onClick={() => handlePodcastCategoryClick(cat.name)}
            >
              <cat.icon className="browse-category-icon" />
              <span className="browse-category-name">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
