import pickle
from pathlib import Path

# Save dataset inside backend folder
DATASET_FILE = Path(__file__).parent / "song_dataset.pkl"


def load_dataset():
    if DATASET_FILE.exists():
        with open(DATASET_FILE, "rb") as f:
            dataset = pickle.load(f)
        print("Dataset loaded")
        return dataset
    else:
        return []


def save_dataset(dataset):
    with open(DATASET_FILE, "wb") as f:
        pickle.dump(dataset, f)
    print("Dataset saved")