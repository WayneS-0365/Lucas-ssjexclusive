(function() {
  var SSJ_CONFIG = {
    businessName:   'SSJ Exclusive',
    accentColor:    '#c9a15a',
    waNumber:       '27722726623',
    formspreeId:    'xlgwlyjo',
    services: [
      { id: 'transfer',  label: 'Airport transfer',    icon: 'plane-arrival',   from: 'Enquire'   },
      { id: 'city',      label: 'City tour',            icon: 'map-pin',         from: 'Enquire' },
      { id: 'peninsula', label: 'Peninsula tour',       icon: 'mountain',        from: 'Enquire' },
      { id: 'wine',      label: 'Winelands day trip',   icon: 'glass-full',      from: 'Enquire' },
      { id: 'return',    label: 'Return transfer',      icon: 'plane-departure', from: 'Enquire'   },
      { id: 'custom',    label: 'Custom request',       icon: 'adjustments',     from: 'Enquire'}
    ]
  };

  function mount(targetId) {
    var el = document.getElementById(targetId);
    if (!el) return;

    var css = `
      .ssj-widget * { box-sizing: border-box; margin: 0; padding: 0; }
      .ssj-widget { font-family: 'DM Sans', sans-serif; max-width: 680px; }
      .ssj-steps { display:flex; align-items:center; margin-bottom:1.5rem; }
      .ssj-step { display:flex; align-items:center; gap:6px; font-size:12px; color:#888; }
      .ssj-step.active { color:#111; font-weight:500; }
      .ssj-step.done { color:#25a244; }
      .ssj-step-num { width:22px; height:22px; border-radius:50%; border:1px solid #ddd;
        display:flex; align-items:center; justify-content:center; font-size:11px; }
      .ssj-step.active .ssj-step-num { background:#111; color:#fff; border-color:#111; }
      .ssj-step.done .ssj-step-num { background:#e8f7ee; color:#25a244; border-color:#a3d9b1; }
      .ssj-step-line { flex:1; height:1px; background:#eee; margin:0 6px; }
      .ssj-card { background:#fff; border:1px solid #eee; border-radius:12px;
        padding:1.25rem; margin-bottom:1rem; }
      .ssj-svc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:1rem; }
      .ssj-svc-btn { padding:12px 8px; border:1px solid #e0e0e0; border-radius:8px;
        background:#fff; cursor:pointer; text-align:center; transition:all .15s; }
      .ssj-svc-btn.selected { border-color:${SSJ_CONFIG.accentColor};
        background:${SSJ_CONFIG.accentColor}18; }
      .ssj-svc-btn span { display:block; font-size:12px; font-weight:500; color:#111; }
      .ssj-svc-btn small { display:block; font-size:11px; color:#888; margin-top:2px; }
      .ssj-label { display:block; font-size:12px; color:#777; margin:12px 0 5px; }
      .ssj-label:first-child { margin-top:0; }
      .ssj-input { width:100%; padding:9px 11px; border:1px solid #ddd; border-radius:8px;
        font-family:inherit; font-size:14px; }
      .ssj-input:focus { outline:none; border-color:${SSJ_CONFIG.accentColor}; }
      .ssj-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .ssj-textarea { width:100%; min-height:80px; resize:vertical; padding:9px 11px;
        border:1px solid #ddd; border-radius:8px; font-family:inherit; font-size:14px; }
      .ssj-textarea:focus { outline:none; border-color:${SSJ_CONFIG.accentColor}; }
      .ssj-select { width:100%; padding:9px 11px; border:1px solid #ddd; border-radius:8px;
        font-family:inherit; font-size:14px; background:#fff; }
      .ssj-footer { display:flex; justify-content:space-between; margin-top:1rem; }
      .ssj-btn { padding:10px 20px; border-radius:999px; font-size:13px; font-weight:500;
        cursor:pointer; border:1px solid #ddd; background:#fff; font-family:inherit;
        transition:all .15s; }
      .ssj-btn-primary { background:${SSJ_CONFIG.accentColor}; color:#050608;
        border-color:${SSJ_CONFIG.accentColor}; }
      .ssj-btn-primary:hover { opacity:.88; }
      .ssj-info { background:#f0f6ff; color:#185fa5; border-radius:8px; padding:10px 14px;
        font-size:12px; line-height:1.6; margin-top:.75rem; }
      .ssj-success { text-align:center; padding:2rem; }
      .ssj-wa-pill { display:inline-flex; align-items:center; gap:5px; padding:8px 16px;
        background:#25D366; color:#0a1f0e; border-radius:999px; font-size:13px;
        font-weight:500; text-decoration:none; margin-top:1rem; }
      .ssj-summary-table { width:100%; border-collapse:collapse; font-size:13px; }
      .ssj-summary-table td { padding:5px 0; }
      .ssj-summary-table td:first-child { color:#777; width:38%; }
      .ssj-summary-table td:last-child { font-weight:500; }
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var state = { step: 1, service: SSJ_CONFIG.services[0] };

    function render() {
      el.innerHTML = '';
      el.className = 'ssj-widget';

      if (state.step === 'success') {
        el.innerHTML = successHTML();
        return;
      }

      el.appendChild(buildSteps());

      if (state.step === 1) el.appendChild(buildStep1());
      if (state.step === 2) el.appendChild(buildStep2());
      if (state.step === 3) el.appendChild(buildStep3());
      if (state.step === 4) el.appendChild(buildStep4());
    }

    function buildSteps() {
      var labels = ['Service', 'Date & time', 'Your details', 'Confirm'];
      var wrap = document.createElement('div');
      wrap.className = 'ssj-steps';
      labels.forEach(function(lbl, i) {
        var n = i + 1;
        var s = document.createElement('div');
        s.className = 'ssj-step' + (n < state.step ? ' done' : n === state.step ? ' active' : '');
        var num = document.createElement('div');
        num.className = 'ssj-step-num';
        num.textContent = n < state.step ? '✓' : n;
        s.appendChild(num);
        var t = document.createElement('span');
        t.textContent = lbl;
        s.appendChild(t);
        wrap.appendChild(s);
        if (i < 3) {
          var line = document.createElement('div');
          line.className = 'ssj-step-line';
          wrap.appendChild(line);
        }
      });
      return wrap;
    }

    function buildStep1() {
      var card = document.createElement('div');
      card.className = 'ssj-card';
      var grid = document.createElement('div');
      grid.className = 'ssj-svc-grid';
      SSJ_CONFIG.services.forEach(function(svc) {
        var btn = document.createElement('button');
        btn.className = 'ssj-svc-btn' + (state.service.id === svc.id ? ' selected' : '');
        btn.innerHTML = '' + svc.label + 'From ' + svc.from + '';
        btn.onclick = function() { state.service = svc; render(); };
        grid.appendChild(btn);
      });
      card.appendChild(grid);
      var footer = document.createElement('div');
      footer.className = 'ssj-footer';
      footer.style.justifyContent = 'flex-end';
      footer.innerHTML = 'Next: pick a date →';
      card.appendChild(footer);
      card.querySelector('#ssj-next1').onclick = function() { state.step = 2; render(); };
      return card;
    }

    function buildStep2() {
      var card = document.createElement('div');
      card.className = 'ssj-card';
      card.innerHTML = `
        

          

            Preferred date
            
          

          

            Preferred time
            
          

        

        Flight number (airport transfers)
        
        Group size
        
        

          ← Back
          Next: your details →
        
`;
      card.querySelector('#ssj-back2').onclick = function() { saveStep2(card); state.step = 1; render(); };
      card.querySelector('#ssj-next2').onclick = function() { saveStep2(card); state.step = 3; render(); };
      return card;
    }

    function saveStep2(card) {
      state.date   = card.querySelector('#ssj-date').value;
      state.time   = card.querySelector('#ssj-time').value;
      state.flight = card.querySelector('#ssj-flight').value;
      state.group  = card.querySelector('#ssj-group').value;
    }

    function buildStep3() {
      var card = document.createElement('div');
      card.className = 'ssj-card';
      card.innerHTML = `
        

          

            Full name
            
          

          

            Email address
            
          

        

        

          

            WhatsApp / phone
            
          

          

            Country
            
          

        

        Hotel / pickup address
        
        Special requests
        
        

          ← Back
          Review booking →
        
`;
      card.querySelector('#ssj-back3').onclick = function() { saveStep3(card); state.step = 2; render(); };
      card.querySelector('#ssj-next3').onclick = function() {
        saveStep3(card);
        if (!state.name || !state.email) { alert('Please fill in your name and email address.'); return; }
        state.step = 4; render();
      };
      return card;
    }

    function saveStep3(card) {
      state.name    = card.querySelector('#ssj-name').value;
      state.email   = card.querySelector('#ssj-email').value;
      state.phone   = card.querySelector('#ssj-phone').value;
      state.country = card.querySelector('#ssj-country').value;
      state.hotel   = card.querySelector('#ssj-hotel').value;
      state.notes   = card.querySelector('#ssj-notes').value;
    }

    function buildStep4() {
      var card = document.createElement('div');
      card.className = 'ssj-card';
      var rows = [
        ['Service', state.service.label],
        ['Date', state.date || 'Not specified'],
        ['Time', state.time || '—'],
        ['Group size', state.group || '—'],
        state.flight ? ['Flight', state.flight] : null,
        ['Name', state.name],
        ['Email', state.email],
        ['Phone', state.phone || '—'],
        ['Pickup address', state.hotel || '—'],
        state.notes ? ['Requests', state.notes] : null
      ].filter(Boolean);

      var tableHTML = '' +
        rows.map(function(r){ return ''; }).join('') +
        '
'+r[0]+'	'+r[1]+'
';

      card.innerHTML = tableHTML +
        '
This sends a booking request — your host confirms within a few hours via email or WhatsApp.
' +
        '
← Back' +
        'Submit booking request
';

      card.querySelector('#ssj-back4').onclick = function() { state.step = 3; render(); };
      card.querySelector('#ssj-submit').onclick = function() { submitBooking(); };
      return card;
    }

    function submitBooking() {
      var btn = el.querySelector('#ssj-submit');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var payload = {
        _subject: 'New Booking Request — ' + SSJ_CONFIG.businessName,
        service: state.service.label,
        date: state.date, time: state.time, group: state.group,
        flight: state.flight, name: state.name, email: state.email,
        phone: state.phone, hotel: state.hotel, notes: state.notes
      };
      fetch('https://formspree.io/f/' + SSJ_CONFIG.formspreeId, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d.ok) { state.step = 'success'; render(); }
        else { alert('Something went wrong. Please email ' + SSJ_CONFIG.businessName + ' directly.'); if(btn){ btn.disabled=false; btn.textContent='Submit booking request'; } }
      })
      .catch(function(){ alert('Something went wrong. Please try again.'); if(btn){ btn.disabled=false; btn.textContent='Submit booking request'; } });
    }

    function successHTML() {
      var waMsg = encodeURIComponent('Hi, I just submitted a booking request for ' + state.service.label + '. My name is ' + (state.name||'a guest') + '.');
      return '
' +
        '
✓
' +
        '
Request received!
' +
        '
Your host will confirm within a few hours. Check your email for a copy.
' +
        'Chat on WhatsApp' +
        '

Make another booking' +
        '
';
    }

    render();
    return { mount: mount };
  }

  window.ssjWidget = { mount: mount };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ mount('ssj-booking-widget'); });
  } else {
    mount('ssj-booking-widget');
  }
})();
