import os
from dotenv import load_dotenv
import streamlit as st

# Intenta cargar variables de entorno desde .env si existe
try:
    load_dotenv()
except:
    print("No se pudo cargar el archivo .env, usando valores predeterminados")

# Configuración de OpenAI
# Para usar la aplicación completa, debes configurar tu API key
# en Streamlit Secrets, o en el archivo .env, o como variable de entorno
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or st.secrets.get("OPENAI_API_KEY", "")

# Configuración del correo - Estos valores se dejan vacíos para usar datos simulados
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME") or st.secrets.get("EMAIL_USERNAME", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD") or st.secrets.get("EMAIL_PASSWORD", "")
EMAIL_SERVER = os.getenv("EMAIL_SERVER") or st.secrets.get("EMAIL_SERVER", "imap.gmail.com")
EMAIL_FOLDER = os.getenv("EMAIL_FOLDER") or st.secrets.get("EMAIL_FOLDER", "INBOX")

# Modo simulación - Si es True, siempre se usarán datos simulados
# independientemente de si hay credenciales configuradas
MODO_SIMULACION = True

# Criterios para la priorización
CRITERIOS_PRIORIZACION = {
    "alta": [
        "herido", "grave", "sangrado", "accidente", "atropellado", "enfermo", "urgente", 
        "crítico", "muriendo", "cachorros", "maltrato severo", "veneno", "fractura",
        "abandonado en carretera", "sin comida", "sin agua", "condiciones extremas"
    ],
    "media": [
        "abandonado", "calle", "delgado", "desnutrido", "callejero", "maltrato",
        "hambriento", "embarazada", "cachorros mayores", "enfermedad leve", 
        "parasitado", "sarna", "anciano"
    ],
    "baja": [
        "adopción", "busca hogar", "entrega", "reubicación", "sociable", 
        "buena salud", "vacunado", "adulto sano", "sin urgencia"
    ]
} 