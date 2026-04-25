import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WeightSlider } from "./WeightSlider";
import SongCard from "./SongCard";

export function RecommendationsView({ ratings, onRate }) {
  const [weight, setWeight] = useState(50);
  const [musicRecommendations, setMusicRecommendations] = useState([]); // ← Separate state
  const [podcastRecommendations, setPodcastRecommendations] = useState([]); // ← Separate state
  const [loading, setLoading] = useState(false);
  const [contentTab, setContentTab] = useState("music");
  const hasInitialFetch = useRef({ music: false, podcasts: false });
  const debounceTimer = useRef(null);

  const hasRatings = Object.keys(ratings).length > 0;

  const fetchRecommendations = async (type) => {
    if (!hasRatings) return;

    setLoading(true);

    try {
      const endpoint =
        type === "music"
          ? "http://localhost:5000/api/recommend"
          : "http://localhost:5000/api/podcasts/recommend";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratings: ratings,
          weight: weight,
        }),
      });

      const data = await response.json();

      if (data.recommendations) {
        // Update the correct state based on type
        if (type === "music") {
          setMusicRecommendations(data.recommendations);
        } else {
          setPodcastRecommendations(data.recommendations);
        }
      } else {
        console.error(`No ${type} recommendations:`, data.error);
        if (type === "music") {
          setMusicRecommendations([]);
        } else {
          setPodcastRecommendations([]);
        }
      }
    } catch (error) {
      console.error(`${type} recommendations failed:`, error);
      if (type === "music") {
        setMusicRecommendations([]);
      } else {
        setPodcastRecommendations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component mounts
  useEffect(() => {
    if (hasRatings && !hasInitialFetch.current[contentTab]) {
      fetchRecommendations(contentTab);
      hasInitialFetch.current[contentTab] = true;
    }
  }, []);

  // Fetch when weight changes (only for current tab)
  useEffect(() => {
    if (hasRatings && hasInitialFetch.current[contentTab]) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchRecommendations(contentTab);
      }, 500);

      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }
  }, [weight]);

  // Fetch when tab changes (if not already fetched)
  useEffect(() => {
    if (hasRatings && !hasInitialFetch.current[contentTab]) {
      fetchRecommendations(contentTab);
      hasInitialFetch.current[contentTab] = true;
    }
  }, [contentTab]);

  // Get current recommendations based on active tab
  const currentRecommendations =
    contentTab === "music" ? musicRecommendations : podcastRecommendations;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="recommendations-container"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="recommendations-title"
      >
        Your Personalized Recommendations
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="recommendations-description"
      >
        Based on your listening preferences and similar users
      </motion.p>

      {/* Content Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setContentTab("music")}
          style={{
            padding: "10px 30px",
            borderRadius: "20px",
            border:
              contentTab === "music"
                ? "2px solid rgb(var(--muted-teal))"
                : "2px solid transparent",
            background:
              contentTab === "music"
                ? "rgb(var(--muted-teal))"
                : "rgb(var(--card))",
            color:
              contentTab === "music" ? "white" : "rgb(var(--muted-foreground))",
            cursor: "pointer",
            fontWeight: contentTab === "music" ? "bold" : "normal",
            transition: "all 0.3s",
          }}
        >
          🎵 Music
        </button>
        <button
          onClick={() => setContentTab("podcasts")}
          style={{
            padding: "10px 30px",
            borderRadius: "20px",
            border:
              contentTab === "podcasts"
                ? "2px solid rgb(var(--deep-teal))"
                : "2px solid transparent",
            background:
              contentTab === "podcasts"
                ? "rgb(var(--deep-teal))"
                : "rgb(var(--card))",
            color:
              contentTab === "podcasts"
                ? "white"
                : "rgb(var(--muted-foreground))",
            cursor: "pointer",
            fontWeight: contentTab === "podcasts" ? "bold" : "normal",
            transition: "all 0.3s",
          }}
        >
          🎙️ Podcasts
        </button>
      </div>

      <WeightSlider weight={weight} setWeight={setWeight} />

      {hasRatings ? (
        <div className="recommendations-section">
          <h2 className="section-heading">Recommended For You</h2>

          {loading ? (
            <div className="loading">
              <p>Generating recommendations...</p>
            </div>
          ) : currentRecommendations.length > 0 ? (
            <div className="results-grid">
              {currentRecommendations.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onRate={onRate}
                  userRating={ratings[song.id]?.rating}
                />
              ))}
            </div>
          ) : (
            <p className="empty-message">
              No {contentTab} recommendations available. Try rating more{" "}
              {contentTab}!
            </p>
          )}
        </div>
      ) : (
        <div className="empty-recommendations">
          <p>Rate some {contentTab} to get personalized recommendations!</p>
          <p className="empty-hint">Go to the Search tab and start rating.</p>
        </div>
      )}
    </motion.div>
  );
}
