/* Website Sales Factory — shared site behaviour (no dependencies, no secrets). */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* Mobile navigation (disclosure pattern) */
  var toggle = document.querySelector(".nav-toggle");
  var panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  function setOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    var label = toggle.querySelector(".nav-toggle__label");
    if (label) label.textContent = open ? "Close" : "Menu";
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 56.01rem)").addEventListener("change", function (mq) { if (mq.matches) setOpen(false); });
  }

  /* Reveal on scroll (restrained) */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* WhatsApp enquiry form: composes a message and opens wa.me (no backend). */
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.value.trim() !== "";
        field.setAttribute("aria-invalid", String(!ok));
        if (!ok && valid) { field.focus(); valid = false; }
      });
      if (!valid) { if (status) status.textContent = "Please fill in the required fields."; return; }
      var lines = [form.getAttribute("data-intro") || "Hello, I'd like to make an enquiry."];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || !field.value.trim()) return;
        var label = form.querySelector('label[for="' + field.id + '"]');
        lines.push((label ? label.textContent.replace("*", "").trim() : field.name) + ": " + field.value.trim());
      });
      var number = form.getAttribute("data-whatsapp");
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
      if (status) status.textContent = "Opening WhatsApp with your message…";
      window.open(url, "_blank", "noopener");
    });
  });

  /* Current year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ==========================================================================
   Pleasant Cakes & Treats — Interactive Cake Customizer & Tasting Selector
   Authentic High-Resolution Imagery for Every Cake Size & Flavor Option
   Zero 3D dependencies · Fast, lightweight, mobile-optimized
   ========================================================================== */

