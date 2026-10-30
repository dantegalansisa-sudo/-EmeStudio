// Documentos legales modelo (ES / EN) para EME STUDIO.
// IMPORTANTE: son plantillas de buena práctica para Puerto Rico / EE. UU.
// Deben ser revisadas por un abogado licenciado en Puerto Rico antes de publicar.
import { SITE } from './site';

export interface LegalSection {
  h: string;
  p: string[];
}
export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = { es: '28 de octubre de 2026', en: 'October 28, 2026' };

export function legalDoc(id: string, lang: 'es' | 'en'): LegalDoc | null {
  const S = SITE;
  const es = lang === 'es';
  const contact = es
    ? `${S.legalName} · ${S.address} · ${S.email} · Instagram ${S.instagramHandle}`
    : `${S.legalName} · ${S.address} · ${S.email} · Instagram ${S.instagramHandle}`;

  switch (id) {
    case 'terminos':
      return es
        ? {
            title: 'Términos y condiciones',
            intro: `Última actualización: ${UPDATED.es}. Al usar este sitio o realizar una orden aceptas estos términos.`,
            sections: [
              { h: '1. Quiénes somos', p: [`Este sitio es operado por ${S.legalName} (“EME STUDIO”, “nosotros”), con base en Puerto Rico. Contacto: ${contact}.`] },
              {
                h: '2. Productos e información',
                p: [
                  'Hacemos lo posible por mostrar con exactitud los productos, ingredientes, tamaños y precios. Los colores pueden variar según tu pantalla. Los productos son cosméticos de uso externo para el cabello; no están destinados a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.',
                  'Lee la lista de ingredientes y las advertencias de cada producto antes de usarlo, especialmente si tienes alergias o piel sensible.',
                ],
              },
              {
                h: '3. Precios, impuestos y pagos',
                p: [
                  `Los precios están en dólares estadounidenses (USD). Al total se le añade el Impuesto sobre Ventas y Uso (IVU) de Puerto Rico de ${(S.taxRate * 100).toFixed(1)}% y, cuando aplique, el costo de envío; ambos se muestran antes de confirmar la orden.`,
                  'Nos reservamos el derecho de corregir errores de precio o de inventario y de cancelar órdenes afectadas, con reembolso total de cualquier cantidad pagada.',
                ],
              },
              {
                h: '4. Especiales, ofertas y códigos',
                p: [
                  'Los especiales tienen fecha de inicio y fin y son válidos hasta agotar el inventario indicado. Los códigos de descuento no son acumulables salvo que se indique, no tienen valor en efectivo y pueden tener un mínimo de compra o fecha de expiración.',
                ],
              },
              { h: '5. Órdenes y pagos', p: ['Los pagos se procesan de forma segura con Stripe; EME STUDIO no almacena los datos de tu tarjeta. Al completar el pago recibirás un recibo por correo electrónico. Podemos rechazar o limitar órdenes a nuestra discreción (por ejemplo, compras para reventa no autorizada), con reembolso total.'] },
              { h: '6. Envíos y devoluciones', p: ['Se rigen por nuestra Política de envíos y devoluciones, que forma parte de estos términos.'] },
              { h: '7. Propiedad intelectual', p: ['La marca EME STUDIO, el logo, fotografías, videos y textos de este sitio son propiedad de EME STUDIO o se usan con autorización. No pueden copiarse ni usarse sin permiso escrito.'] },
              { h: '8. Contenido de clientes y creadores', p: ['Las fotos y videos de “Resultados reales” muestran a clientes, barberos y creadores. Los resultados pueden variar según el tipo de cabello. Si una publicación es patrocinada o el creador recibió producto, se indicará.'] },
              {
                h: '9. Limitación de responsabilidad',
                p: ['En la medida permitida por la ley, EME STUDIO no será responsable por daños indirectos o consecuentes derivados del uso del sitio o de los productos. Nuestra responsabilidad máxima se limita al monto pagado por el producto en cuestión.'],
              },
              { h: '10. Ley aplicable', p: ['Estos términos se rigen por las leyes del Estado Libre Asociado de Puerto Rico y las leyes federales aplicables de los Estados Unidos. Cualquier disputa se atenderá en los tribunales con jurisdicción en Puerto Rico.'] },
              { h: '11. Cambios', p: ['Podemos actualizar estos términos. La fecha de “última actualización” indica la versión vigente.'] },
            ],
          }
        : {
            title: 'Terms & conditions',
            intro: `Last updated: ${UPDATED.en}. By using this site or placing an order you agree to these terms.`,
            sections: [
              { h: '1. Who we are', p: [`This site is operated by ${S.legalName} (“EME STUDIO”, “we”), based in Puerto Rico. Contact: ${contact}.`] },
              {
                h: '2. Products and information',
                p: [
                  'We strive to display products, ingredients, sizes and prices accurately. Colors may vary by screen. Our products are cosmetics for external hair use; they are not intended to diagnose, treat, cure or prevent any disease.',
                  'Read each product’s ingredient list and warnings before use, especially if you have allergies or sensitive skin.',
                ],
              },
              {
                h: '3. Prices, taxes and payment',
                p: [
                  `Prices are in US dollars (USD). Puerto Rico Sales and Use Tax (IVU) of ${(S.taxRate * 100).toFixed(1)}% and, where applicable, shipping are added and shown before you confirm your order.`,
                  'We reserve the right to correct pricing or inventory errors and to cancel affected orders with a full refund of any amount paid.',
                ],
              },
              { h: '4. Specials, deals and codes', p: ['Specials have start and end dates and are valid while the stated inventory lasts. Discount codes cannot be combined unless stated, have no cash value and may require a minimum purchase or expire.'] },
              { h: '5. Orders and payment', p: ['Payments are processed securely by Stripe; EME STUDIO does not store your card details. After payment you will receive an email receipt. We may refuse or limit orders at our discretion (e.g., unauthorized resale), with a full refund.'] },
              { h: '6. Shipping and returns', p: ['Governed by our Shipping & Returns Policy, which is part of these terms.'] },
              { h: '7. Intellectual property', p: ['The EME STUDIO brand, logo, photos, videos and copy on this site are owned by EME STUDIO or used with permission and may not be copied or used without written consent.'] },
              { h: '8. Customer and creator content', p: ['“Real results” photos and videos feature customers, barbers and creators. Results may vary by hair type. Sponsored posts or gifted product will be disclosed.'] },
              { h: '9. Limitation of liability', p: ['To the extent permitted by law, EME STUDIO is not liable for indirect or consequential damages arising from use of the site or products. Our maximum liability is limited to the amount paid for the product in question.'] },
              { h: '10. Governing law', p: ['These terms are governed by the laws of the Commonwealth of Puerto Rico and applicable US federal law. Disputes will be handled by the courts with jurisdiction in Puerto Rico.'] },
              { h: '11. Changes', p: ['We may update these terms. The “last updated” date shows the current version.'] },
            ],
          };

    case 'privacidad':
      return es
        ? {
            title: 'Política de privacidad',
            intro: `Última actualización: ${UPDATED.es}. Explica qué datos recopilamos, para qué y tus opciones.`,
            sections: [
              { h: 'Datos que recopilamos', p: ['Datos que nos das: nombre, correo, teléfono, dirección de entrega, usuario de Instagram (en giveaways) y notas de la orden.', 'Datos automáticos: información técnica básica del navegador y del dispositivo, y preferencias guardadas en tu navegador (idioma y bolsa de compra).'] },
              { h: 'Para qué los usamos', p: ['Procesar y entregar tus órdenes, responder preguntas, administrar giveaways, prevenir fraude y — solo si lo autorizas — enviarte ofertas por correo o WhatsApp/SMS.'] },
              { h: 'Con quién los compartimos', p: ['Proveedores que nos ayudan a operar (mensajería/WhatsApp, procesador de pagos, transporte, hosting y correo), únicamente para esos fines. No vendemos tu información personal.'] },
              {
                h: 'Marketing y cómo darte de baja',
                p: ['Los correos de marketing incluyen un enlace para darte de baja (Ley CAN-SPAM). Los mensajes de WhatsApp/SMS de marketing solo se envían con tu consentimiento expreso; responde STOP para cancelar. Tu consentimiento no es condición de compra.'],
              },
              { h: 'Cookies y almacenamiento local', p: ['Usamos almacenamiento local del navegador para recordar tu idioma y tu bolsa. Si en el futuro se añaden herramientas de analítica o publicidad (por ejemplo, Meta Pixel), se actualizará esta política y se ofrecerá la opción de rechazarlas.'] },
              { h: 'Menores de edad', p: ['Este sitio no está dirigido a menores de 13 años y no recopilamos a sabiendas sus datos (Ley COPPA). Los giveaways son solo para mayores de 21 años.'] },
              { h: 'Seguridad y retención', p: ['Aplicamos medidas razonables para proteger tus datos y los conservamos solo el tiempo necesario para los fines descritos o lo que exija la ley.'] },
              { h: 'Tus derechos', p: [`Puedes pedir acceso, corrección o eliminación de tus datos, y retirar tu consentimiento de marketing, escribiendo a ${S.email}. Si resides en un estado con leyes de privacidad específicas (por ejemplo, California), atenderemos tu solicitud según esa ley.`] },
              { h: 'Contacto', p: [contact] },
            ],
          }
        : {
            title: 'Privacy policy',
            intro: `Last updated: ${UPDATED.en}. This explains what data we collect, why, and your choices.`,
            sections: [
              { h: 'Data we collect', p: ['Data you give us: name, email, phone, delivery address, Instagram handle (for giveaways) and order notes.', 'Automatic data: basic technical browser and device information, plus preferences stored in your browser (language and shopping bag).'] },
              { h: 'How we use it', p: ['To process and deliver orders, answer questions, run giveaways, prevent fraud and — only with your permission — send you offers by email or WhatsApp/SMS.'] },
              { h: 'Who we share it with', p: ['Service providers that help us operate (messaging/WhatsApp, payment processor, carriers, hosting and email), solely for those purposes. We do not sell your personal information.'] },
              { h: 'Marketing and opting out', p: ['Marketing emails include an unsubscribe link (CAN-SPAM Act). Marketing WhatsApp/SMS messages are sent only with your express consent; reply STOP to opt out. Consent is not a condition of purchase.'] },
              { h: 'Cookies and local storage', p: ['We use browser local storage to remember your language and bag. If analytics or advertising tools (e.g., Meta Pixel) are added in the future, this policy will be updated and you will be offered a way to opt out.'] },
              { h: 'Children', p: ['This site is not directed to children under 13 and we do not knowingly collect their data (COPPA). Giveaways are open to adults 21+ only.'] },
              { h: 'Security and retention', p: ['We use reasonable measures to protect your data and keep it only as long as needed for the purposes above or as required by law.'] },
              { h: 'Your rights', p: [`You can request access, correction or deletion of your data, and withdraw marketing consent, by emailing ${S.email}. If you live in a state with specific privacy laws (e.g., California), we will handle your request under that law.`] },
              { h: 'Contact', p: [contact] },
            ],
          };

    case 'envios':
      return es
        ? {
            title: 'Envíos y devoluciones',
            intro: `Última actualización: ${UPDATED.es}.`,
            sections: [
              { h: 'Envíos', p: [`Enviamos a todo Puerto Rico. Las órdenes salen en ${S.shipsIn.es} luego de confirmadas. Envío gratis en órdenes de $${S.freeShippingThreshold} o más (después de descuentos); de lo contrario, $${S.shippingFlat.toFixed(2)}. También puedes elegir recogido sin costo.`, 'Si no podemos enviar dentro del tiempo indicado, te avisaremos y podrás aceptar la nueva fecha o cancelar con reembolso total (Regla de pedidos por correo de la FTC).'] },
              { h: 'Devoluciones', p: [`Por razones de higiene, aceptamos devoluciones de productos sin abrir y en su empaque original dentro de ${S.returnDays} días de recibidos. Escríbenos a ${S.email} o por WhatsApp con tu número de orden.`] },
              { h: 'Productos dañados o incorrectos', p: ['Si tu producto llega dañado o no es el que pediste, contáctanos dentro de 7 días con una foto y lo reemplazamos o reembolsamos sin costo.'] },
              { h: 'Reembolsos', p: ['Los reembolsos se emiten al método de pago original una vez recibido e inspeccionado el producto. El costo de envío original no es reembolsable salvo error nuestro.'] },
            ],
          }
        : {
            title: 'Shipping & returns',
            intro: `Last updated: ${UPDATED.en}.`,
            sections: [
              { h: 'Shipping', p: [`We ship across Puerto Rico. Orders ship within ${S.shipsIn.en} after confirmation. Free shipping on orders of $${S.freeShippingThreshold}+ (after discounts); otherwise $${S.shippingFlat.toFixed(2)}. Free local pickup is also available.`, 'If we can’t ship within the stated time, we’ll notify you and you may accept the new date or cancel for a full refund (FTC Mail Order Rule).'] },
              { h: 'Returns', p: [`For hygiene reasons, we accept returns of unopened products in their original packaging within ${S.returnDays} days of delivery. Email ${S.email} or message us on WhatsApp with your order number.`] },
              { h: 'Damaged or incorrect items', p: ['If your item arrives damaged or incorrect, contact us within 7 days with a photo and we’ll replace or refund it at no cost.'] },
              { h: 'Refunds', p: ['Refunds go to the original payment method once the item is received and inspected. Original shipping is non-refundable unless the error was ours.'] },
            ],
          };

    case 'giveaway':
      return es
        ? {
            title: 'Reglas oficiales de giveaways',
            intro: 'NO SE REQUIERE COMPRA PARA PARTICIPAR NI GANAR. Una compra no aumenta tus probabilidades. Nulo donde esté prohibido.',
            sections: [
              { h: 'Organizador', p: [`${S.legalName}, ${S.address}.`] },
              { h: 'Elegibilidad', p: ['Residentes legales de Puerto Rico de 21 años o más (mayoría de edad en Puerto Rico). No pueden participar empleados de EME STUDIO ni sus familiares inmediatos.'] },
              { h: 'Cómo participar', p: ['Completa el formulario del giveaway en este sitio durante el período indicado. Opcionalmente puedes seguir a @emestudiopr y etiquetar amigos en el post; no es requisito para la entrada por el sitio. Una entrada por persona.'] },
              { h: 'Período', p: ['Cada giveaway muestra su fecha y hora de cierre (hora de Puerto Rico, AST) y la fecha del sorteo.'] },
              { h: 'Selección de ganadores', p: ['Los ganadores se seleccionan al azar entre las entradas válidas, se anuncian en Instagram y se contactan por correo. Si un ganador no responde en 72 horas, se escogerá un ganador alterno.'] },
              { h: 'Premios', p: ['El premio, su cantidad y su valor aproximado se indican en cada giveaway. No es transferible ni canjeable por dinero. Los impuestos aplicables, si alguno, son responsabilidad del ganador.'] },
              { h: 'Instagram / Meta', p: ['Esta promoción no está patrocinada, avalada ni administrada por Instagram ni Meta, ni está asociada con ellos. Al participar liberas a Instagram/Meta de toda responsabilidad.'] },
              { h: 'Privacidad', p: ['Los datos se usan solo para administrar el giveaway, salvo que aceptes recibir ofertas. Ver la Política de privacidad.'] },
            ],
          }
        : {
            title: 'Official giveaway rules',
            intro: 'NO PURCHASE NECESSARY TO ENTER OR WIN. A purchase will not increase your chances. Void where prohibited.',
            sections: [
              { h: 'Sponsor', p: [`${S.legalName}, ${S.address}.`] },
              { h: 'Eligibility', p: ['Legal residents of Puerto Rico aged 21 or older (age of majority in Puerto Rico). EME STUDIO employees and their immediate families are not eligible.'] },
              { h: 'How to enter', p: ['Complete the giveaway form on this site during the entry period. Following @emestudiopr and tagging friends on the post is optional and not required for website entries. One entry per person.'] },
              { h: 'Entry period', p: ['Each giveaway shows its closing date and time (Puerto Rico time, AST) and draw date.'] },
              { h: 'Winner selection', p: ['Winners are selected at random from valid entries, announced on Instagram and contacted by email. If a winner doesn’t respond within 72 hours, an alternate will be selected.'] },
              { h: 'Prizes', p: ['Each giveaway lists the prize, quantity and approximate value. Prizes are non-transferable and have no cash value. Any applicable taxes are the winner’s responsibility.'] },
              { h: 'Instagram / Meta', p: ['This promotion is in no way sponsored, endorsed, administered by or associated with Instagram or Meta. Entrants release Instagram/Meta from all liability.'] },
              { h: 'Privacy', p: ['Data is used only to run the giveaway unless you opt in to offers. See our Privacy policy.'] },
            ],
          };

    case 'accesibilidad':
      return es
        ? {
            title: 'Declaración de accesibilidad',
            intro: 'Queremos que todas las personas puedan navegar y comprar en EME STUDIO.',
            sections: [
              { h: 'Nuestro compromiso', p: ['Diseñamos este sitio siguiendo como referencia las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 nivel AA: textos alternativos, navegación por teclado, contraste, etiquetas en formularios y respeto a la preferencia de “reducir movimiento”.'] },
              { h: '¿Encontraste una barrera?', p: [`Si algo no te funciona, escríbenos a ${S.email} o por WhatsApp y te ayudamos a completar tu compra por otro medio mientras lo corregimos.`] },
            ],
          }
        : {
            title: 'Accessibility statement',
            intro: 'We want everyone to be able to browse and shop at EME STUDIO.',
            sections: [
              { h: 'Our commitment', p: ['This site is designed with the Web Content Accessibility Guidelines (WCAG) 2.1 level AA as a reference: alt text, keyboard navigation, contrast, labeled form fields and respect for the “reduce motion” preference.'] },
              { h: 'Found a barrier?', p: [`If something doesn’t work for you, email ${S.email} or message us on WhatsApp and we’ll help you complete your purchase another way while we fix it.`] },
            ],
          };
    default:
      return null;
  }
}
