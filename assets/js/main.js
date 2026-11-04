(function () {
  'use strict';

  var WHATSAPP = '573013631792';

  // Navegación flotante: cambia de estilo al dejar el marco oscuro
  var header = document.querySelector('.nav-shell');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menú móvil
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('menu-movil');
  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      panel.hidden = !open;
      document.body.classList.toggle('nav-open', open);
      if (open) {
        var first = panel.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };

  // Bloques que suben 32 px y aparecen; los hermanos entran uno tras otro
  var reveals = document.querySelectorAll('.reveal');
  var showAll = function () { Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); }); };
  if ('IntersectionObserver' in window && !calm) {
    var answered = false;
    // Si el navegador no llega a responder (pestaña sin dibujar), el contenido se muestra igual
    window.setTimeout(function () { if (!answered) showAll(); }, 2500);
    var seen = new IntersectionObserver(function (entries) {
      answered = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
        el.style.transitionDelay = Math.min(siblings.indexOf(el), 4) * 90 + 'ms';
        el.classList.add('is-in');
        seen.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(reveals, function (el) { seen.observe(el); });
  } else {
    showAll();
  }

  // Manifiesto que se enciende palabra por palabra al bajar
  each('[data-manifesto]', function (el) {
    var text = el.textContent.trim();
    var accentFrom = text.indexOf(el.getAttribute('data-accent') || 'Bienvenido');
    var pos = 0;
    el.innerHTML = text.split(' ').map(function (word) {
      var accent = accentFrom >= 0 && pos >= accentFrom;
      pos += word.length + 1;
      return '<span class="w' + (accent ? ' w--accent' : '') + '">' + word + '</span>';
    }).join(' ').replace(/ (<span class="w[^"]*">[^<]*<\/span>)$/, ' $1');
    var words = el.querySelectorAll('.w');
    var paint = function () {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = calm ? 1 : Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      var lit = Math.round(p * words.length);
      Array.prototype.forEach.call(words, function (w, i) { w.classList.toggle('on', i < lit); });
    };
    paint();
    window.addEventListener('scroll', function () { window.requestAnimationFrame(paint); }, { passive: true });
  });

  // Preguntas que se abren y se cierran con suavidad; solo una abierta a la vez
  var EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  var slide = function (d, from, to, done) {
    if (calm || !d.animate) { if (done) done(); return; }
    var a = d.animate({ height: [from + 'px', to + 'px'] }, { duration: 420, easing: EASE });
    a.onfinish = function () { if (done) done(); };
  };
  var closeItem = function (d) {
    var from = d.offsetHeight;
    d.open = false;
    var to = d.offsetHeight;
    d.open = true;
    d.classList.add('is-closing');
    slide(d, from, to, function () { d.open = false; d.classList.remove('is-closing'); });
  };
  var openItem = function (d) {
    var from = d.offsetHeight;
    d.open = true;
    var to = d.offsetHeight;
    slide(d, from, to);
    var body = d.querySelector('.acc__body');
    if (body && body.animate && !calm) body.animate({ opacity: [0, 1], transform: ['translateY(-8px)', 'none'] }, { duration: 420, easing: EASE });
  };
  each('.acc', function (acc) {
    var items = acc.querySelectorAll('details');
    Array.prototype.forEach.call(items, function (d) {
      d.querySelector('summary').addEventListener('click', function (e) {
        e.preventDefault();
        if (d.open && !d.classList.contains('is-closing')) { closeItem(d); return; }
        Array.prototype.forEach.call(items, function (other) { if (other !== d && other.open) closeItem(other); });
        openItem(d);
      });
    });
  });

  // ¿Por qué elegir?: cada punto que se abre cambia la foto de la casita
  var whyPhotos = document.querySelectorAll('.why .house img');
  if (whyPhotos.length > 1) {
    Array.prototype.forEach.call(document.querySelectorAll('.why .acc details'), function (d, i) {
      d.querySelector('summary').addEventListener('click', function () {
        if (!d.open || d.classList.contains('is-closing') || !whyPhotos[i]) return;
        Array.prototype.forEach.call(whyPhotos, function (img, k) { img.classList.toggle('is-on', k === i); });
      });
    });
  }

  // Carrusel de servicios: pestañas Personas / Empresas y flechas
  var services = document.querySelector('.services');
  if (services) {
    var bar = services.querySelector('.services__bar');
    var tabs = Array.prototype.slice.call(services.querySelectorAll('[role="tab"]'));
    var arrows = services.querySelectorAll('.arrow');
    var current = function () { return document.getElementById(services.querySelector('[aria-selected="true"]').getAttribute('aria-controls')).querySelector('.track'); };
    var updateArrows = function () {
      var t = current();
      arrows[0].disabled = t.scrollLeft < 8;
      arrows[1].disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 8;
    };
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      current().scrollLeft = 0;
      updateArrows();
    };
    bar.hidden = false;
    document.documentElement.classList.add('has-tabs');
    select(tabs[0]);
    tabs.forEach(function (t) { t.addEventListener('click', function () { select(t); }); });
    bar.querySelector('[role="tablist"]').addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
    Array.prototype.forEach.call(arrows, function (a) {
      a.addEventListener('click', function () {
        var t = current();
        var card = t.querySelector('li');
        var step = card ? card.offsetWidth + parseFloat(getComputedStyle(t).columnGap || 16) : 300;
        t.scrollBy({ left: Number(a.getAttribute('data-dir')) * step * 2, behavior: calm ? 'auto' : 'smooth' });
      });
    });
    each('.services .track', function (t) { t.addEventListener('scroll', updateArrows, { passive: true }); });
    window.addEventListener('resize', updateArrows);

    // Avance automático y lento: de derecha a izquierda y, al llegar al final, de vuelta.
    // Se pausa con el mouse sobre «Más información» o mientras la persona lo usa, y retoma solo.
    if (!calm) {
      var SPEED = 24; // píxeles por segundo
      var stage = services.querySelector('.services__stage');
      var dir = 1, pos = 0, last = 0, pausedUntil = 0, hovering = false;
      var hold = function (ms) { pausedUntil = performance.now() + ms; services.classList.remove('is-auto'); };
      var tick = function (now) {
        var t = current();
        var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        var box = stage.getBoundingClientRect();
        var onScreen = box.bottom > 0 && box.top < window.innerHeight;
        if (onScreen && !hovering && !document.hidden && now > pausedUntil) {
          if (!services.classList.contains('is-auto')) { services.classList.add('is-auto'); pos = t.scrollLeft; }
          var max = t.scrollWidth - t.clientWidth;
          pos += dir * SPEED * dt;
          if (pos >= max) { pos = max; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; }
          t.scrollLeft = pos;
        }
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
      // Solo se detiene cuando la persona lleva el mouse a «Más información». Se miran solo los
      // movimientos reales: si el botón pasa por debajo de un mouse quieto, el carrusel sigue
      // (antes se quedaba parado ahí hasta que se moviera el mouse).
      stage.addEventListener('mousemove', function (e) {
        if (!e.movementX && !e.movementY) return;
        var onCta = !!e.target.closest('.svc__cta');
        if (onCta !== hovering) { hovering = onCta; if (onCta) services.classList.remove('is-auto'); }
      });
      stage.addEventListener('mouseleave', function () { hovering = false; });
      stage.addEventListener('focusin', function () { hold(8000); });
      ['pointerdown', 'touchstart'].forEach(function (ev) {
        stage.addEventListener(ev, function () { hold(6000); }, { passive: true });
      });
      // La rueda solo cuenta si se desliza de lado; bajar por la página encima del carrusel no lo pausa
      stage.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) hold(6000);
      }, { passive: true });
      tabs.forEach(function (t) { t.addEventListener('click', function () { dir = 1; pos = 0; hold(1200); }); });
    }

    // Los enlaces del menú (Personas, Empresas, Arrendamiento) abren la pestaña correcta
    var openFromHash = function (hash) {
      var target = hash && document.getElementById(hash.slice(1));
      if (!target || !services.contains(target)) return false;
      var panel = target.closest('[role="tabpanel"]');
      select(document.getElementById(panel.getAttribute('aria-labelledby')));
      if (target.tagName === 'LI') {
        var t = panel.querySelector('.track');
        t.scrollLeft = target.offsetLeft - t.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft);
      }
      services.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
      return true;
    };
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a) return;
      var hash = a.getAttribute('href').slice(a.getAttribute('href').indexOf('#'));
      if (openFromHash(hash)) { e.preventDefault(); history.replaceState(null, '', hash); }
    });
    if (location.hash) openFromHash(location.hash);
  }

  // Seguros de la home: tocar cualquier parte de la tarjeta lleva a ese seguro en su página
  each('.track .svc', function (card) {
    var cta = card.querySelector('.svc__cta');
    if (!cta) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      window.location.href = cta.href;
    });
  });

  // Cotizador de SURA: solo se le cambia el aspecto para que sea de la familia de Angopi.
  // Campos, datos y conexión siguen siendo los del proveedor. Si algo falla aquí, el cotizador funciona igual.
  var quoter = document.querySelector('arriendy-quoter');
  if (quoter) {
    var QUOTER_CSS = ":host, .quoter-root, .quoter-root * { font-family: \"Geist\", ui-sans-serif, system-ui, sans-serif !important; } .card { background: #fff !important; box-shadow: none !important; border: 0 !important; } .card-title { font-family: \"Nunito Sans\", \"Geist\", sans-serif !important; font-weight: 800 !important; color: #0a0a0c !important; } .card-subtitle, .label-count, .version-text { color: #6b6f78 !important; } label, .cb-label { color: #0a0a0c !important; } .form-control { color: #0a0a0c !important; border-color: #d6d6dc !important; border-radius: 14px !important; } .form-control:focus { border-color: #418ef2 !important; box-shadow: 0 0 0 4px rgba(65, 142, 242, .15) !important; } .form-control::placeholder { color: #9a9ea6 !important; } .btn { border-radius: 999px !important; font-weight: 600 !important; transition: background-color .2s, color .2s, border-color .2s !important; } /* En este cotizador, btn-secondary es la opción elegida y btn-neutral la que no */ .btn-secondary { background: #418ef2 !important; border-color: #418ef2 !important; color: #fff !important; } .btn-neutral { background: #fff !important; border-color: #d6d6dc !important; color: #3a3c42 !important; } .btn-neutral:hover { border-color: #418ef2 !important; color: #418ef2 !important; } .btn-primary { background: #418ef2 !important; border-color: #418ef2 !important; color: #fff !important; } .btn-primary:hover { background: #418ef2 !important; } .circle { background: #d6d6dc !important; color: #fff !important; } .circle.active { background: #418ef2 !important; color: #fff !important; } .line { background: #d6d6dc !important; } .link, a { color: #418ef2 !important; } .cb-box { border-color: #d6d6dc !important; border-radius: 6px !important; } input:checked + .cb-box, .cb-box.checked, .cb-box.active { background: #418ef2 !important; border-color: #418ef2 !important; } .modal-backdrop { background: rgba(10, 10, 12, .45) !important; } .modal-container { max-width: 460px !important; border-radius: 28px !important; } .modal-content { display: block !important; min-height: 0 !important; padding: 32px !important; } .image-section { display: none !important; } .content-section { padding: 0 !important; } .modal-container h2 { font-family: \"Nunito Sans\", \"Geist\", sans-serif !important; font-weight: 800 !important; color: #0a0a0c !important; padding-right: 36px; } .modal-container p { color: #6b6f78 !important; } .modal-container strong { color: #0a0a0c !important; } .close-button { background: #418ef2 !important; } .spinner { border-top-color: #418ef2 !important; }";
    var tries = 0;
    var dress = function () {
      if (quoter.shadowRoot) {
        var style = document.createElement('style');
        style.textContent = QUOTER_CSS;
        quoter.shadowRoot.appendChild(style);
        return;
      }
      if (++tries < 300) window.setTimeout(dress, 50);
    };
    dress();
  }

  // Cifras que cuentan desde cero
  if ('IntersectionObserver' in window && !calm) {
    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseInt(el.getAttribute('data-count'), 10);
        var t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var k = Math.min((t - t0) / 1200, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) window.requestAnimationFrame(step);
        };
        el.textContent = '0';
        window.requestAnimationFrame(step);
        counter.unobserve(el);
      });
    }, { threshold: 0.6 });
    each('[data-count]', function (el) { counter.observe(el); });
  }

  // Ninguna línea termina con una palabra sola
  var WIDOW = 'p, li, h1, h2, h3, blockquote, cite, .list__title, .door__text, .door__title, .svc__title';
  each(WIDOW, function (el) {
    if (el.querySelector(WIDOW) || el.hasAttribute('data-manifesto')) return;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var last = null;
    var node;
    while ((node = walker.nextNode())) if (node.nodeValue.trim()) last = node;
    if (!last) return;
    var text = last.nodeValue.replace(/\s+$/, '');
    var i = text.lastIndexOf(' ');
    if (i > 0) last.nodeValue = text.slice(0, i) + ' ' + last.nodeValue.slice(i + 1);
  });

  // Formularios que arman un mensaje de WhatsApp
  var forms = document.querySelectorAll('form[data-whatsapp]');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('[data-status]');

    function setError(field, message) {
      var input = form.querySelector('[name="' + field + '"]');
      var holder = form.querySelector('[data-error-for="' + field + '"]');
      if (input && input.type !== 'radio' && input.type !== 'checkbox') {
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
      }
      if (holder) holder.textContent = message || '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var nombre = (data.get('nombre') || '').toString().trim();
      var telefono = (data.get('telefono') || '').toString().trim();
      var necesidad = (data.get('necesidad') || '').toString().trim();
      var mensaje = (data.get('mensaje') || '').toString().trim();
      var ciudad = (data.get('ciudad') || '').toString().trim();
      var correo = (data.get('correo') || '').toString().trim();
      var acepta = data.get('autorizacion');
      var firstInvalid = null;

      var checks = [
        ['nombre', nombre.length >= 2 ? '' : 'Escribe tu nombre.'],
        ['telefono', /^[+()\d\s-]{7,20}$/.test(telefono) ? '' : 'Escribe un número de contacto válido.'],
        ['correo', !correo || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo) ? '' : 'Revisa tu correo, parece que le falta algo.'],
        ['necesidad', necesidad ? '' : 'Cuéntanos qué quieres proteger.'],
        ['autorizacion', acepta ? '' : 'Necesitamos tu autorización para contactarte.'],
      ];
      checks.forEach(function (c) {
        if (!form.querySelector('[name="' + c[0] + '"]')) return;
        setError(c[0], c[1]);
        if (c[1] && !firstInvalid) firstInvalid = form.querySelector('[name="' + c[0] + '"]');
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) status.textContent = 'Revisa los campos marcados.';
        return;
      }

      var lines = ['¡Hola! Les escribo desde la página de contacto.'];
      if (necesidad) lines.push('Quiero proteger: ' + necesidad);
      if (nombre) lines.push('Nombre: ' + nombre);
      if (telefono) lines.push('Teléfono: ' + telefono);
      if (correo) lines.push('Correo: ' + correo);
      if (ciudad) lines.push('Ciudad: ' + ciudad);
      if (mensaje) lines.push('Mensaje: ' + mensaje);

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
      if (status) status.textContent = 'Abriendo WhatsApp con tu mensaje…';
      window.open(url, '_blank', 'noopener');
    });
  });
})();
