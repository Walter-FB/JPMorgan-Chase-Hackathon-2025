import json
import os
import re
from datetime import datetime
from openai import OpenAI
import dotenv
import codecs

# API Key de OpenAI (definida directamente para evitar problemas de codificación con .env)
API_KEY = ""
cliente = OpenAI(api_key=API_KEY)

def procesar_correo(contenido_correo, asunto="", archivos_adjuntos=None, prompt_texto=None):
    """
    Procesa un correo electrónico y lo estandariza utilizando GPT-4
    Args:
        contenido_correo: Texto del correo
        asunto: Asunto del correo
        archivos_adjuntos: Lista de archivos adjuntos (URLs o rutas)
        prompt_texto: Texto del prompt a utilizar (extraído de prompt.txt)
    """
    if not archivos_adjuntos:
        archivos_adjuntos = []
    
    # Combinar asunto y contenido
    texto_completo = f"Asunto: {asunto}\n\nContenido:\n{contenido_correo}"
    
    # Procesar con GPT-4
    datos = procesar_con_gpt4(texto_completo, archivos_adjuntos, prompt_texto)
    
    # Procesar adjuntos si no se detectaron en GPT-4
    if archivos_adjuntos and not datos.get("foto"):
        for adjunto in archivos_adjuntos:
            if adjunto.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                foto_relativa = os.path.basename(adjunto)
                datos["foto"] = f"/static/images/{foto_relativa}"
                break
    
    return datos

