from pydub import AudioSegment

# Path to your input audio file
input_file = "./1.wav"

# Path to the output audio file
output_file = "./output1.wav"

# Load the audio file
audio = AudioSegment.from_file(input_file, format="wav")

# Convert to mono
audio = audio.set_channels(1)

# Set sample rate to 16 kHz
audio = audio.set_frame_rate(16000)

# Set sample width to 16 bits
audio = audio.set_sample_width(2)  # 16-bit PCM corresponds to 2 bytes per sample

# Export the fixed audio file
audio.export(output_file, format="wav")

print(f"Audio file converted successfully and saved as {output_file}")
