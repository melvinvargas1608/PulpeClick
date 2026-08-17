"""
Generador de código QR para catálogos de PulpeClick (versión simple).

Solo edita la URL y los valores de configuración abajo, luego
corre el script directo con el botón ▶️ (Code Runner) o con:
    python generar_qr_simple.py
"""

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H

# ============================================================
# 🎨 CONFIGURACIÓN — edita estos valores para cada tienda
# ============================================================

# URL completa del catálogo de la tienda
# Ejemplo: https://pulpe-click.vercel.app/catalogo/nombre-de-tienda
URL = "https://pulpe-click.vercel.app/catalogo/tu-tienda"

# Nombre del archivo PNG que se va a generar
NOMBRE_ARCHIVO = "qr_tu-tienda.png"

# Color del QR (nombre o código hex, ej: "#0d6b4f")
COLOR = "black"

# Color de fondo (nombre o código hex)
FONDO = "white"

# Tamaño/resolución del QR (box_size):
#   10 -> ~410x410 px  (tarjetas, etiquetas pequeñas)
#   20 -> ~820x820 px  (empaques, volantes)
#   40 -> ~1640x1640 px (afiches, impresión grande)
TAMANO = 10

# Resolución de impresión (DPI) guardada en el PNG.
# 300 es el estándar para impresión nítida.
DPI = 300

# ============================================================
# No es necesario editar nada debajo de esta línea
# ============================================================

os.makedirs("qr_tiendas", exist_ok=True)
salida = os.path.join("qr_tiendas", NOMBRE_ARCHIVO)

qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_H,
    box_size=TAMANO,
    border=4,
)
qr.add_data(URL)
qr.make(fit=True)

imagen = qr.make_image(fill_color=COLOR, back_color=FONDO).convert("RGB")
imagen.save(salida, dpi=(DPI, DPI))

print(f"QR generado: {salida}")
print(f"Enlace: {URL}")