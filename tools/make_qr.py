"""QR personalizados de EME STUDIO.

Genera tarjetas listas para imprimir (PNG 300 dpi aprox.) y QR sueltos para empaques.
Uso:  python tools/make_qr.py
Salida: qr/
"""
import os
import segno
from PIL import Image, ImageDraw, ImageFont, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'qr')
LOGO = os.path.join(ROOT, 'public', 'media', 'logo.png')
DOMAIN = 'https://emestudiopr.com'
os.makedirs(OUT, exist_ok=True)

INK = (11, 13, 18)
BONE = (238, 236, 231)
WHITE = (255, 255, 255)
COBALT = (30, 79, 216)
RED = (200, 16, 46)
PINE = (14, 59, 44)


def font(size, condensed=True, bold=True):
    f = ImageFont.truetype(r'C:\Windows\Fonts\bahnschrift.ttf', size)
    try:
        f.set_variation_by_name('Bold Condensed' if condensed else ('Bold' if bold else 'Regular'))
    except Exception:
        pass
    return f


def logo(color, width):
    """Logo EME STUDIO recoloreado (el PNG es negro sobre transparente)."""
    src = Image.open(LOGO).convert('RGBA')
    alpha = src.getchannel('A')
    solid = Image.new('RGBA', src.size, color + (255,))
    solid.putalpha(alpha)
    h = round(src.height * width / src.width)
    return solid.resize((width, h), Image.LANCZOS)


def qr_image(url, size, fg=INK, bg=WHITE, eye=COBALT, badge=True):
    """QR con módulos redondeados, ojos de marca y logo al centro (corrección H)."""
    q = segno.make(url, error='h', micro=False)
    matrix = [list(r) for r in q.matrix]
    n = len(matrix)
    quiet = 4  # zona de silencio estándar ISO (4 módulos)
    cell = size / (n + quiet * 2)
    S = 4  # superresolución para bordes suaves
    big = Image.new('RGB', (round(size * S),) * 2, bg)
    d = ImageDraw.Draw(big)
    c = cell * S

    def in_finder(r, col):
        return (r < 7 and col < 7) or (r < 7 and col >= n - 7) or (r >= n - 7 and col < 7)

    # zona libre para el logo (≈ 22% del lado, seguro con corrección H)
    mid = n / 2
    hole = n * 0.22 if badge else 0

    for r in range(n):
        for col in range(n):
            if not matrix[r][col] or in_finder(r, col):
                continue
            if badge and abs(r + 0.5 - mid) < hole / 2 + 0.5 and abs(col + 0.5 - mid) < hole / 2 + 0.5:
                continue
            x = (col + quiet) * c
            y = (r + quiet) * c
            pad = c * 0.08
            d.rounded_rectangle([x + pad, y + pad, x + c - pad, y + c - pad], radius=c * 0.42, fill=fg)

    # ojos (finder patterns): esquinas apenas suavizadas; más redondeo rompe lectores estrictos
    for (r0, c0) in [(0, 0), (0, n - 7), (n - 7, 0)]:
        x = (c0 + quiet) * c
        y = (r0 + quiet) * c
        d.rounded_rectangle([x, y, x + 7 * c, y + 7 * c], radius=c * 0.3, fill=fg)
        d.rounded_rectangle([x + c, y + c, x + 6 * c, y + 6 * c], radius=c * 0.2, fill=bg)
        d.rounded_rectangle([x + 2 * c, y + 2 * c, x + 5 * c, y + 5 * c], radius=c * 0.15, fill=eye)

    if badge:
        bw = (hole - 1.2) * c
        cx = cy = (mid + quiet) * c
        d.rounded_rectangle([cx - bw / 2, cy - bw / 2, cx + bw / 2, cy + bw / 2], radius=bw * 0.24, fill=fg)
        lg = logo(bg, round(bw * 0.78))
        big.paste(lg, (round(cx - lg.width / 2), round(cy - lg.height / 2)), lg)

    return big.resize((round(size),) * 2, Image.LANCZOS)


def centered(d, y, text, f, fill, W, spacing=0):
    if spacing:
        widths = [d.textlength(ch, font=f) for ch in text]
        total = sum(widths) + spacing * (len(text) - 1)
        x = (W - total) / 2
        for ch, w in zip(text, widths):
            d.text((x, y), ch, font=f, fill=fill)
            x += w + spacing
    else:
        w = d.textlength(text, font=f)
        d.text(((W - w) / 2, y), text, font=f, fill=fill)


