from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv(override=False)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Lazy load the embedding model - don't load on startup
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model

def get_groq_response(messages, temperature=0.3):
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=temperature,
        max_tokens=2048
    )
    return response.choices[0].message.content

def generate_embedding(text):
    return get_embedding_model().encode(text).tolist()
