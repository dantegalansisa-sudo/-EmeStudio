# EME STUDIO — Cumplimiento legal (EE. UU. / Puerto Rico)

> Guía práctica para la web. **No es asesoría legal**: los textos de `src/data/legal.ts` son plantillas de buena práctica y deben revisarse con un abogado licenciado en Puerto Rico antes de lanzar.

## Lo que ya cubre la web

| Tema | Norma / referencia | Cómo se cubre en el sitio |
|---|---|---|
| Accesibilidad | ADA Título III (demandas frecuentes a tiendas online) · guía técnica WCAG 2.1 AA | Textos alternativos, navegación por teclado, enlace "Saltar al contenido", focos visibles, etiquetas en formularios, respeta "reducir movimiento" y tiene una Declaración de accesibilidad con canal de ayuda |
| Privacidad | CalOPPA (exige política visible si hay visitantes de California), FTC Act §5 (no prácticas engañosas) | Política de privacidad bilingüe enlazada en el footer, checkout, giveaway y newsletter |
| Correos de marketing | CAN-SPAM Act | Consentimiento explícito en el newsletter y enlace para darse de baja (a implementar en la plataforma de email) |
| WhatsApp / SMS de marketing | TCPA | Casilla **separada, opcional y desmarcada** en el checkout; "no es condición de compra"; STOP para cancelar |
| Menores | COPPA | El sitio no está dirigido a menores de 13 años; giveaways solo 21+ |
| Envíos | FTC Mail Order Rule | Tiempo de envío publicado y aviso de demora con opción de cancelar y reembolso |
| Impuestos | IVU de Puerto Rico 11.5% (10.5% estatal + 1% municipal) | Se muestra en la ficha ("IVU se calcula al pagar") y desglosado en la bolsa, el checkout y el mensaje de la orden |
| Precio total claro | FTC (precios y cargos) | Subtotal, descuento, envío, IVU y total antes de confirmar |
| Cosméticos | FD&C Act · MoCRA 2022 · Fair Packaging and Labeling Act | Ingredientes completos, modo de uso y advertencias en cada producto; sin promesas médicas ("tratar", "curar", "hacer crecer") |
| Testimonios / creadores | FTC Endorsement Guides | Términos aclaran que los resultados varían y que el contenido patrocinado o con producto regalado se divulga |
| Giveaways | Leyes de sorteos (sin compra necesaria) · reglas de Meta | Reglas oficiales: "No se requiere compra", elegibilidad, fechas, premio y valor, selección al azar, liberación de Instagram/Meta |

## Pendientes antes de publicar (los decide el cliente)

1. **Razón social, dirección física y correo** → `SITE.legalName`, `SITE.address`, `SITE.email` en `src/data/site.ts`.
2. **WhatsApp del negocio** → `SITE.whatsapp`.
3. **Envío**: tarifa real (`shippingFlat`, hoy $6 de ejemplo) y tiempo de despacho (`shipsIn`).
4. **Devoluciones**: confirmar la ventana (`returnDays`, hoy 14 días para productos sin abrir).
5. **Registro de comerciante (SURI) y cobro del IVU**: el negocio debe estar registrado en Hacienda (SURI) para cobrar y remitir el IVU.
6. **Giveaways en Puerto Rico**: verificar con un abogado o con DACO si el sorteo requiere registro o fianza según el valor de los premios. Hoy la elegibilidad es 21+ (mayoría de edad en PR).
7. **Pasarela de pago**: en la demo la orden se confirma por WhatsApp. Al conectar Stripe, ATH Móvil o Shopify, el procesador cubre PCI-DSS; no guardar datos de tarjeta en el sitio.
8. **Analítica o Meta Pixel**: si se instalan, actualizar la Política de privacidad y añadir un aviso con opción de rechazo.
9. **Códigos de ejemplo**: `CLUBEME10` y `NAVIDAD15` en `src/data/promos.ts` son ejemplos. Confirmar o eliminar.
10. **Stock de especiales**: las unidades mostradas ("Quedan 34") deben reflejar inventario real; mostrar escasez falsa es práctica engañosa (FTC).
