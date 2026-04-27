// Recommendations page fetches and displays personalized music and podcast recommendations
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WeightSlider } from "./WeightSlider";
import SongCard from "./SongCard";

export function RecommendationsView({ ratings, onRate }) {
  const [weight, setWeight] = useState(50);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [podcastRecommendations, setPodcastRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contentTab, setContentTab] = useState("music");
  const [crossModalInfo, setCrossModalInfo] = useState(null);
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
        if (type === "music") {
          setMusicRecommendations(data.recommendations);
        } else {
          setPodcastRecommendations(data.recommendations);
          setCrossModalInfo(null);
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

  const handleGetPodcastsFromMusic = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/podcasts/recommend/from-music",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ratings }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPodcastRecommendations(data.recommendations);
        setCrossModalInfo({ moods: data.moods, categories: data.categories });
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error fetching cross-modal recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasRatings && !hasInitialFetch.current[contentTab]) {
      fetchRecommendations(contentTab);
      hasInitialFetch.current[contentTab] = true;
    }
  }, []);

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

  useEffect(() => {
    if (hasRatings && !hasInitialFetch.current[contentTab]) {
      fetchRecommendations(contentTab);
      hasInitialFetch.current[contentTab] = true;
    }
  }, [contentTab]);

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

      {contentTab === "podcasts" && hasRatings && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={handleGetPodcastsFromMusic}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background:
                "linear-gradient(135deg, rgb(var(--muted-teal)) 0%, rgb(var(--deep-teal)) 100%)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            Get Podcast Recommendations Based on My Music Taste
          </button>
        </div>
      )}

      <WeightSlider weight={weight} setWeight={setWeight} />

      {contentTab === "podcasts" && crossModalInfo && (
        <div
          style={{
            background: "rgb(var(--card))",
            border: "1px solid rgb(var(--muted-teal) / 0.4)",
            borderRadius: "12px",
            padding: "0.9rem 1.25rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>
            Based on your{" "}
            <span style={{ color: "rgb(var(--muted-teal))" }}>
              {crossModalInfo.moods?.join(", ").replace(/-/g, " ")}
            </span>{" "}
            music taste
          </p>
          <p
            style={{
              margin: "0.3rem 0 0",
              fontSize: "0.85rem",
              color: "rgb(var(--muted-foreground))",
            }}
          >
            Exploring: {crossModalInfo.categories.join(", ")}
          </p>
        </div>
      )}

      {hasRatings ? (
        <div className="recommendations-section">
          <h2 className="section-heading">Recommended For You</h2>

          {!loading && currentRecommendations.length > 0 && (
            <p
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "rgb(var(--muted-foreground))",
                marginBottom: "1rem",
              }}
            >
              {weight}% {contentTab === "music" ? "song" : "description"}{" "}
              similarity · {100 - weight}% listener patterns
            </p>
          )}

          {loading ? (
            <div className="loading">
              <p>Generating recommendations</p>
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
