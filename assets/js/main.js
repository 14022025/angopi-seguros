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
      var acepta = data.get('autorizacion');
      var firstInvalid = null;

      var checks = [
        ['nombre', nombre.length >= 2 ? '' : 'Escribe tu nombre.'],
        ['telefono', /^[+()\d\s-]{7,20}$/.test(telefono) ? '' : 'Escribe un número de contacto válido.'],
        ['necesidad', necesidad ? '' : 'Elige qué quieres asegurar.'],
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

      var lines = ['Hola Angopi, quiero cotizar un seguro.'];
      if (necesidad) lines.push('Necesito: ' + necesidad);
      if (nombre) lines.push('Nombre: ' + nombre);
      if (telefono) lines.push('Teléfono: ' + telefono);
      if (ciudad) lines.push('Ciudad: ' + ciudad);
      if (mensaje) lines.push('Detalles: ' + mensaje);

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
      if (status) status.textContent = 'Abriendo WhatsApp con tu mensaje…';
      window.open(url, '_blank', 'noopener');
    });
  });
})();