def procesar_con_gpt4(texto, archivos_adjuntos, prompt_texto=None):
    """Procesa el texto usando GPT-4 para estandarizar la información"""
    # Si no se proporciona un texto de prompt, utilizar el predeterminado
    if not prompt_texto:
        print("Usando prompt predeterminado")
        prompt = f"""
        Analiza el siguiente correo electrónico sobre un animal que necesita ayuda y extrae los datos solicitados.
        Si el texto está en otro idioma, primero tradúcelo al español. El mensaje puede estar incompleto o mal redactado, extrae lo que puedas:

        - Descripción (una frase concisa de 3-9 palabras que resuma la situación, por ejemplo: "Perro maltratado con heridas graves")
        - Especie y raza aproximada (perro, gato, mestizo, pitbull, etc.)
        - Sexo (macho / hembra / desconocido)
        - Edad estimada (cachorro, adulto, senior, o en meses/años si está especificado)
        - Ubicación precisa (barrio + ciudad + referencia)
        - Contacto del reportante (nombre, teléfono, email o usuario)
        - Daños visibles (fractura, sangrado, dificultad respiratoria, desnutrición, etc.)
        - Estado general (MÁXIMO 5 PALABRAS que describan SOLO su condición de salud: desnutrido / herido / maltratado / fracturado / deshidratado / etc. NO mencionar si está vivo o alerta ya que se asume que siempre lo está)
        - Contexto/Alerta de peligro (maltrato activo, calle transitada, zona inundada, etc.)
        - Número de animales involucrados (si reportan más de uno)
        - Estado del caso (rescate / denuncia / adopción / pérdida / otro)

        Asigna una prioridad (alta / media / baja) basada en estas reglas:
        - ALTA: Casos con riesgo de vida (heridas graves, atropellados, envenenamiento), cachorros muy pequeños o animales en situación de extremo peligro
        - MEDIA: Animales callejeros, en situación de abandono o con problemas de salud no urgentes
        - BAJA: Casos sin riesgo inmediato, adopciones, reubicaciones o consultas generales

        Para el estado del caso, determina:
        - DENUNCIA: Si se reporta maltrato animal, negligencia o abuso por parte de personas
        - RESCATE: Si se trata de un animal que necesita ser rescatado de la calle o situación de peligro
        - ADOPCIÓN: Si se busca dar en adopción o encontrar hogar para un animal
        - PÉRDIDA: Si se reporta un animal perdido o extraviado
        - OTRO: Para cualquier otro tipo de caso

        Si algún dato no está disponible en el correo, dedúcelo en base al contexto o marca como "No especificado".

        Presenta la información en formato JSON siguiendo esta estructura:
        {{
          "nombre": "",
          "foto": "",
          "especie_raza": "",
          "sexo": "",
          "edad": "",
          "ubicacion": "",
          "contacto": "",
          "prioridad": "",
          "danos_visibles": "",
          "estado_general": "",
          "contexto_peligro": "",
          "num_animales": 1,
          "estado_caso": "",
          "adjuntos_extra": [],
          "fecha_reporte": "{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}"
        }}

        Correo a analizar:
        {texto}
        """
    else:
        # Usar el prompt proporcionado desde prompt.txt y agregar la fecha actual y el texto del correo
        print(f"Usando prompt desde prompt.txt. Primeras 50 caracteres: {prompt_texto[:50]}...")
        prompt = f"""
        {prompt_texto}

        Presenta la información en formato JSON siguiendo esta estructura:
        {{
          "nombre": "",
          "foto": "",
          "especie_raza": "",
          "sexo": "",
          "edad": "",
          "ubicacion": "",
          "contacto": "",
          "prioridad": "",
          "danos_visibles": "",
          "estado_general": "",
          "contexto_peligro": "",
          "num_animales": 1,
          "estado_caso": "",
          "adjuntos_extra": [],
          "fecha_reporte": "{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}"
        }}

        Correo a analizar:
        {texto}
        """

    try:
        # Llamada a GPT-4 sin especificar formato JSON para evitar errores
        respuesta = cliente.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un especialista en rescate animal que extrae información crucial de correos sobre animales en peligro. Para el campo 'nombre', crea una descripción concisa de 3-9 palabras que resuma la situación. Para 'estado_general', usa máximo 5 palabras."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        # Obtener la respuesta del modelo
        resultado = respuesta.choices[0].message.content
        
        try:
            # Intentar cargar el JSON de la respuesta
            # Primero, intentamos encontrar el JSON dentro del texto si hay texto adicional
            json_match = re.search(r'({.*})', resultado, re.DOTALL)
            if json_match:
                resultado = json_match.group(1)
            
            datos = json.loads(resultado)
            
            # Asegurar que el nombre sea una descripción concisa de 3-9 palabras
            if datos.get("nombre"):
                palabras = datos["nombre"].split()
                if len(palabras) < 3:
                    # Si es muy corto, intentar generar una descripción más completa
                    datos["nombre"] = f"{datos.get('especie_raza', 'Animal')} {datos.get('estado_general', 'reportado')}"
                elif len(palabras) > 9:
                    # Si es muy largo, acortarlo a 9 palabras
                    datos["nombre"] = " ".join(palabras[:9])
            
            # Asegurar que el estado general tenga máximo 5 palabras
            if datos.get("estado_general"):
                palabras = datos["estado_general"].split()
                if len(palabras) > 5:
                    datos["estado_general"] = " ".join(palabras[:5])
            
        except json.JSONDecodeError:
            print("Error al decodificar JSON de GPT-4. Usando formato manual.")
            # Si falla, extraer la información manualmente con expresiones regulares
            datos = extraer_datos_con_regex(resultado)
        
        # Validaciones y ajustes adicionales
        campos_requeridos = ["nombre", "foto", "especie_raza", "sexo", "edad", "ubicacion", 
                            "contacto", "prioridad", "danos_visibles", "estado_general", 
                            "contexto_peligro", "num_animales", "estado_caso", "adjuntos_extra", "fecha_reporte"]
        
        for campo in campos_requeridos:
            if campo not in datos:
                datos[campo] = "" if campo != "adjuntos_extra" and campo != "num_animales" else ([] if campo == "adjuntos_extra" else 1)
        
        # Asegurar que adjuntos_extra sea siempre una lista
        if not isinstance(datos["adjuntos_extra"], list):
            datos["adjuntos_extra"] = [datos["adjuntos_extra"]] if datos["adjuntos_extra"] else []
        
        # Añadir adjuntos que no sean la foto principal
        if archivos_adjuntos:
            for adjunto in archivos_adjuntos:
                if adjunto != datos.get("foto") and adjunto not in datos.get("adjuntos_extra", []):
                    datos["adjuntos_extra"].append(adjunto)
        
        return datos
    
    except Exception as e:
        print(f"Error al procesar con GPT-4: {e}")
        # Retorna un objeto básico en caso de error
        return crear_datos_por_defecto(archivos_adjuntos, texto)

