// About page describes the project's recommendation algorithms
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-section"
    >
      <div className="about-header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="about-title"
        >
          About Music Recommender
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="about-description"
        >
          A hybrid recommendation system for music and podcasts, built for CPSC
          491.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            background: "rgb(var(--card))",
            borderRadius: "16px",
            padding: "1.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              color: "rgb(var(--muted-foreground))",
              marginBottom: "1.25rem",
              lineHeight: 1.7,
            }}
          >
            Every recommendation blends two independent signals you control the
            balance with the slider on the Recommendations page.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "rgb(var(--background))",
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Content-Based
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgb(var(--muted-foreground))",
                  lineHeight: 1.6,
                }}
              >
                Finds music and podcasts based on their characteristics. For
                music, we analyze audio features like energy and tempo. For
                podcasts, we compare description text to find similar shows.
              </p>
            </div>
            <div
              style={{
                background: "rgb(var(--background))",
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Collaborative Filtering
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgb(var(--muted-foreground))",
                  lineHeight: 1.6,
                }}
              >
                Finds listeners with similar taste to yours and recommends what
                they enjoyed. This can surface unexpected recommendations that
                don't obviously match what you already like.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgb(var(--card))",
            borderRadius: "16px",
            padding: "1.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Music → Podcast Discovery
          </h2>
          <p style={{ color: "rgb(var(--muted-foreground))", lineHeight: 1.7 }}>
            The system can recommend podcasts based on your music preferences.
            It analyzes the energy, tempo, and brightness of songs you like,
            then suggests podcast categories that match that listening mood.
            High-energy music points toward Sports and Comedy; slow, dark music
            toward True Crime and History.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
