/* Progressive enhancement. Successful enquiries are counted only after API acceptance. */
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("hamburger");
  const navigation = document.querySelector(".nav-mobile");
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    menu?.setAttribute("aria-expanded", "false");
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    document.body.classList.toggle("nav-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  navigation
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!menu?.contains(event.target) && !navigation?.contains(event.target))
      closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu?.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });

  // No analytics vendor or property is added. Existing analytics can consume these
  // non-PII events. A phone click is never labelled as a completed call or lead.
  const track = (event, detail = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail });
  };
  document
    .querySelectorAll('a[href^="tel:"]')
    .forEach((link) =>
      link.addEventListener("click", () => track("roh_phone_click")),
    );
  const confirmationKey = "roh-enquiry-confirmed";
  if (location.pathname.replace(/\/$/, "") === "/thank-you") {
    let confirmed;
    try {
      confirmed = JSON.parse(sessionStorage.getItem(confirmationKey) || "null");
      sessionStorage.removeItem(confirmationKey);
    } catch {
      /* Direct visits do not imply a submission. */
    }
    if (
      confirmed?.accepted === true &&
      Date.now() - confirmed.at < 300000 &&
      Date.now() >= confirmed.at
    ) {
      document.getElementById("confirmation-title").textContent =
        "Thanks. Your enquiry has been sent.";
      document.getElementById("confirmation-message").textContent =
        "Roh will reply within 24 hours. If you have a photograph or another detail to add, mention your name when you get in touch.";
      track("roh_quote_completed", {
        service: confirmed.service,
        contact_method: confirmed.contact_method,
      });
      // Preserve the readable receipt on reload, without counting it again.
      history.replaceState({ rohReceipt: true }, "", location.href);
    } else if (history.state?.rohReceipt) {
      document.getElementById("confirmation-title").textContent =
        "Thanks. Your enquiry has been sent.";
      document.getElementById("confirmation-message").textContent =
        "Roh will reply within 24 hours.";
    }
  }

  document.querySelectorAll(".contact-form form").forEach((form) => {
    form.noValidate = true;
    const contact = form.elements.contact_detail;
    const photo = form.elements.photo;
    photo.disabled = false;
    const contactLabel = document.getElementById("contact-detail-label");
    const status = form.querySelector(".form-status");
    const fields = [
      ...form.querySelectorAll("input:not([type=radio]), select, textarea"),
    ].filter((field) => field.name !== "company");
    const submit = form.querySelector("[type=submit]");
    let pending = false;
    let requestId = crypto.randomUUID();
    function clearError(field) {
      field.removeAttribute("aria-invalid");
      field.classList.remove("field-error");
      const error = document.getElementById(`${field.id}-error`);
      error?.remove();
      field.setAttribute(
        "aria-describedby",
        field === photo ? "photo-hint" : "",
      );
    }
    function showError(field, message) {
      clearError(field);
      field.classList.add("field-error");
      field.setAttribute("aria-invalid", "true");
      const error = document.createElement("span");
      error.id = `${field.id}-error`;
      error.className = "error-message";
      error.textContent = message;
      field.after(error);
      field.setAttribute(
        "aria-describedby",
        [field === photo ? "photo-hint" : "", error.id]
          .filter(Boolean)
          .join(" "),
      );
    }
    function updateContact() {
      const email = form.elements.preferred_contact.value === "email";
      contact.type = email ? "email" : "tel";
      contact.autocomplete = email ? "email" : "tel";
      contactLabel.textContent = email ? "Email address" : "Phone number";
      contact.value = "";
      clearError(contact);
    }
    form
      .querySelectorAll("[name=preferred_contact]")
      .forEach((radio) => radio.addEventListener("change", updateContact));
    updateContact();
    const service = new URLSearchParams(location.search).get("service");
    if (
      [...form.elements.service.options].some(
        (option) => option.value === service,
      )
    )
      form.elements.service.value = service;
    function validate(field) {
      clearError(field);
      if (field === photo) {
        const file = photo.files[0];
        if (
          file &&
          (!["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
            file.size > 2 * 1024 * 1024 ||
            file.size === 0)
        ) {
          showError(field, "Choose a JPG, PNG or WebP photo up to 2 MB.");
          return false;
        }
        return true;
      }
      const value = field.value.trim();
      let error = field.required && !value ? "Please fill in this field." : "";
      if (!error && field === contact) {
        if (
          form.elements.preferred_contact.value === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        )
          error = "Enter an email address, such as name@example.com.";
        if (
          form.elements.preferred_contact.value === "phone" &&
          (!/^\+?[\d\s\-()]{7,25}$/.test(value) ||
            value.replace(/\D/g, "").length < 7)
        )
          error = "Enter a phone number with at least 7 digits.";
      }
      if (error) showError(field, error);
      return !error;
    }
    fields.forEach((field) => {
      field.addEventListener("blur", () => validate(field));
      field.addEventListener("input", () => clearError(field));
    });
    const readPhoto = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () =>
          resolve({
            name: file.name,
            type: file.type,
            content: String(reader.result).split(",")[1],
          });
        reader.readAsDataURL(file);
      });
    function fallback(payload) {
      status.replaceChildren(
        document.createTextNode(
          "Your enquiry has not been sent. Try again, or ",
        ),
      );
      const email = document.createElement("a");
      const body = `Name: ${payload.full_name}\nReply by ${payload.preferred_contact}: ${payload.contact_detail}\nSuburb: ${payload.suburb}\nService: ${form.elements.service.selectedOptions[0]?.textContent}\n\n${payload.description}`;
      email.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
      email.textContent = "open it in your email app";
      status.append(
        email,
        document.createTextNode(
          " and press send. Attach your photo there if you have one. You can also call ",
        ),
      );
      const phone = document.createElement("a");
      phone.href = "tel:+642102602044";
      phone.textContent = "021 026 02044";
      status.append(phone, document.createTextNode("."));
      status.focus();
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending) return;
      const valid = fields.map(validate).every(Boolean);
      if (!valid) {
        form.querySelector("[aria-invalid=true]")?.focus();
        return;
      }
      pending = true;
      submit.disabled = true;
      submit.textContent = "Sending…";
      status.hidden = false;
      status.textContent = "Sending your enquiry…";
      const payload = Object.fromEntries(
        [...new FormData(form)].filter(([key]) => key !== "photo"),
      );
      payload.request_id = requestId;
      try {
        if (photo.files[0]) payload.photo = await readPhoto(photo.files[0]);
        const response = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true || result.accepted !== true)
          throw new Error("Enquiry not accepted");
        const receipt = {
          accepted: true,
          at: Date.now(),
          service: payload.service,
          contact_method: payload.preferred_contact,
        };
        let stored = false;
        try {
          sessionStorage.setItem(confirmationKey, JSON.stringify(receipt));
          stored = true;
        } catch {
          /* Inline receipt works when storage is unavailable. */
        }
        if (stored) {
          location.assign("/thank-you");
          return;
        }
        form.reset();
        updateContact();
        requestId = crypto.randomUUID();
        status.textContent =
          "Thanks. Your enquiry has been sent. Roh will reply within 24 hours.";
        status.focus();
        track("roh_quote_completed", {
          service: receipt.service,
          contact_method: receipt.contact_method,
        });
      } catch {
        fallback(payload);
      } finally {
        pending = false;
        submit.disabled = false;
        submit.textContent = "Request a quote";
      }
    });
  });
});
