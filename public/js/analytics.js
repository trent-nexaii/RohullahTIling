/**
 * ROH Tiling — privacy-conscious Google Analytics 4.
 * Basic consent mode: no analytics library loads until the visitor opts in.
 * Keeps analytics and advertising consent separate; advertising stays denied.
 * Never send form contents, names, email addresses, phone numbers or full URLs
 * containing possible user-provided information.
 */
(() => {
  'use strict';
  // Keep one configuration and one page view even if this file is included twice.
  if (window.rohAnalytics) return;
  const MEASUREMENT_ID = 'G-2PHKFXFMS7';
  const CONSENT_KEY = 'roh-analytics-choice-v1';
  let consent = 'unset';
  let started = false;

  // Canonical paths are authored by the site, including /404 for unknown URLs.
  // Never pass visitor-supplied query strings, fragments or unknown paths to GA.
  const pagePath = new URL(document.querySelector('link[rel="canonical"]').href).pathname;
  let referrer = '';
  try {
    // Keep the referring site for attribution, without its potentially private URL.
    referrer = new URL(document.referrer).origin + '/';
  } catch (_) { /* No referrer on direct visits. */ }

  function readChoice() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (_) {
      return null;
    }
  }
  function saveChoice(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch (_) {
      // Tracking remains opt-in for this page if browser storage is blocked.
    }
  }

  function startAnalytics() {
    if (started || consent !== 'accepted') return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Consent defaults are established before any gtag configuration or events.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: true,
      page_location: window.location.origin + pagePath,
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  window.rohAnalytics = {
    record(name, detail = {}) {
      if (consent !== 'accepted' || !started || typeof window.gtag !== 'function') return;
      if (name === 'roh_click_to_call') {
        // A phone-link tap is NOT a confirmed connected call or qualified lead.
        window.gtag('event', 'click_to_call', {
          page_path: pagePath,
          engagement_type: 'phone_link'
        });
      } else if (name === 'roh_email_click') {
        // Opening an email app does not confirm an enquiry was sent.
        window.gtag('event', 'email_click', {
          page_path: pagePath,
          engagement_type: 'email_link'
        });
      } else if (name === 'roh_enquiry_success') {
        // Only after /api/enquiry confirms provider acceptance, not inbox delivery.
        window.gtag('event', 'generate_lead', {
          form_type: detail.form === 'quote' ? 'quote' : 'contact',
          page_path: pagePath
        });
      }
    }
  };

  const banner = document.getElementById('roh-analytics-consent');
  const manage = document.getElementById('roh-analytics-manage');
  const allow = document.getElementById('roh-analytics-accept');
  const decline = document.getElementById('roh-analytics-decline');
  const choice = readChoice();
  if (choice === 'accepted') {
    consent = 'accepted';
    startAnalytics();
  } else if (choice === 'declined') {
    consent = 'declined';
  } else if (banner) {
    banner.hidden = false;
  }

  if (manage && banner) {
    manage.addEventListener('click', () => {
      banner.hidden = false;
      if (allow) allow.focus();
    });
  }
  if (allow) {
    allow.addEventListener('click', () => {
      consent = 'accepted';
      saveChoice(consent);
      if (banner) banner.hidden = true;
      startAnalytics();
    });
  }
  if (decline) {
    decline.addEventListener('click', () => {
      const wasAccepted = consent === 'accepted';
      consent = 'declined';
      saveChoice(consent);
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
      }
      if (banner) banner.hidden = true;
      // After revocation, reload so previously loaded analytics cannot continue.
      if (wasAccepted) window.location.reload();
    });
  }
})();