def extraer_datos_con_regex(texto):
    """Extrae datos usando expresiones regulares como respaldo si falla JSON"""
    datos = {
        "nombre": extraer_campo(texto, r"nombre[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "foto": "",
        "especie_raza": extraer_campo(texto, r"especie_raza[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "sexo": extraer_campo(texto, r"sexo[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "edad": extraer_campo(texto, r"edad[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "ubicacion": extraer_campo(texto, r"ubicacion[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "contacto": extraer_campo(texto, r"contacto[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "prioridad": extraer_campo(texto, r"prioridad[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "danos_visibles": extraer_campo(texto, r"danos_visibles[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "estado_general": extraer_campo(texto, r"estado_general[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "contexto_peligro": extraer_campo(texto, r"contexto_peligro[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "estado_caso": extraer_campo(texto, r"estado_caso[\"']?\s*:\s*[\"']([^\"']+)[\"']"),
        "num_animales": 1,
        "adjuntos_extra": [],
        "fecha_reporte": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Determinar prioridad si no se encontró
    if not datos["prioridad"]:
        datos["prioridad"] = "media"  # Prioridad por defecto
    
    # Determinar estado_caso si no se encontró
    if not datos["estado_caso"]:
        datos["estado_caso"] = "rescate"  # Estado por defecto
    
    return datos

def extraer_campo(texto, patron):
    """Extrae un campo usando una expresión regular"""
    match = re.search(patron, texto, re.IGNORECASE)
    return match.group(1) if match else "No especificado"

def crear_datos_por_defecto(archivos_adjuntos, texto_original):
    """Crea un objeto de datos por defecto en caso de error"""
    # Extraer algunas partes básicas del texto original
    lines = texto_original.split("\n")
    asunto = ""
    contenido = texto_original
    
    for line in lines:
        if line.startswith("Asunto:"):
            asunto = line.replace("Asunto:", "").strip()
            break
    
    # Intentar determinar nombre del animal desde el asunto
    nombre = "Animal sin identificar"
    if "perro" in asunto.lower():
        nombre = "Perro " + asunto.lower().split("perro")[1].strip()
    elif "gato" in asunto.lower():
        nombre = "Gato " + asunto.lower().split("gato")[1].strip()
    elif "beagle" in asunto.lower():
        nombre = "Beagle " + (asunto.lower().split("beagle")[1].strip() if len(asunto.lower().split("beagle")) > 1 else "")
    
    # Usar la primera imagen adjunta como foto principal
    foto = ""
    adjuntos_extra = []
    
    if archivos_adjuntos:
        for adjunto in archivos_adjuntos:
            if adjunto.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                if not foto:
                    foto = adjunto
                else:
                    adjuntos_extra.append(adjunto)
    
    # Intentar determinar el estado del caso
    estado_caso = "rescate"  # Por defecto
    if "maltrato" in texto_original.lower() or "denuncia" in texto_original.lower():
        estado_caso = "denuncia"
    elif "adopción" in texto_original.lower() or "adopcion" in texto_original.lower():
        estado_caso = "adopción"
    elif "perdido" in texto_original.lower() or "extraviado" in texto_original.lower():
        estado_caso = "pérdida"
    
    return {
        "nombre": nombre.strip(),
        "foto": foto,
        "especie_raza": "No especificado",
        "sexo": "No especificado",
        "edad": "No especificado",
        "ubicacion": "No especificado",
        "contacto": "No especificado",
        "prioridad": "media",  # Por defecto asignamos prioridad media ante dudas
        "danos_visibles": "No especificado",
        "estado_general": "No especificado",
        "contexto_peligro": "No especificado",
        "estado_caso": estado_caso,
        "num_animales": 1,
        "adjuntos_extra": adjuntos_extra,
        "fecha_reporte": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def guardar_caso(datos_estandarizados, correo_original, id_correo=None):
    """
    Guarda el caso procesado en un archivo JSON
    Args:
        datos_estandarizados: Diccionario con los datos estandarizados
        correo_original: Texto original del correo
        id_correo: Identificador único del correo
    """
    # Crear directorio si no existe
    directorio = "casos_procesados"
    if not os.path.exists(directorio):
        os.makedirs(directorio)
    
    # Generar ID si no se proporciona
    if not id_correo:
        id_correo = f"caso_{int(datetime.now().timestamp())}"
    
    # Agregar el correo original a los datos
    datos_completos = datos_estandarizados.copy()
    datos_completos["correo_original"] = correo_original
    datos_completos["id"] = id_correo
    
    # Obtener el nombre del caso para usarlo en el nombre del archivo
    nombre_caso = datos_estandarizados.get("nombre", "").strip()
    if nombre_caso:
        # Convertir el nombre a un formato seguro para nombre de archivo
        nombre_archivo = nombre_caso.lower()
        nombre_archivo = re.sub(r'[^a-z0-9]+', '_', nombre_archivo)  # Reemplazar caracteres no alfanuméricos con guiones bajos
        nombre_archivo = re.sub(r'_+', '_', nombre_archivo)  # Reemplazar múltiples guiones bajos con uno solo
        nombre_archivo = nombre_archivo.strip('_')  # Eliminar guiones bajos al inicio y final
        
        # Limitar la longitud del nombre para evitar nombres de archivo demasiado largos
        if len(nombre_archivo) > 50:
            nombre_archivo = nombre_archivo[:50]
        
        # Crear el nombre del archivo con el ID y el nombre del caso
        nombre_archivo = f"{id_correo}_{nombre_archivo}.json"
    else:
        # Si no hay nombre, usar solo el ID
        nombre_archivo = f"{id_correo}.json"
    
    # Guardar como JSON
    ruta_archivo = f"{directorio}/{nombre_archivo}"
    with open(ruta_archivo, "w", encoding="utf-8") as f:
        json.dump(datos_completos, ensure_ascii=False, indent=2, fp=f)
    
    print(f"Caso guardado con nombre de archivo: {nombre_archivo}")
    return ruta_archivo

def obtener_casos_procesados():
    """Obtiene todos los casos procesados de la carpeta"""
    directorio = "casos_procesados"
    if not os.path.exists(directorio):
        return []
    
    casos = []
    for archivo in os.listdir(directorio):
        if archivo.endswith(".json"):
            try:
                with open(f"{directorio}/{archivo}", "r", encoding="utf-8") as f:
                    caso = json.load(f)
                    casos.append(caso)
            except Exception as e:
                print(f"Error al cargar caso {archivo}: {e}")
    
    # Ordenar por prioridad y fecha
    def clave_ordenamiento(caso):
        prioridad_valor = {"alta": 1, "media": 2, "baja": 3}.get(caso.get("prioridad", "").lower(), 4)
        fecha = caso.get("fecha_reporte", "")
        return (prioridad_valor, fecha)
    
    return sorted(casos, key=clave_ordenamiento)

# Prueba del módulo
if __name__ == "__main__":
    # Ejemplo de correo
    correo_ejemplo = """
    Hola, les escribo porque encontré un perro labrador herido en la calle San Martín y Rivadavia, 
    en el barrio de Villa Crespo. Tiene una pata trasera lastimada y está sangrando un poco.
    Parece ser un adulto joven, macho, color dorado. Está asustado pero no es agresivo.
    Por favor ayuden, la calle es muy transitada y temo que lo atropellen.
    Mi nombre es Juan Pérez, pueden contactarme al 1155667788 o juanperez@mail.com
    """
    
    # Procesar el correo de ejemplo
    resultado = procesar_correo(correo_ejemplo, "Perro herido en Villa Crespo")
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
    
    # Guardar el caso
    ruta = guardar_caso(resultado, correo_ejemplo)
    print(f"Caso guardado en: {ruta}") 