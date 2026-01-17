#!/usr/bin/env python
"""
Script que vigila el archivo mail.txt buscando correos nuevos 
y los procesa utilizando GPT-4 para estandarizarlos.
"""
import os
import time
import re
import shutil
import codecs
import traceback
from datetime import datetime
from proceso_datos import procesar_correo, guardar_caso

# Asegurarse de que se usa la lógica actualizada para el estado general
# El estado general ahora solo describe la condición de salud (máximo 5 palabras)
# sin mencionar si está vivo o alerta ya que se asume que siempre lo está

def leer_correo_de_txt():
    """
    Lee el correo del archivo mail.txt
    Si encuentra el formato con marcadores, lo procesa:
    # INICIO_CORREO: [identificador único]
    [contenido del correo]
    # FIN_CORREO
    
    Si no encuentra los marcadores, usa todo el contenido como correo
    """
    try:
        archivo_txt = "entradas/mail.txt"
        print(f"Intentando leer el archivo: {os.path.abspath(archivo_txt)}")
        
        if not os.path.exists(archivo_txt):
            print(f"ERROR: El archivo {archivo_txt} no existe en la carpeta 'entradas'.")
            return None
        
        # Intentar leer con distintas codificaciones
        contenido = None
        codificaciones = ['utf-8', 'latin-1', 'cp1252']
        
        for encoding in codificaciones:
            try:
                with codecs.open(archivo_txt, "r", encoding=encoding) as f:
                    contenido = f.read()
                print(f"Archivo leído con codificación: {encoding}")
                break
            except UnicodeDecodeError:
                print(f"No se pudo leer con codificación {encoding}")
                continue
            except Exception as e:
                print(f"Error inesperado al leer el archivo con codificación {encoding}: {str(e)}")
                continue
        
        if not contenido:
            print("ERROR: No se pudo leer el archivo con ninguna codificación")
            return None
        
        # Buscar correo en el formato con marcadores
        print("Buscando correo en el archivo...")
        patron = r'# INICIO_CORREO: ([^\n]+)\n(.*?)# FIN_CORREO'
        coincidencia = re.search(patron, contenido, re.DOTALL)
        
        if coincidencia:
            # Si encuentra el formato con marcadores, lo procesa normalmente
            print("Encontrado formato con marcadores")
            id_correo, contenido_correo = coincidencia.groups()
            print(f"Correo encontrado con ID: {id_correo}")
        else:
            # Si no encuentra los marcadores, usa todo el contenido como correo
            print("No se encontró formato con marcadores. Usando todo el contenido como correo.")
            contenido_correo = contenido
            # Generar un ID basado en la fecha actual
            id_correo = f"caso_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            print(f"ID generado automáticamente: {id_correo}")
        
        # Extraer asunto si existe
        asunto_match = re.search(r'Asunto: (.+)\n', contenido_correo)
        if asunto_match:
            asunto = asunto_match.group(1)
            print(f"Asunto del correo: {asunto}")
        else:
            # Si no hay asunto, intentar extraerlo de la primera línea no vacía
            lineas = contenido_correo.split('\n')
            asunto = "Sin asunto"
            for linea in lineas:
                if linea.strip() and not linea.startswith("De:") and not linea.startswith("Fecha:"):
                    asunto = linea.strip()[:50]  # Limitar a 50 caracteres
                    break
            print(f"Asunto extraído de contenido: {asunto}")
        
        # Buscar referencias a archivos adjuntos
        adjuntos = []
        adjuntos_match = re.findall(r'ADJUNTO: (.+)\n', contenido_correo)
        if adjuntos_match:
            print(f"Adjuntos encontrados: {len(adjuntos_match)}")
            for adjunto in adjuntos_match:
                adjunto_ruta = os.path.join("entradas", adjunto)
                print(f"Verificando adjunto: {adjunto_ruta}")
                # Comprobar si existe el archivo
                if os.path.exists(adjunto_ruta):
                    # Ya no movemos la imagen, simplemente la referenciamos
                    adjuntos.append(f"static/img/{os.path.basename(adjunto)}")
                    print(f"Referencia a imagen: {adjunto_ruta}")
                else:
                    print(f"Advertencia: No se encontró el archivo adjunto {adjunto_ruta}")
        else:
            print("No se encontraron adjuntos explícitos en el correo")
            
            # Buscar referencias a imágenes en el texto
            img_match = re.findall(r'\[image: ([^\]]+)\]', contenido_correo)
            if img_match:
                print(f"Referencias a imágenes encontradas en el texto: {len(img_match)}")
                for img in img_match:
                    adjuntos.append(f"static/img/{os.path.basename(img)}")
                    print(f"Referencia a imagen desde texto: {img}")
        
        return {
            "id": id_correo.strip(),
            "contenido": contenido_correo.strip(),
            "asunto": asunto,
            "adjuntos": adjuntos
        }
    
    except Exception as e:
        print(f"ERROR CRÍTICO al leer el archivo mail.txt: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc()
        return None

def procesar_correo_actual():
    """Procesa el correo actual en el archivo mail.txt"""
    try:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Leyendo correo del archivo mail.txt...")
        
        # Usar siempre el prompt predeterminado de proceso_datos.py
        prompt_contenido = None
        
        # Leer correo del archivo mail.txt
        correo = leer_correo_de_txt()
        
        if not correo:
            print("ERROR: No hay correo para procesar.")
            return None
        
        try:
            print(f"Procesando correo {correo['id']}...")
            print(f"Contenido del correo (primeras 100 caracteres): {correo['contenido'][:100]}...")
            
            # Procesar el correo con GPT-4, pasando None como prompt_texto para usar el predeterminado
            print("Llamando a procesar_correo()...")
            datos_estandarizados = procesar_correo(
                correo["contenido"], 
                correo["asunto"], 
                correo["adjuntos"],
                prompt_contenido  # Esto será None, lo que hará que se use el prompt predeterminado
            )
            
            print("Datos estandarizados obtenidos:")
            print(f"- Nombre: {datos_estandarizados.get('nombre', 'No disponible')}")
            print(f"- Prioridad: {datos_estandarizados.get('prioridad', 'No disponible')}")
            print(f"- Estado caso: {datos_estandarizados.get('estado_caso', 'No disponible')}")
            
            # Guardar el caso procesado
            print("Llamando a guardar_caso()...")
            ruta_archivo = guardar_caso(
                datos_estandarizados, 
                correo["contenido"], 
                correo["id"]
            )
            
            print(f"Correo {correo['id']} procesado correctamente y guardado en {ruta_archivo}")
            
            # Enviar señal de nuevo caso (archivo temporal para comunicación)
            with open("nuevo_caso.tmp", "w") as f:
                f.write(ruta_archivo)
            
            return ruta_archivo
        
        except Exception as e:
            print(f"ERROR al procesar correo {correo['id']}: {str(e)}")
            print("Traceback completo:")
            traceback.print_exc()
            return None
    
    except Exception as e:
        print(f"ERROR CRÍTICO en procesar_correo_actual: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc()
        return None

def vigilar_archivo_txt(intervalo=5, una_vez=False):
    """
    Vigila continuamente el archivo mail.txt buscando nuevos correos
    Args:
        intervalo: Tiempo en segundos entre cada verificación
        una_vez: Si es True, procesa solo una vez y termina
    """
    try:
        print(f"Iniciando vigilancia del archivo mail.txt cada {intervalo} segundos...")
        
        if una_vez:
            print("Ejecutando en modo una sola vez...")
            procesar_correo_actual()
            return
        
        # Última modificación del archivo
        ultima_mod = 0
        
        while True:
            try:
                if os.path.exists("entradas/mail.txt"):
                    # Verificar si el archivo ha sido modificado
                    mod_actual = os.path.getmtime("entradas/mail.txt")
                    if mod_actual > ultima_mod:
                        ultima_mod = mod_actual
                        procesar_correo_actual()
            except Exception as e:
                print(f"ERROR durante la vigilancia: {str(e)}")
                print("Traceback completo:")
                traceback.print_exc()
            
            time.sleep(intervalo)
    
    except Exception as e:
        print(f"ERROR CRÍTICO en vigilar_archivo_txt: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc()

# Crear archivo mail.txt de ejemplo si no existe
def crear_txt_ejemplo():
    """Crea un archivo mail.txt de ejemplo si no existe"""
    try:
        if not os.path.exists("entradas"):
            os.makedirs("entradas")
            print("Directorio 'entradas' creado.")
            
        if not os.path.exists("entradas/mail.txt"):
            contenido_ejemplo = """# Variables de entorno (No editar esta línea)

# ================================================================
# CORREO ACTUAL PARA PROCESAR (Reemplazar por el nuevo correo)
# ================================================================

# INICIO_CORREO: 20230501_001
Asunto: Beagle abandonado en Palermo
ADJUNTO: beagle.jpg

Hola, les escribo porque encontré un beagle abandonado en la plaza de Palermo (cerca de Av. Santa Fe y Bullrich).
Es macho, de aproximadamente 2-3 años, no tiene collar ni identificación. Está algo delgado pero no tiene heridas visibles.
Se deja acariciar y parece manso, aunque está asustado.
Lo encontré hoy temprano, está refugiado debajo de un banco de la plaza.
Por favor contáctenme si pueden ayudar: María González, 1145678900, mariagonzalez@email.com
# FIN_CORREO

# ================================================================
# INSTRUCCIONES:
# 1. Coloque la información del nuevo correo entre los marcadores INICIO_CORREO y FIN_CORREO
# 2. Asigne un ID único después de INICIO_CORREO
# 3. Incluya el asunto después de "Asunto:"
# 4. Si hay adjuntos, inclúyalos con "ADJUNTO:" seguido de la ruta
# 5. Al guardar este archivo, el sistema procesará automáticamente el correo
# ================================================================
"""
            with codecs.open("entradas/mail.txt", "w", encoding="utf-8") as f:
                f.write(contenido_ejemplo)
            print("Se ha creado un archivo mail.txt de ejemplo en la carpeta 'entradas'.")
    except Exception as e:
        print(f"ERROR al crear archivo mail.txt de ejemplo: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc()

# Crear archivo .env para la clave de GPT si no existe
def crear_env_para_clave():
    """Crea un archivo .env para la clave de GPT si no existe"""
    try:
        if not os.path.exists("entradas"):
            os.makedirs("entradas")
            
        if not os.path.exists("entradas/.env"):
            contenido_env = """# Variables de entorno para la API de OpenAI
OPENAI_API_KEY=
"""
            with codecs.open("entradas/.env", "w", encoding="utf-8") as f:
                f.write(contenido_env)
            print("Se ha creado un archivo .env para la clave de GPT en la carpeta 'entradas'.")
    except Exception as e:
        print(f"ERROR al crear archivo .env: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc()

if __name__ == "__main__":
    try:
        print("Iniciando watcher.py...")
        # Crear directorios necesarios si no existen
        for directorio in ["entradas", "static/img", "static/js", "casos_procesados"]:
            try:
                if not os.path.exists(directorio):
                    os.makedirs(directorio)
                    print(f"Directorio '{directorio}' creado.")
            except Exception as e:
                print(f"ERROR al crear directorio {directorio}: {str(e)}")
        
        # Crear archivos de ejemplo si no existen
        crear_txt_ejemplo()
        crear_env_para_clave()
        
        # Verificar si se debe ejecutar solo una vez
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == "--once":
            vigilar_archivo_txt(una_vez=True)
        else:
            # Iniciar vigilancia continua
            vigilar_archivo_txt()
    except Exception as e:
        print(f"ERROR CRÍTICO en el punto de entrada principal: {str(e)}")
        print("Traceback completo:")
        traceback.print_exc() 