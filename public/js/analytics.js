/**
 * ROH Tiling — consent-gated Google Tag Manager.
 * Basic consent mode: no analytics library loads until the visitor opts in.
 * Keeps analytics and advertising consent separate; advertising stays denied.
 * Never send form contents, names, email addresses, phone numbers or full URLs
 * containing possible user-provided information.
 */
(() => {
  'use strict';
  // Guard the consent bridge if a second script element is added accidentally.
  if (window.rohAnalytics) return;
  const CONTAINER_ID = 'GTM-MW3J6S4L';
  const CONSENT_KEY = 'roh-analytics-choice-v1';
  const preview = document.currentScript?.dataset.preview === 'true';

  // A preview deployment is measurable only in the tab used for Tag Assistant.
  if (preview) {
    const debugLink = new URLSearchParams(window.location.search).has('gtm_debug');
    try {
      if (debugLink) sessionStorage.setItem('roh-tag-assistant-preview', 'yes');
      if (sessionStorage.getItem('roh-tag-assistant-preview') !== 'yes') return;
    } catch (_) {
      if (!debugLink) return;
    }
  }
  let consent = 'unset';
  let started = false;

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

  function safePageLocation() {
    const incoming = new URL(window.location.href);
    const canonical = document.querySelector('link[rel="canonical"]');
    const path = canonical ? new URL(canonical.href).pathname : '/';
    const sanitized = new URL(path, incoming.origin);
    const campaign = incoming.searchParams.get('utm_campaign');
    const gbpCampaigns = ['gbp', 'google_business_profile', 'google-business-profile'];
    if (incoming.searchParams.get('utm_source') === 'google'
      && incoming.searchParams.get('utm_medium') === 'organic'
      && gbpCampaigns.includes(campaign)) {
      sanitized.searchParams.set('utm_source', 'google');
      sanitized.searchParams.set('utm_medium', 'organic');
      sanitized.searchParams.set('utm_campaign', 'gbp');
    }
    return sanitized.href;
  }

  function safePageReferrer() {
    try {
      const referrer = new URL(document.referrer);
      return ['http:', 'https:'].includes(referrer.protocol) ? referrer.origin + '/' : '';
    } catch (_) {
      return '';
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
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
      roh_page_location: safePageLocation(),
      roh_page_referrer: safePageReferrer()
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CONTAINER_ID);
    document.head.appendChild(script);
  }

  window.rohAnalytics = {
    record(name, detail = {}) {
      if (consent !== 'accepted' || !started) return;
      if (name === 'roh_click_to_call') {
        window.dataLayer.push({ event: 'phone_click', roh_form_type: undefined });
      } else if (name === 'roh_email_click') {
        window.dataLayer.push({ event: 'email_click', roh_form_type: undefined });
      } else if (name === 'roh_enquiry_success') {
        window.dataLayer.push({
          event: 'generate_lead',
          roh_form_type: detail.form === 'quote' ? 'quote' : 'contact'
        });
      }
    }
  };

  const banner = document.getElementById('roh-analytics-consent');
  const manage = document.getElementById('roh-analytics-manage');
  const allow = document.getElementById('roh-analytics-accept');
  const decline = document.getElementById('roh-analytics-decline');
  if (manage) manage.hidden = false;
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
