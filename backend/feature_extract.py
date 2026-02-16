# Librosa from https://github.com/librosa/librosa
# Using features from librosa for FCCs, timber, zcr, tempo, chroma, rms. Basically multiple features that librosa uses to extract from songs.
# Collaborative based approach where we're looking at song features, recommending similar songs to similar people.
from pathlib import Path
import librosa
import numpy as np

# Load audio file [fix this later but I will a sample a random song] [mp3 from ILLENIUM - Crashing (Official Video) ft. Bahari]
# Goal is that we are going to load a full folder/playlist/liked songs
# and extract all the features and store them for later recommending, instead of a single song like now.

BASE_DIR = Path(__file__).parent
file_path = BASE_DIR / "song.mp3"
y, sr = librosa.load(file_path, duration=60) # load first 60 seconds
print ("Song loaded")

# MFCCs (music terminology for power of a sound basically)
mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
mfccs_mean = np.mean(mfccs, axis=1)

# Spectral centroid (music's timber)
spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))

# Zero crossing rate
zcr = np.mean(librosa.feature.zero_crossing_rate(y))

# Tempo
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

# Chroma features (harmonic content)
chroma = librosa.feature.chroma_stft(y=y, sr=sr)
chroma_mean = np.mean(chroma, axis=1)

# RMS energy
rms = np.mean(librosa.feature.rms(y=y))

# Combine into feature vector
feature_vector = np.hstack([
    mfccs_mean,
    spectral_centroid,
    zcr,
    tempo,
    chroma_mean,
    rms
])

# Create feature names (same order as stacking). Just for the purpose of demonstration, this part will/can be ommitted later. 
# Important thing is that these values exist when we look at them and that the recommender algo will refer to the feature_vector later, not the _names.
# The next step would be making a simlarity metric where we would recommend songs with similar values that we have so far (and we could add more).
feature_names = (
    [f"mfcc_{i}" for i in range(13)] +
    ["spectral_centroid"] +
    ["zero_crossing_rate"] +
    ["tempo"] +
    [f"chroma_{i}" for i in range(12)] +
    ["rms_energy"]
)

# Print each feature with its value
print("\nFeature values:\n")

for name, value in zip(feature_names, feature_vector):
    print(f"{name}: {value:.4f}")

print("Feature vector shape:", feature_vector.shape)