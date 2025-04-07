import pyttsx3

engine = pyttsx3.init()

def speech_gen(text):
    engine.setProperty('rate', 150)
    engine.setProperty('volume', 1)
    engine.say(text)
    engine.runAndWait()


