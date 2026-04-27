# Loads the podcast CSV dataset
import pandas as pd

def load_podcast_data(filename):
    # Keep this loader intentionally light: downstream recommenders expect the raw
    # iTunes-style columns (e.g. `show.name`, `show.publisher`, `show.description`).
    df = pd.read_csv(filename, low_memory=False)
    return df
