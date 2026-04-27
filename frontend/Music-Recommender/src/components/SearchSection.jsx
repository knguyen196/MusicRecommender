// Search page queries music and podcasts simultaneously and shows filtered results
import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import SongCard from "./SongCard";

export function SearchSection({
  searchQuery,
  setSearchQuery,
  ratings,
  onRate,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [musicResults, setMusicResults] = useState([]);
  const [podcastResults, setPodcastResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterTab, setFilterTab] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setFilterTab("all");
    setErrorMessage("");

    try {
      const [musicRes, podcastRes] = await Promise.all([
        fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        }),
        fetch("/api/podcasts/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        }),
      ]);

      if (!musicRes.ok || !podcastRes.ok) {
        const musicText = await musicRes.text().catch(() => "");
        const podcastText = await podcastRes.text().catch(() => "");
        console.error("Search API error:", {
          musicStatus: musicRes.status,
          podcastStatus: podcastRes.status,
          musicBody: musicText,
          podcastBody: podcastText,
        });
        setErrorMessage(
          "Search failed (API error). Make sure the backend is running on port 5000.",
        );
        setMusicResults([]);
        setPodcastResults([]);
        return;
      }

      const musicData = await musicRes.json().catch(() => ({}));
      const podcastData = await podcastRes.json().catch(() => ({}));

      setMusicResults(musicData.results || []);
      setPodcastResults(podcastData.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setErrorMessage(
        "Search failed (network error). Make sure the backend is running and reachable.",
      );
      setMusicResults([]);
      setPodcastResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const allResults = [...musicResults, ...podcastResults];

  const tabFilteredResults = (() => {
    if (filterTab === "music") return musicResults;
    if (filterTab === "podcasts") return podcastResults;
    return allResults;
  })();

  const tabStyle = (tab) => ({
    padding: "8px 20px",
    borderRadius: "20px",
    border:
      filterTab === tab
        ? `2px solid rgb(var(--deep-teal))`
        : "2px solid transparent",
    background:
      filterTab === tab
        ? "linear-gradient(135deg, rgb(var(--muted-teal)) 0%, rgb(var(--deep-teal)) 100%)"
        : "rgb(var(--card))",
    color: filterTab === tab ? "white" : "rgb(var(--muted-foreground))",
    cursor: "pointer",
    fontWeight: filterTab === tab ? "bold" : "normal",
    transition: "all 0.3s",
  });

  return (
    <div className="section-container">
      <div className="hero-section">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hero-title"
        >
          Discover Your Next
          <span className="hero-title-gradient"> Favorite Sound</span>
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

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {errorMessage && (
        <div className="no-results">
          <p>{errorMessage}</p>
        </div>
      )}

      {isSearching && (
        <div className="loading">
          <p>Searching...</p>
        </div>
      )}

      {hasSearched &&
        !isSearching &&
        (musicResults.length > 0 || podcastResults.length > 0) && (
          <div className="search-results">
            <h2>Results</h2>

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
                style={tabStyle("all")}
              >
                All ({allResults.length})
              </button>
              <button
                onClick={() => setFilterTab("music")}
                style={tabStyle("music")}
              >
                🎵 Music ({musicResults.length})
              </button>
              <button
                onClick={() => setFilterTab("podcasts")}
                style={tabStyle("podcasts")}
              >
                🎙️ Podcasts ({podcastResults.length})
              </button>
            </div>

            {tabFilteredResults.length === 0 ? (
              <div className="no-results">
                <p>
                  No {filterTab === "all" ? "" : filterTab} results in this
                  category.
                </p>
              </div>
            ) : (
              <div className="results-grid">
                {tabFilteredResults.map((item) => (
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

      {hasSearched &&
        !isSearching &&
        musicResults.length === 0 &&
        podcastResults.length === 0 && (
          <div className="no-results">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
    </div>
  );
}
