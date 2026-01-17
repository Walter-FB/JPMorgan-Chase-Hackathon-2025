import os
import json
import openai
from dotenv import load_dotenv

load_dotenv()

def analyze_denuncia_report(file_path: str) -> dict:
    # Carga la API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("Falta configurar la variable de entorno OPENAI_API_KEY")
    openai.api_key = api_key

    # Lee el contenido de la denuncia
    with open(file_path, 'r', encoding='utf-8') as f:
        report_content = f.read()

    # Prompt que obliga a devolver un JSON con campos fijos
    system_prompt = (
        "Eres un asistente especializado en bienestar animal. "
        "Recibirás un reporte textual de un caso de abandono/maltrato animal. "
        "Analiza el caso y devuelve **solo** un JSON con estas claves:\n"
        "  - estado_categorizado: uno de ['Crítico','Precario','Estable']\n"
        "  - nivel_peligro: uno de ['Alto','Medio','Bajo']\n"
        "  - resumen: breve texto con los hallazgos principales\n"
        "  - recomendaciones: lista de frases con pasos a seguir\n\n"
        "Si no pudieras determinar alguna clave, pon su valor como \"Desconocido\".\n"
        "Ejemplo de salida:\n"
        "```json\n"
        "{\n"
        "  \"estado_categorizado\": \"Precario\",\n"
        "  \"nivel_peligro\": \"Medio\",\n"
        "  \"resumen\": \"El perro presenta delgadez moderada pero sin heridas visibles...\",\n"
        "  \"recomendaciones\": [\n"
        "    \"Ofrecer alimento energético de inmediato.\",\n"
        "    \"Llevar a una revisión veterinaria en 24 h.\"\n"
        "  ]\n"
        "}\n"
        "```"
    )

    # Llamada a la API
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            { "role": "system", "content": system_prompt },
            { "role": "user",   "content": report_content }
        ],
        temperature=0.0,
        max_tokens=500
    )
    raw = response.choices[0].message.content.strip()

    # Intentamos parsear el JSON
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # Si falla, devolvemos todo como resumen y marcamos el resto como desconocido
        result = {
            "estado_categorizado": "Desconocido",
            "nivel_peligro":       "Desconocido",
            "resumen":             raw,
            "recomendaciones":     ["Desconocido"]
        }

    # Asegurarnos de que todas las claves existan
    for key in ("estado_categorizado", "nivel_peligro", "resumen", "recomendaciones"):
        if key not in result:
            result[key] = "Desconocido" if key != "recomendaciones" else ["Desconocido"]

    return result


if __name__ == "__main__":
    # salida = analyze_denuncia_report("prompt.txt")
    # Ahora `salida` es un dict con las claves fijas
    salida = {
    "estado_categorizado": "Precario",
    "nivel_peligro": "Medio",
    "resumen": "El perro presenta delgadez moderada pero sin heridas visibles. Está asustado, ofrece riesgo de hipotermia.",
    "recomendaciones": [
        "Ofrecer alimento energético de inmediato.",
        "Verificar estado de hidratación.",
        "Llevar a una revisión veterinaria en 24 h."
    ]
}
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.normpath(os.path.join(current_dir, '../frontend/src/db/'))
    os.makedirs(output_dir, exist_ok=True)

    # Nombre de archivo (puedes ajustar según necesites)
    output_file = os.path.join(output_dir, 'analisis_denuncia.json')

    # Escribir JSON al archivo
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(salida, f, ensure_ascii=False, indent=2)

    print(f'Análisis guardado en: {output_file}')
