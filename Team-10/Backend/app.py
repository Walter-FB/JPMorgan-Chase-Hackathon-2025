from flask import Flask, render_template, jsonify, request, redirect, url_for
import os
import json
import time
from datetime import datetime
from proceso_datos import obtener_casos_procesados

app = Flask(__name__)

# Directorio para almacenar los casos procesados
DIRECTORIO_CASOS = "casos_procesados"

# Asegurar que el directorio existe
if not os.path.exists(DIRECTORIO_CASOS):
    os.makedirs(DIRECTORIO_CASOS)

@app.route('/')
def index():
    """Página principal que muestra todos los casos procesados"""
    return render_template('index.html')

@app.route('/api/casos')
def obtener_casos():
    """API para obtener los casos procesados en formato JSON"""
    casos = obtener_casos_procesados()
    return jsonify(casos)

@app.route('/api/caso/<id_caso>')
def obtener_caso(id_caso):
    """API para obtener un caso específico por su ID"""
    ruta_archivo = f"{DIRECTORIO_CASOS}/{id_caso}.json"
    
    if not os.path.exists(ruta_archivo):
        return jsonify({"error": "Caso no encontrado"}), 404
    
    try:
        with open(ruta_archivo, "r", encoding="utf-8") as f:
            caso = json.load(f)
        return jsonify(caso)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/actualizar-prioridad/<id_caso>', methods=['POST'])
def actualizar_prioridad(id_caso):
    """API para actualizar la prioridad de un caso"""
    ruta_archivo = f"{DIRECTORIO_CASOS}/{id_caso}.json"
    
    if not os.path.exists(ruta_archivo):
        return jsonify({"error": "Caso no encontrado"}), 404
    
    try:
        # Obtener datos de la solicitud
        datos = request.json
        nueva_prioridad = datos.get('prioridad')
        decision = datos.get('decision')
        
        if not nueva_prioridad or not decision:
            return jsonify({"error": "Faltan parámetros requeridos"}), 400
        
        # Cargar el caso actual
        with open(ruta_archivo, "r", encoding="utf-8") as f:
            caso = json.load(f)
        
        # Actualizar prioridad y decisión
        caso["prioridad"] = nueva_prioridad
        caso["decision"] = decision
        caso["fecha_decision"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        caso["usuario_decision"] = "voluntario"  # En un sistema real, se usaría la información del usuario autenticado
        
        # Guardar cambios
        with open(ruta_archivo, "w", encoding="utf-8") as f:
            json.dump(caso, f, ensure_ascii=False, indent=2)
        
        return jsonify({"success": True, "mensaje": "Prioridad actualizada correctamente"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/caso/<id_caso>')
def ver_caso(id_caso):
    """Página para ver un caso específico"""
    return render_template('caso.html', id_caso=id_caso)

@app.route('/verificar-nuevos')
def verificar_nuevos():
    """API para verificar si hay nuevos casos desde la última verificación"""
    try:
        # Obtener el timestamp y asegurarse de que sea un número válido
        ultima_verificacion = request.args.get('timestamp', '0')
        
        # Manejar valores no numéricos o NaN
        if ultima_verificacion == 'NaN' or not ultima_verificacion:
            ultima_verificacion = 0
        else:
            try:
                ultima_verificacion = float(ultima_verificacion)
                if ultima_verificacion != ultima_verificacion:  # Verificar NaN
                    ultima_verificacion = 0
            except (ValueError, TypeError):
                ultima_verificacion = 0
        
        # Verificar si hay archivos más recientes que última_verificacion
        casos = obtener_casos_procesados()
        casos_nuevos = []
        
        for caso in casos:
            if caso.get("fecha_reporte", ""):
                try:
                    fecha_caso = datetime.strptime(caso.get("fecha_reporte"), "%Y-%m-%d %H:%M:%S")
                    timestamp_caso = fecha_caso.timestamp()
                    
                    if timestamp_caso > ultima_verificacion:
                        casos_nuevos.append(caso)
                except (ValueError, TypeError):
                    # Si hay un error al procesar la fecha, ignorarlo
                    continue
        
        return jsonify({
            "hay_nuevos": len(casos_nuevos) > 0,
            "cantidad": len(casos_nuevos),
            "casos": casos_nuevos
        })
    
    except Exception as e:
        return jsonify({"error": str(e), "timestamp_recibido": request.args.get('timestamp', 'ninguno')}), 500

# Ejecutar la aplicación si este archivo es el principal
if __name__ == '__main__':
    # Crear carpetas necesarias si no existen
    if not os.path.exists("templates"):
        os.makedirs("templates")
    if not os.path.exists("static"):
        os.makedirs("static")
    if not os.path.exists("static/css"):
        os.makedirs("static/css")
    if not os.path.exists("static/js"):
        os.makedirs("static/js")
    if not os.path.exists("static/img"):
        os.makedirs("static/img")
    
    # Si no existen casos de ejemplo, ejecutar el watcher.py para procesar los ejemplos
    if len(os.listdir(DIRECTORIO_CASOS)) == 0:
        print("No se encontraron casos procesados. Ejecutando watcher.py para procesar ejemplos...")
        import subprocess
        # Ejecutar watcher.py una vez para procesar el mail.txt actual
        subprocess.Popen(["python", "watcher.py", "--once"])
    
    app.run(debug=True, port=5000) 