def card(name, url, title, sub, bg, fg, accent, panel=WHITE, label=None):
    """Tarjeta vertical 1500×1950 px (5×6.5 in a 300 dpi)."""
    W, H = 1500, 1950
    im = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(im)

    lg = logo(fg, 420)
    im.paste(lg, ((W - lg.width) // 2, 130), lg)

    if label:
        lf = font(30, condensed=False)
        tw = d.textlength(label, font=lf) + 56
        x0 = (W - tw) / 2
        d.rounded_rectangle([x0, 370, x0 + tw, 430], radius=30, fill=accent)
        d.text((x0 + 28, 382), label, font=lf, fill=WHITE)

    # panel del QR
    P = 1000
    px, py = (W - P) // 2, 480
    d.rounded_rectangle([px, py, px + P, py + P], radius=64, fill=panel)
    q = qr_image(url, P - 90, fg=INK, bg=panel, eye=accent)
    im.paste(q, (px + 45, py + 45))

    centered(d, py + P + 70, title, font(118), fg, W)
    centered(d, py + P + 215, sub, font(40, condensed=False, bold=False), fg, W)
    # línea y dominio
    d.line([(W / 2 - 60, py + P + 300), (W / 2 + 60, py + P + 300)], fill=accent, width=5)
    centered(d, py + P + 330, 'EMESTUDIOPR.COM', font(40, condensed=False), fg, W, spacing=8)

    path = os.path.join(OUT, name + '.png')
    im.save(path, dpi=(300, 300))
    return path


def label(name, url, product, accent=COBALT):
    """QR cuadrado para empaques / etiquetas (1200×1400 px, fondo blanco)."""
    W, H = 1200, 1400
    im = Image.new('RGB', (W, H), WHITE)
    d = ImageDraw.Draw(im)
    q = qr_image(url, 1080, fg=INK, bg=WHITE, eye=accent)
    im.paste(q, (60, 30))
    centered(d, 1130, product.upper(), font(110), INK, W)
    centered(d, 1265, 'MODO DE USO · INGREDIENTES · COMPRA', font(32, condensed=False, bold=False), (90, 92, 98), W, spacing=3)
    path = os.path.join(OUT, name + '.png')
    im.save(path, dpi=(300, 300))
    return path


if __name__ == '__main__':
    made = [
        card('eme-qr-web-negro', DOMAIN, 'ESCANEA Y COMPRA', 'Productos para elevar tu imagen', INK, WHITE, COBALT),
        card('eme-qr-web-claro', DOMAIN, 'ESCANEA Y COMPRA', 'Productos para elevar tu imagen', BONE, INK, COBALT),
        card('eme-qr-navidad', DOMAIN + '/#/especiales', 'ESPECIALES', 'Kit EME STUDIO · Ofertas 3x · Giveaway', PINE, WHITE, RED, label='NAVIDAD EME'),
        card('eme-qr-barberos', DOMAIN + '/#/barberos', 'PARA BARBEROS', 'Lleva EME a tu sillón', INK, WHITE, COBALT, label='DISTRIBUIDORES'),
        label('eme-qr-clay-wax', DOMAIN + '/#/p/clay-wax', 'Clay Wax'),
        label('eme-qr-volume-powder', DOMAIN + '/#/p/volume-powder', 'Volume Powder'),
        label('eme-qr-curl-cream', DOMAIN + '/#/p/curl-cream', 'Curl Cream'),
        label('eme-qr-peinilla', DOMAIN + '/#/p/peinilla', 'Peinilla EME'),
        label('eme-qr-kit', DOMAIN + '/#/p/kit-eme', 'Kit EME Studio'),
    ]
    # QR solo (transparente) para que el diseñador lo coloque donde quiera
    q = qr_image(DOMAIN, 2000, fg=INK, bg=WHITE, eye=COBALT)
    q.save(os.path.join(OUT, 'eme-qr-solo.png'), dpi=(300, 300))
    made.append(os.path.join(OUT, 'eme-qr-solo.png'))
    for m in made:
        print(os.path.relpath(m, ROOT))
