(function () {
  // Bilder: vis varm bakgrunn hvis et bilde ikke laster
  document.querySelectorAll('.ph img').forEach(function (img) {
    function broken() { img.closest('.ph').classList.add('is-broken'); }
    if (img.complete && img.naturalWidth === 0) broken();
    img.addEventListener('error', broken);
  });

  // Sticky nav skygge
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobilmeny
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Åpne meny' : 'Lukk meny');
    menu.classList.toggle('is-open', !open);
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Åpne meny');
      menu.classList.remove('is-open');
    });
  });

  // Faner i menyen
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var next = tabs[(i + d + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });

  // Åpningstider: marker i dag og vis "Åpent nå" (norsk tid)
  var hours = { 0: [9, 15], 1: [7, 17], 2: [7, 17], 3: [7, 17], 4: [7, 18], 5: [7, 18], 6: [8, 16] };
  try {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var now = parseInt(get('hour'), 10) % 24 + parseInt(get('minute'), 10) / 60;
    var row = document.querySelector('tr[data-day="' + day + '"]');
    if (row) row.classList.add('is-today');
    var h = hours[day];
    var open = now >= h[0] && now < h[1];
    var status = document.querySelector('[data-status]');
    var text = document.querySelector('[data-status-text]');
    status.classList.add(open ? 'is-open' : 'is-closed');
    if (open) {
      text.textContent = 'Åpent nå · til ' + String(h[1]).padStart(2, '0') + ':00';
    } else {
      var nd = now < h[0] ? day : (day + 1) % 7;
      var label = nd === day ? 'i dag' : 'i morgen';
      text.textContent = 'Stengt · åpner ' + label + ' ' + String(hours[nd][0]).padStart(2, '0') + ':00';
    }
  } catch (e) { /* eldre nettlesere: la status stå */ }

  // Bestillingsskjema (demo, sender ingenting)
  var form = document.getElementById('order-form');
  var msg = form.querySelector('.form__msg');
  var date = form.querySelector('input[type="date"]');
  var min = new Date(); min.setDate(min.getDate() + 3);
  date.min = min.toISOString().slice(0, 10);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'date' && f.value < f.min);
      f.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    msg.className = 'form__msg ' + (ok ? 'ok' : 'err');
    msg.textContent = ok
      ? 'Takk, ' + form.navn.value.trim().split(' ')[0] + '! Vi tar kontakt innen én arbeidsdag. (Demo: ingenting ble sendt.)'
      : 'Fyll inn navn, telefon og en dato minst tre dager frem i tid.';
    if (ok) form.reset();
  });

  // Animasjon ved scroll
  var els = document.querySelectorAll('.section__head, .card, .feature__grid > *, .about > *, .info > *, .order > *');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
