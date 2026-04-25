import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import SongCard from "./SongCard";
import { AlbumCollapseCard } from "./AlbumCollapseCard";

const VIEW_MODES = [
  { id: "all", label: "All" },
  { id: "liked", label: "Likes" },
  { id: "disliked", label: "Dislikes" },
];

export function SearchSection({
  searchQuery,
  setSearchQuery,
  ratings,
  onRate,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [musicResults, setMusicResults] = useState([]);
  const [podcastResults, setPodcastResults] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [filterTab, setFilterTab] = useState("all"); // ← NEW: 'all', 'music', or 'podcasts'

  // Load podcasts on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/podcasts/browse")
      .then((res) => res.json())
      .then((data) => setPodcastResults(data.podcasts || []))
      .catch((error) => console.error("Failed to load podcasts:", error));
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);

      try {
        const response = await fetch("http://localhost:5000/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });

        const data = await response.json();
        setMusicResults(data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
        setMusicResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Combine and filter results based on tab
  const allResults = [...musicResults, ...podcastResults];

  const tabFilteredResults = (() => {
    if (filterTab === "music") return musicResults;
    if (filterTab === "podcasts") return podcastResults;
    return allResults;
  })();

  // Apply view mode filter (likes/dislikes)
  const filteredResults = (() => {
    if (viewMode === "liked") {
      return tabFilteredResults.filter(
        (item) => ratings[item.id]?.rating === "Like",
      );
    }
    if (viewMode === "disliked") {
      return tabFilteredResults.filter(
        (item) => ratings[item.id]?.rating === "Dislike",
      );
    }
    return tabFilteredResults;
  })();

  return (
    <div className="section-container">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hero-title"
        >
          Discover Your Next
          <span className="hero-title-gradient">Favorite Sound</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hero-description"
        >
          Personalized music and podcast recommendations tailored just for you
        </motion.p>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Loading */}
      {isSearching && (
        <div className="loading">
          <p>Searching...</p>
        </div>
      )}

      {/* Results Section */}
      {(musicResults.length > 0 || podcastResults.length > 0) && (
        <div className="search-results">
          <h2>Results</h2>

          {/* Filter Tabs: All | Music | Podcasts */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => setFilterTab("all")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border:
                  filterTab === "all"
                    ? "2px solid rgb(var(--deep-teal))"
                    : "2px solid transparent",
                background:
                  filterTab === "all"
                    ? "linear-gradient(135deg, rgb(var(--muted-teal)) 0%, rgb(var(--deep-teal)) 100%)"
                    : "rgb(var(--card))",
                color:
                  filterTab === "all"
                    ? "white"
                    : "rgb(var(--muted-foreground))",
                cursor: "pointer",
                fontWeight: filterTab === "all" ? "bold" : "normal",
                transition: "all 0.3s",
              }}
            >
              All ({allResults.length})
            </button>
            <button
              onClick={() => setFilterTab("music")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border:
                  filterTab === "music"
                    ? "2px solid rgb(var(--muted-teal))"
                    : "2px solid transparent",
                background:
                  filterTab === "music"
                    ? "rgb(var(--muted-teal))"
                    : "rgb(var(--card))",
                color:
                  filterTab === "music"
                    ? "white"
                    : "rgb(var(--muted-foreground))",
                cursor: "pointer",
                fontWeight: filterTab === "music" ? "bold" : "normal",
                transition: "all 0.3s",
              }}
            >
              🎵 Music ({musicResults.length})
            </button>
            <button
              onClick={() => setFilterTab("podcasts")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border:
                  filterTab === "podcasts"
                    ? "2px solid rgb(var(--deep-teal))"
                    : "2px solid transparent",
                background:
                  filterTab === "podcasts"
                    ? "rgb(var(--deep-teal))"
                    : "rgb(var(--card))",
                color:
                  filterTab === "podcasts"
                    ? "white"
                    : "rgb(var(--muted-foreground))",
                cursor: "pointer",
                fontWeight: filterTab === "podcasts" ? "bold" : "normal",
                transition: "all 0.3s",
              }}
            >
              🎙️ Podcasts ({podcastResults.length})
            </button>
          </div>

          {/* Results Grid */}
          {filteredResults.length === 0 ? (
            <div className="no-results">
              <p>
                {viewMode === "liked" && "No liked items in these results."}
                {viewMode === "disliked" &&
                  "No disliked items in these results."}
                {viewMode === "all" && "No results to display."}
              </p>
            </div>
          ) : (
            <div className="results-grid">
              {filteredResults.map((item) => (
                <SongCard
                  key={item.id}
                  song={item}
                  onRate={onRate}
                  userRating={ratings[item.id]?.rating}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isSearching &&
        musicResults.length === 0 &&
        podcastResults.length === 0 &&
        searchQuery.trim() && (
          <div className="no-results">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
    </div>
  );
}
