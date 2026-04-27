# Loads the podcast CSV dataset
import pandas as pd

def load_podcast_data(filename):
    df = pd.read_csv(filename)
    return df
