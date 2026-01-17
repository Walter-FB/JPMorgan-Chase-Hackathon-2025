#!/usr/bin/env python
"""
Script para corregir las rutas de las imágenes en los archivos JSON
"""
import os
import json
import re

def corregir_rutas_imagenes():
    """
    Corrige las rutas de las imágenes en todos los archivos JSON de la carpeta casos_procesados
    """
    print("Corrigiendo rutas de imágenes en archivos JSON...")
    
    # Directorio donde se encuentran los archivos JSON
    directorio = "casos_procesados"
    
    # Listar todas las imágenes disponibles en static/img
    imagenes_disponibles = []
    try:
        for archivo in os.listdir("static/img"):
            if archivo.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                imagenes_disponibles.append(archivo)
        print(f"Imágenes disponibles: {imagenes_disponibles}")
    except Exception as e:
        print(f"Error al listar imágenes: {e}")
    
    # Procesar cada archivo JSON
    for archivo in os.listdir(directorio):
        if archivo.endswith(".json"):
            ruta_archivo = os.path.join(directorio, archivo)
            print(f"Procesando archivo: {ruta_archivo}")
            
            try:
                # Leer el archivo JSON
                with open(ruta_archivo, "r", encoding="utf-8") as f:
                    datos = json.load(f)
                
                # Corregir la ruta de la imagen principal - SIEMPRE usar /static/img/
                if "foto" in datos and datos["foto"]:
                    ruta_original = datos["foto"]
                    # Extraer el nombre del archivo de la ruta
                    nombre_archivo = os.path.basename(ruta_original)
                    
                    # Siempre usar la ruta /static/img/ sin verificar si existe
                    nueva_ruta = f"/static/img/{nombre_archivo}"
                    print(f"  Corrigiendo ruta de imagen principal: {ruta_original} -> {nueva_ruta}")
                    datos["foto"] = nueva_ruta
                
                # Corregir las rutas de las imágenes adicionales - SIEMPRE usar /static/img/
                if "adjuntos_extra" in datos and isinstance(datos["adjuntos_extra"], list):
                    nuevos_adjuntos = []
                    for i, adjunto in enumerate(datos["adjuntos_extra"]):
                        # Extraer el nombre del archivo de la ruta
                        nombre_archivo = os.path.basename(adjunto)
                        
                        # Siempre usar la ruta /static/img/ sin verificar si existe
                        nueva_ruta = f"/static/img/{nombre_archivo}"
                        print(f"  Corrigiendo ruta de adjunto {i+1}: {adjunto} -> {nueva_ruta}")
                        nuevos_adjuntos.append(nueva_ruta)
                    
                    datos["adjuntos_extra"] = nuevos_adjuntos
                
                # Guardar los cambios
                with open(ruta_archivo, "w", encoding="utf-8") as f:
                    json.dump(datos, f, ensure_ascii=False, indent=2)
                
                print(f"  Archivo {ruta_archivo} actualizado correctamente")
            
            except Exception as e:
                print(f"  Error al procesar archivo {ruta_archivo}: {e}")
    
    print("Proceso completado.")

if __name__ == "__main__":
    corregir_rutas_imagenes() 