(function () {
  'use strict';

  var SIZES = {
    'bento': {
      name: 'Express Same-Day Bento Cake (4-inch)',
      label: 'Bento Box (4")',
      price: '₦14,000',
      specs: '4" Diameter · Serves 1–2 · Candle Included',
      badge: '✨ Korean Dosirak Minimalist',
      image: 'assets/img/cake-bento.jpg',
      desc: 'Delicate 4-inch Korean lunchbox celebration cake frosted in silky pastel cream with vintage fluted shell borders and a single glossy red cherry. Ideal for spontaneous surprises, intimate milestones, or sweet desk birthdays.'
    },
    'signature': {
      name: 'Signature Birthday Drip Cake (8-inch)',
      label: 'Signature 8" Drip Cake',
      price: '₦32,000',
      specs: '8" Diameter · 3 Tall Layers · Serves 10–12',
      badge: '🎂 Surulere Luxury Best-Seller',
      image: 'assets/img/cake-8inch.jpg',
      desc: 'Three towering layers of moist sponge frosted in hand-textured Italian meringue buttercream, finished with cascading Belgian chocolate ganache drips, fresh ripe strawberries, French macarons, and 24k gold leaf.'
    },
    'tier2': {
      name: 'Two-Tier Grand Celebration Cake',
      label: '2-Tier Grand',
      price: '₦75,000',
      specs: '10" Base + 6" Top Tier · Serves 25–30',
      badge: '👑 Wedding & Milestone Centerpiece',
      image: 'assets/img/cake-2tier.jpg',
      desc: 'Architectural two-tier masterpiece with pristine ivory buttercream tiers, cascading fresh garden florals, ruby berries, French macarons, and hand-applied edible gold flakes. Designed for grand weddings and milestone galas.'
    },
    'cupcakes': {
      name: 'Gourmet Cupcake Box (Pack of 6)',
      label: 'Cupcake Box (6)',
      price: '₦9,500',
      specs: 'Box of 6 Individual Artisanal Bakes',
      badge: '🧁 Daily Fresh Oven Batch',
      image: 'assets/img/cake-cupcakes.jpg',
      desc: 'Handcrafted cupcakes in pleated baking cups with dramatic 1M star-piped buttercream swirl peaks, fine cocoa dusting, and fresh fruit toppers. Baked fresh every morning at Leisure Mall.'
    }
  };

  var FLAVORS = {
    'red-velvet': {
      name: 'Southern Red Velvet',
      dot: '#9f1239',
      notes: 'Moist crimson cocoa sponge layered with Madagascar vanilla cream cheese frosting and rich berry drizzle.'
    },
    'chocolate': {
      name: 'Belgian Chocolate Fudge',
      dot: '#3c1808',
      notes: 'Decadent double-dark chocolate sponge blanketed in velvety 60% cocoa ganache and crisp chocolate pearls.'
    },
    'vanilla': {
      name: 'Madagascar Vanilla Bean',
      dot: '#d97706',
      notes: 'Fragrant golden sponge infused with real bourbon vanilla bean caviar and light Swiss meringue buttercream.'
    },
    'caramel': {
      name: 'Salted Caramel Swirl',
      dot: '#b45309',
      notes: 'Rich brown-sugar sponge marbled with handcrafted dulce de leche and fleur de sel caramel glaze.'
    }
  };

  var currentSizeKey = 'signature';
  var currentFlavorKey = 'red-velvet';

  function initCakeStudio() {
    var servicesContainer = document.querySelector('.services-section, section#services, .services');
    if (!servicesContainer) return;

    var studioBox = document.createElement('div');
    studioBox.className = 'container';
    studioBox.innerHTML = [
      '<div id="cake-customizer-box">',
      '  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 22px;">',
      '    <div style="display: flex; align-items: center; gap: 10px;">',
      '      <span class="hero-badge">🎂 Interactive Cake & Flavor Selector</span>',
      '      <span style="font-size: 0.85rem; color: #475569; font-weight: 600;">Authentic Bakery Showcase</span>',
      '    </div>',
      '    <span style="font-size: 0.85rem; color: #be123c; font-weight: 600;">Shop FF05/FF02 · Leisure Mall, Surulere</span>',
      '  </div>',
      '  ',
      '  <div class="cake-studio-grid">',
      '    <!-- Left: Photorealistic Cake Showcase -->',
      '    <div>',
      '      <div id="cake-photo-stage">',
      '        <div class="stage-badge-photo" id="photo-stage-badge">🎂 Surulere Luxury Best-Seller</div>',
      '        <img id="cake-photo-main" src="assets/img/cake-8inch.jpg" alt="Signature 8 Inch Drip Cake at Pleasant Cakes & Treats">',
      '        <div class="stage-badge-location">',
      '          <span id="photo-stage-specs" style="color: #be123c; font-weight: 700;">8" Diameter · Serves 10–12</span>',
      '          <span style="color: #475569;">Daily Fresh Counter Bake</span>',
      '        </div>',
      '      </div>',
      '      ',
      '      <div class="cake-visual-card" id="cake-visual-card">',
      '        <div class="cake-visual-info">',
      '          <div class="cake-visual-specs" id="visual-card-flavor-label">SPONGE & FLAVOR PROFILE</div>',
      '          <div class="cake-visual-title" id="visual-card-title">Signature 8" Drip Cake · Southern Red Velvet</div>',
      '          <div class="cake-visual-desc" id="visual-card-desc">Moist crimson cocoa sponge layered with Madagascar vanilla cream cheese frosting and rich berry drizzle.</div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    ',
      '    <!-- Right: Size & Flavor Selection Controls -->',
      '    <div>',
      '      <h3 style="font-size: 1.45rem; margin-bottom: 6px; color: #1e1b18;">Choose Your Cake Size & Flavor</h3>',
      '      <p style="color: #475569; font-size: 0.925rem; margin-bottom: 20px;">Click each cake size to preview the authentic bake, portion specifications, and real pricing.</p>',
      '      ',
      '      <div style="margin-bottom: 18px;">',
      '        <div style="font-weight: 700; font-size: 0.825rem; text-transform: uppercase; letter-spacing: 0.05em; color: #be123c; margin-bottom: 8px;">1. Select Cake Size</div>',
      '        <div class="customizer-chips" id="cake-size-chips">',
      '          <button type="button" class="customizer-chip" data-size="bento">Bento Box (4") — ₦14,000</button>',
      '          <button type="button" class="customizer-chip active" data-size="signature">Signature 8" Drip — ₦32,000</button>',
      '          <button type="button" class="customizer-chip" data-size="tier2">2-Tier Grand — ₦75,000</button>',
      '          <button type="button" class="customizer-chip" data-size="cupcakes">Cupcake Box (6) — ₦9,500</button>',
      '        </div>',
      '      </div>',
      '      ',
      '      <div style="margin-bottom: 20px;">',
      '        <div style="font-weight: 700; font-size: 0.825rem; text-transform: uppercase; letter-spacing: 0.05em; color: #be123c; margin-bottom: 8px;">2. Select Sponge & Frosting Flavor</div>',
      '        <div class="customizer-chips" id="cake-flavor-chips">',
      '          <button type="button" class="customizer-chip active" data-flavor="red-velvet">Southern Red Velvet</button>',
      '          <button type="button" class="customizer-chip" data-flavor="chocolate">Belgian Chocolate Fudge</button>',
      '          <button type="button" class="customizer-chip" data-flavor="vanilla">Madagascar Vanilla</button>',
      '          <button type="button" class="customizer-chip" data-flavor="caramel">Salted Caramel Swirl</button>',
      '        </div>',
      '      </div>',
      '      ',
      '      <div style="background: #fff8f9; border: 1px solid #fce7f3; border-radius: 14px; padding: 14px 16px; margin-bottom: 18px;">',
      '        <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #be123c; margin-bottom: 4px;">About This Cake</div>',
      '        <div id="cake-size-description" style="font-size: 0.875rem; color: #334155; line-height: 1.45;">' + SIZES.signature.desc + '</div>',
      '      </div>',
      '      ',
      '      <div class="customizer-output">',
      '        <div>',
      '          <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;" id="customizer-selection-summary">Selected: Signature 8" Drip Cake · Southern Red Velvet</div>',
      '          <div class="customizer-price-tag" id="customizer-price">₦32,000</div>',
      '        </div>',
      '        <a id="customizer-cta" href="#" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 12px 24px; text-decoration: none;">',
      '          Order via WhatsApp 💬',
      '        </a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    servicesContainer.parentNode.insertBefore(studioBox, servicesContainer.nextSibling);

    var photoEl = document.getElementById('cake-photo-main');
    var badgeEl = document.getElementById('photo-stage-badge');
    var specsEl = document.getElementById('photo-stage-specs');
    var visualTitleEl = document.getElementById('visual-card-title');
    var visualDescEl = document.getElementById('visual-card-desc');
    var sizeDescEl = document.getElementById('cake-size-description');
    var summaryEl = document.getElementById('customizer-selection-summary');
    var priceEl = document.getElementById('customizer-price');
    var ctaEl = document.getElementById('customizer-cta');

    function updateView() {
      var s = SIZES[currentSizeKey];
      var f = FLAVORS[currentFlavorKey];
      if (!s || !f) return;

      // Smooth crossfade transition for realistic photo
      if (photoEl) {
        photoEl.classList.add('fading');
        setTimeout(function () {
          photoEl.src = s.image;
          photoEl.alt = s.name + ' at Pleasant Cakes & Treats';
          photoEl.classList.remove('fading');
        }, 120);
      }

      if (badgeEl) badgeEl.textContent = s.badge;
      if (specsEl) specsEl.textContent = s.specs;
      if (sizeDescEl) sizeDescEl.textContent = s.desc;

      if (visualTitleEl) {
        visualTitleEl.textContent = s.label + ' · ' + f.name;
      }
      if (visualDescEl) {
        visualDescEl.textContent = f.notes;
      }

      if (summaryEl) {
        summaryEl.textContent = 'Selected: ' + s.label + ' · ' + f.name;
      }
      if (priceEl) {
        priceEl.textContent = s.price;
      }

      if (ctaEl) {
        var msg = 'Hello Pleasant Cakes & Treats, I would like to order the ' + s.name + ' in ' + f.name + ' (' + s.price + ') for pickup/delivery from your Leisure Mall store.';
        ctaEl.href = 'https://wa.me/2347088596081?text=' + encodeURIComponent(msg);
      }
    }

    // Attach chip event handlers
    var sizeChips = document.querySelectorAll('#cake-size-chips .customizer-chip');
    sizeChips.forEach(function (btn) {
      btn.addEventListener('click', function () {
        sizeChips.forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        currentSizeKey = btn.getAttribute('data-size');
        updateView();
      });
    });

    var flavorChips = document.querySelectorAll('#cake-flavor-chips .customizer-chip');
    flavorChips.forEach(function (btn) {
      btn.addEventListener('click', function () {
        flavorChips.forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        currentFlavorKey = btn.getAttribute('data-flavor');
        updateView();
      });
    });

    updateView();
  }

  function initStickyMobileBar() {
    var bar = document.createElement('div');
    bar.id = 'sticky-cake-bar';
    bar.innerHTML = [
      '<div>',
      '  <div style="font-size: 0.72rem; color: #9f1239; font-weight: 700; text-transform: uppercase;">Leisure Mall Bakery</div>',
      '  <div style="font-weight: 700; font-size: 0.95rem; color: #1e1b18;">Pleasant Cakes</div>',
      '</div>',
      '<a href="https://wa.me/2347088596081?text=Hello%20Pleasant%20Cakes%20%26%20Treats%2C%20I%20would%20like%20to%20order%20a%20cake." target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 18px; font-size: 0.875rem; text-decoration: none;">',
      '  Order on WhatsApp ⚡',
      '</a>'
    ].join('\n');
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCakeStudio();
      initStickyMobileBar();
    });
  } else {
    initCakeStudio();
    initStickyMobileBar();
  }
})();
