import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SHOP, bundlesFor, byId, displayName, exists, savings } from '../data/catalog';
import { SITE, money, money2 } from '../data/site';
import { useLang } from '../i18n';
import { goHome, navigate } from '../router';
import { useStore } from '../store';
import { EASE } from '../utils';
import { Icon, Stars } from './ui';
import { AddButton, Stage } from './Collection';

function Accordion({ title, children, open: initial = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <button className="acc__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <Icon.Chevron />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="acc__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE.out }}>
            <div className="acc__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage({ id }: { id: string }) {
  const { add, setCartOpen } = useStore();
  const { t, l, lang } = useLang();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQty(1);
    setImg(0);
    track.current?.scrollTo({ left: 0 });
  }, [id]);

  if (!exists(id)) {
    return (
      <main className="pdp pdp--missing container">
        <h1>{t('Este producto ya no está disponible.', 'This product is no longer available.')}</h1>
        <button className="btn btn--dark" onClick={() => goHome('coleccion')}>
          {t('Ver la tienda', 'Back to shop')} <Icon.Arrow />
        </button>
      </main>
    );
  }

  const p = byId(id);
  const name = displayName(p, lang);
  const images = [p.studio, ...p.gallery];
  const offers = bundlesFor(p.id);
  const included = p.id === 'kit-eme' ? ['curl-cream', 'volume-powder', 'clay-wax', 'peinilla'] : [];
  const related = SHOP.filter((x) => x.id !== p.id && x.category !== 'kits').slice(0, 3);

  const onScroll = () => {
    const el = track.current;
    if (el) setImg(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goImg = (i: number) => {
    setImg(i);
    track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' });
  };

  const addToBag = () => {
    add(p.id, qty);
    setCartOpen(true);
  };
  const buyNow = () => {
    add(p.id, qty);
    navigate('/checkout');
  };

  return (
    <main className="pdp" id="main" tabIndex={-1}>
      <div className="container">
        <nav className="crumbs mono" aria-label={t('Ruta', 'Breadcrumb')}>
          <button onClick={() => goHome()}>{t('Inicio', 'Home')}</button>
          <span>/</span>
          <button onClick={() => goHome('coleccion')}>{t('Tienda', 'Shop')}</button>
          <span>/</span>
          <span aria-current="page">{name}</span>
        </nav>
      </div>

      <div className="container pdp__grid">
        {/* Galería */}
        <div className="pdp__gallery">
          <div className="pdp__track" ref={track} onScroll={onScroll}>
            {images.map((src, i) => (
              <div key={src} className={`pdp__slide ${i === 0 ? 'pdp__slide--studio' : ''}`}>
                {i === 0 ? (
                  <Stage p={p} alt={name} className="stage--pdp" />
                ) : (
                  <img src={src} alt={`${name} — ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
                )}
              </div>
            ))}
          </div>
          {p.tag && <span className={`card__tag mono ${p.compareAt ? 'card__tag--promo' : ''}`}>{l(p.tag)}</span>}
          <div className="pdp__thumbs" role="tablist" aria-label={t('Imágenes', 'Images')}>
            {images.map((src, i) => (
              <button key={src} role="tab" aria-selected={i === img} className={i === img ? 'is-active' : ''} onClick={() => goImg(i)} aria-label={`${t('Imagen', 'Image')} ${i + 1}`}>
                <img src={src} alt="" className={i === 0 ? 'is-studio' : ''} />
              </button>
            ))}
          </div>
        </div>

        {/* Información */}
        <div className="pdp__info">
          <span className="mono pdp__type">{l(p.type)}</span>
          <h1>{name}</h1>
          <p className="pdp__tagline serif">{l(p.tagline)}</p>

          <div className="pdp__price">
            <strong>{money2(p.price)}</strong>
            {p.compareAt && (
              <>
                <s>{money2(p.compareAt)}</s>
                <span className="pdp__save">
                  -{savings(p)}% · {t('Ahorra', 'Save')} {money(p.compareAt - p.price)}
                </span>
              </>
            )}
          </div>
          <p className="pdp__taxnote">
            {t('IVU (11.5%) y envío se calculan al pagar.', 'IVU sales tax (11.5%) and shipping calculated at checkout.')} · {p.size}
          </p>

          <p className="pdp__desc">{l(p.description)}</p>

          {p.specs.length > 0 && (
            <ul className="pdp__specs">
              {p.specs.map((s) => (
                <li key={s.label.es}>
                  <span>{l(s.label)}</span>
                  <Stars value={s.value} />
                  <small>{l(s.note)}</small>
                </li>
              ))}
            </ul>
          )}

          {included.length > 0 && (
            <div className="pdp__incl">
              <span className="mono">{t('Incluye', 'Includes')}</span>
              <div>
                {included.map((iid) => (
                  <button key={iid} onClick={() => navigate(`/p/${iid}`)}>
                    <Stage p={byId(iid)} className="stage--mini" />
                    <small>{byId(iid).name}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pdp__buy">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t('Menos', 'Less')}>
                <Icon.Minus />
              </button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label={t('Más', 'More')}>
                <Icon.Plus />
              </button>
            </div>
            <button className="btn btn--dark pdp__add" onClick={addToBag}>
              {t('Añadir a la bolsa', 'Add to bag')} · {money2(p.price * qty)}
            </button>
          </div>
          <button className="btn btn--blue btn--block pdp__now" onClick={buyNow}>
            {t('Comprar ahora', 'Buy now')} <Icon.Arrow />
          </button>

          {offers.map((o) => (
            <button key={o.id} className="pdp__offer" onClick={() => navigate(`/p/${o.id}`)}>
              <Stage p={o} className="stage--mini" />
              <span>
                <small className="mono">{t('Ahorra más', 'Save more')}</small>
                <strong>
                  {displayName(o, lang)} · {money(o.price)} <s>{money(o.compareAt!)}</s>
                </strong>
              </span>
              <Icon.Arrow />
            </button>
          ))}

          <ul className="pdp__trust">
            <li>
              <Icon.Truck /> {t(`Envío gratis en órdenes de $${SITE.freeShippingThreshold}+`, `Free shipping on orders $${SITE.freeShippingThreshold}+`)}
            </li>
            <li>
              <Icon.Calendar /> {t('Sale en', 'Ships in')} {l(SITE.shipsIn)}
            </li>
            <li>
              <Icon.Shield /> {t('Probado en barbería', 'Barber tested')}
            </li>
            <li>
              <Icon.WhatsApp /> {t('Atención por WhatsApp', 'WhatsApp support')}
            </li>
          </ul>

          <div className="pdp__accs">
            <Accordion title={t('Beneficios', 'Benefits')} open>
              <ul className="ticks">
                {p.benefits.map((b) => (
                  <li key={b.es}>
                    <Icon.Check /> {l(b)}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title={t('Modo de uso', 'How to use')}>
              <ol className="steps">
                {p.howTo.map((h, i) => (
                  <li key={h.es}>
                    <span className="mono">0{i + 1}</span>
                    {l(h)}
                  </li>
                ))}
              </ol>
            </Accordion>
            {p.ingredients && (
              <Accordion title={t('Ingredientes', 'Ingredients')}>
                <p className="ingredients">{l(p.ingredients)}</p>
              </Accordion>
            )}
            {p.warnings && (
              <Accordion title={t('Advertencias', 'Warnings')}>
                <p>{l(p.warnings)}</p>
              </Accordion>
            )}
            <Accordion title={t('Envíos y devoluciones', 'Shipping & returns')}>
              <p>
                {t(
                  `Enviamos a todo Puerto Rico. Envío gratis en órdenes de $${SITE.freeShippingThreshold}+; de lo contrario, ${money2(SITE.shippingFlat)}. Productos sin abrir pueden devolverse dentro de ${SITE.returnDays} días.`,
                  `We ship across Puerto Rico. Free shipping on orders $${SITE.freeShippingThreshold}+; otherwise ${money2(SITE.shippingFlat)}. Unopened products may be returned within ${SITE.returnDays} days.`,
                )}{' '}
                <button className="inline-link" onClick={() => navigate('/legal/envios')}>
                  {t('Ver política completa', 'Read full policy')}
                </button>
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <section className="pdp__related container">
        <h2>{t('Completa tu rutina', 'Complete your routine')}</h2>
        <div className="pdp__relgrid">
          {related.map((r) => (
            <motion.article key={r.id} className="rel" whileHover={{ y: -6 }} onClick={() => navigate(`/p/${r.id}`)}>
              <Stage p={r} />
              <div>
                <strong>{r.name}</strong>
                <span>{money(r.price)}</span>
              </div>
              <AddButton id={r.id} />
            </motion.article>
          ))}
        </div>
      </section>

      {/* Barra de compra fija (móvil) */}
      <div className="pdp__sticky">
        <div>
          <strong>{name}</strong>
          <span>
            {money2(p.price)}
            {p.compareAt && <s>{money2(p.compareAt)}</s>}
          </span>
        </div>
        <button className="btn btn--dark" onClick={addToBag}>
          {t('Añadir', 'Add')} <Icon.Plus />
        </button>
      </div>
    </main>
  );
}
