from groq import Groq
import os
import re
import numpy as np
from dotenv import load_dotenv

load_dotenv(override=False)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_groq_response(messages, temperature=0.3):
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=temperature,
        max_tokens=2048
    )
    return response.choices[0].message.content

def generate_embedding(text: str) -> list:
    """Lightweight bag-of-words embedding using numpy. No torch required."""
    text = text.lower()
    words = re.findall(r'\b[a-z]{3,}\b', text)
    if not words:
        return [0.0] * 300

    # Build a simple word frequency vector hashed into 300 dims
    vec = np.zeros(300)
    for word in words:
        idx = hash(word) % 300
        vec[idx] += 1.0

    # Normalize
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm

    return vec.tolist()
