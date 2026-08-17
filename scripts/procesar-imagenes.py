import os
import io
import sys
import time
from PIL import Image, ImageOps
from rembg import remove, new_session
from tqdm import tqdm

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def redimensionar_a_cuadrado(imagen, tamano=1080, margen=0.10, fondo=(0, 0, 0, 0)):
    """
    Redimensiona una imagen para que quepa dentro de un lienzo cuadrado
    de tamano x tamano, dejando un margen alrededor, sin deformarla,
    y la centra sobre fondo transparente.

    margen: porcentaje de espacio libre alrededor del producto (0.10 = 10% por lado)
    """
    imagen = imagen.copy()

    area_util = int(tamano * (1 - margen * 2))
    imagen.thumbnail((area_util, area_util), Image.LANCZOS)

    lienzo = Image.new("RGBA", (tamano, tamano), fondo)
    x = (tamano - imagen.width) // 2
    y = (tamano - imagen.height) // 2
    lienzo.paste(imagen, (x, y), imagen)
    return lienzo


def optimizar_catalogo_productos(
    carpeta_fotos_originales,
    carpeta_fotos_web,
    calidad_webp=82,
    tamano_salida=1080,
    margen=0.10
):
    """
    Procesa las fotos de productos de una carpeta:
    1. Quita el fondo automáticamente con IA.
    2. Redimensiona a un lienzo cuadrado con margen, sin deformar.
    3. Guarda con fondo transparente en formato WebP optimizado para la web.
    """
    extensiones_validas = ('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif')

    if not os.path.exists(carpeta_fotos_originales):
        print(f"❌ La carpeta '{carpeta_fotos_originales}' no existe. Por favor verifícala.")
        return

    if os.path.abspath(carpeta_fotos_originales) == os.path.abspath(carpeta_fotos_web):
        print("❌ La carpeta de origen y destino no pueden ser la misma.")
        return

    os.makedirs(carpeta_fotos_web, exist_ok=True)

    imagenes = sorted(
        f for f in os.listdir(carpeta_fotos_originales)
        if f.lower().endswith(extensiones_validas)
        and os.path.isfile(os.path.join(carpeta_fotos_originales, f))
    )

    if not imagenes:
        print(f"⚠️ No se encontraron imágenes en '{carpeta_fotos_originales}'.")
        return

    # Detectar colisiones de nombre base (mismo nombre, distinta extensión)
    nombres_base = {}
    for f in imagenes:
        base = os.path.splitext(f)[0]
        nombres_base.setdefault(base, []).append(f)
    colisiones = {k: v for k, v in nombres_base.items() if len(v) > 1}

    print("=" * 60)
    print("🛍️  OPTIMIZADOR DE FOTOS PARA TIENDA WEB")
    print("=" * 60)
    print(f"📂 Carpeta de Origen:  {os.path.abspath(carpeta_fotos_originales)}")
    print(f"📂 Carpeta de Destino: {os.path.abspath(carpeta_fotos_web)}")
    print(f"🖼️  Fotos encontradas:  {len(imagenes)}")
    print(f"📐 Tamaño de salida:   {tamano_salida}x{tamano_salida} px (fondo transparente)")
    print(f"🔲 Margen alrededor:   {int(margen * 100)}%")
    print(f"⚙️  Formato de salida: WebP (Calidad: {calidad_webp}%)")
    if colisiones:
        print(f"⚠️  Atención: {len(colisiones)} nombre(s) repetido(s) con distinta extensión.")
        print("   Se renombrarán automáticamente para no sobrescribirse (ej: producto1__jpg.webp).")
    print("=" * 60 + "\n")

    try:
        session = new_session("u2net")
    except Exception as e:
        print(f"❌ No se pudo inicializar el modelo de IA (rembg): {e}")
        return

    exitosos = 0
    errores = 0
    tiempo_inicio = time.time()

    for nombre_archivo in tqdm(imagenes, desc="Procesando productos", unit="foto"):
        ruta_entrada = os.path.join(carpeta_fotos_originales, nombre_archivo)
        nombre_sin_extension, ext_original = os.path.splitext(nombre_archivo)

        if nombre_sin_extension in colisiones:
            nombre_salida = f"{nombre_sin_extension}__{ext_original.lstrip('.')}"
        else:
            nombre_salida = nombre_sin_extension

        ruta_salida = os.path.join(carpeta_fotos_web, f"{nombre_salida}.webp")

        try:
            with open(ruta_entrada, 'rb') as f:
                input_bytes = f.read()

            # 1. Quitar el fondo con IA
            output_bytes = remove(input_bytes, session=session)

            # 2. Abrir y corregir orientación EXIF antes de redimensionar
            img_resultado = Image.open(io.BytesIO(output_bytes))
            img_resultado = ImageOps.exif_transpose(img_resultado)
            img_resultado = img_resultado.convert("RGBA")

            # 3. Redimensionar a cuadrado con margen, sin deformar, centrado
            img_final = redimensionar_a_cuadrado(
                img_resultado,
                tamano=tamano_salida,
                margen=margen
            )

            # 4. Guardar como WebP transparente
            img_final.save(
                ruta_salida,
                "WEBP",
                quality=calidad_webp,
                method=6
            )
            exitosos += 1
        except Exception as e:
            errores += 1
            print(f"\n❌ Error al procesar '{nombre_archivo}': {e}")

    tiempo_total = round(time.time() - tiempo_inicio, 2)

    print("\n" + "=" * 60)
    print("🎉 ¡PROCESO COMPLETADO!")
    print(f"✅ Productos listos:  {exitosos}")
    if errores > 0:
        print(f"❌ Fallidos:          {errores}")
    print(f"⏱️ Tiempo empleado:    {tiempo_total} segundos")
    print(f"📁 Revisa tus imágenes listas en: {carpeta_fotos_web}")
    print("=" * 60)


if __name__ == "__main__":

    # ============================================================
    # 🎨 CONFIGURACIÓN — edita estas rutas para cada uso
    # ============================================================

    # Carpeta donde están las fotos originales de los productos
    CARPETA_ORIGEN = "mis_productos_raw"

    # Carpeta donde se guardarán las imágenes procesadas (WebP transparente)
    CARPETA_DESTINO = "mis_productos_webp"

    optimizar_catalogo_productos(
        carpeta_fotos_originales=CARPETA_ORIGEN,
        carpeta_fotos_web=CARPETA_DESTINO,
        calidad_webp=82,       # 80-85 es el punto dulce entre peso ligero y buena calidad
        tamano_salida=1080,    # tamaño final cuadrado en píxeles
        margen=0.10            # 10% de espacio libre alrededor del producto
    )