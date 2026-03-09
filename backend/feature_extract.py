import librosa
import numpy as np


def extract_features(file_path, duration=30):
    """
    Extract audio features from an audio file.
    Returns a numpy feature vector.
    """
    
    y, sr = librosa.load(file_path, duration=duration)

    # MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs, axis=1)

    # Spectral centroid
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))

    # Zero crossing rate
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))

    # Tempo
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # Chroma
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma, axis=1)

    # RMS
    rms = np.mean(librosa.feature.rms(y=y))

    feature_vector = np.hstack([
        mfccs_mean,
        spectral_centroid,
        zcr,
        tempo,
        chroma_mean,
        rms
    ])

    return feature_vector