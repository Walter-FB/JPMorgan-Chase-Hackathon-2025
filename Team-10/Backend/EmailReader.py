#!/usr/bin/env python3
"""
email_reader.py

Lee el correo más reciente de Gmail (IMAP) cuyo asunto contenga “Denuncia”,
carga credenciales desde .env, extrae y guarda imágenes adjuntas en `images/`,
construye un prompt con Fecha, Remitente y Texto, lo imprime y guarda en prompt.txt.
"""

import os
import sys
import imaplib
import re
import imghdr
from email.parser import BytesParser
from email.policy import default
from email.header import decode_header
from dotenv import load_dotenv

# 1) Carga variables de entorno
load_dotenv()

IMAP_HOST   = os.getenv("IMAP_HOST")
IMAP_PORT   = int(os.getenv("IMAP_PORT", 993))
USER        = os.getenv("IMAP_USER")
PASSWORD    = os.getenv("IMAP_PASS")
IMAGE_DIR   = "./Backend/images"
PROMPT_FILE = "./Backend/prompt.txt"

if not all([IMAP_HOST, IMAP_PORT, USER, PASSWORD]):
    print("❌ Faltan variables en .env (IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS).")
    sys.exit(1)

os.makedirs(IMAGE_DIR, exist_ok=True)

def connect_imap(host: str, port: int, user: str, password: str):
    try:
        mail = imaplib.IMAP4_SSL(host, port)
        mail.login(user, password)
        return mail
    except imaplib.IMAP4.error as e:
        print(f"❌ Error de autenticación IMAP: {e}")
        sys.exit(1)

def fetch_denuncia_message_id(mail, folder="INBOX"):
    """
    Busca en la carpeta todos los mensajes cuyo Asunto contenga "Denuncia"
    y devuelve el ID del más reciente.
    """
    mail.select(folder)
    # BUSCA correos cuyo SUBJECT contenga la palabra Denuncia
    status, data = mail.search(None, '(SUBJECT "Denuncia")')
    if status != 'OK':
        print("❌ Error al buscar correos con asunto 'Denuncia'.")
        sys.exit(1)
    ids = data[0].split()
    if not ids:
        print("ℹ️ No se encontró ningún correo con asunto que contenga 'Denuncia'.")
        sys.exit(0)
    return ids[-1]  # el más reciente

def strip_html(html: str) -> str:
    text = re.sub(r'<[^>]+>', '', html)
    return re.sub(r'\s+\n', '\n', text).strip()

def save_image_attachments(msg, msg_id):
    saved = []
    for part in msg.walk():
        if part.get_content_maintype() == "image":
            payload = part.get_payload(decode=True)
            ext = imghdr.what(None, h=payload) or part.get_content_subtype()
            filename = f"{msg_id.decode()}_{len(saved)+1}.{ext}"
            path = os.path.join(IMAGE_DIR, filename)
            with open(path, "wb") as f:
                f.write(payload)
            saved.append(path)
    return saved

def parse_message(raw_bytes: bytes) -> dict:
    msg = BytesParser(policy=default).parsebytes(raw_bytes)
    subj, encoding = decode_header(msg['Subject'])[0]
    subj = subj.decode(encoding or 'utf-8', errors='ignore') if isinstance(subj, bytes) else subj
    sender = msg.get('From')
    date   = msg.get('Date')
    body = ""
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype == 'text/plain' and not body:
            body = part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8', errors='ignore')
        elif ctype == 'text/html' and not body:
            html = part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8', errors='ignore')
            body = strip_html(html)
    return {'subject': subj, 'from': sender, 'date': date, 'body': body, 'raw_msg': msg}

def build_prompt(email_data: dict, images: list) -> str:
    prompt = (
        f"Fecha: {email_data['date']}\n"
        f"De: {email_data['from']}\n\n"
        f"{email_data['body']}"
    )
    if images:
        prompt += "\n\nImágenes guardadas en:\n" + "\n".join(images)
    return prompt

def main():
    mail = connect_imap(IMAP_HOST, IMAP_PORT, USER, PASSWORD)
    msg_id = fetch_denuncia_message_id(mail)

    status, fetched = mail.fetch(msg_id, '(RFC822)')
    if status != 'OK':
        print(f"❌ Error al descargar el mensaje {msg_id.decode()}.")
        sys.exit(1)

    parsed      = parse_message(fetched[0][1])
    images      = save_image_attachments(parsed['raw_msg'], msg_id)
    prompt_text = build_prompt(parsed, images)

    # Guardar prompt en archivo
    with open(PROMPT_FILE, "w", encoding="utf-8") as f:
        f.write(prompt_text)

    mail.logout()
    return prompt_text

if __name__ == "__main__":
    prompt = main()
    print(f"✅ Prompt guardado en {PROMPT_FILE}\n")
    print(prompt)
