// ВСТАВЬТЕ СЮДА адрес почты, на который должны приходить заявки.
const RECEIVER_EMAIL = "YOUR_EMAIL@example.com";

const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (RECEIVER_EMAIL === "YOUR_EMAIL@example.com") {
    statusMessage.textContent = "Сначала укажите свою почту в файле script.js.";
    statusMessage.className = "form-status error";
    return;
  }

  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  statusMessage.textContent = "";
  statusMessage.className = "form-status";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(RECEIVER_EMAIL)}`, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    const result = await response.json();

    if (!response.ok || result.success === "false" || result.success === false) {
      throw new Error(result.message || "Не удалось отправить форму.");
    }

    statusMessage.textContent = "Спасибо! Заявка отправлена. Мы скоро свяжемся с вами.";
    statusMessage.className = "form-status success";
    form.reset();
  } catch (error) {
    statusMessage.textContent = "Не получилось отправить заявку. Попробуйте ещё раз или свяжитесь с нами другим способом.";
    statusMessage.className = "form-status error";
    console.error("Form submission error:", error);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Отправить <span aria-hidden="true">→</span>';
  }
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();


// Открытие и закрытие формы обратной связи
const contactModal = document.querySelector("#contact-modal");
const openContactButtons = document.querySelectorAll("[data-open-contact]");
const closeContactButtons = document.querySelectorAll("[data-close-contact]");
let lastFocusedElement = null;

function openContactModal() {
  if (contactModal.classList.contains("is-open")) return;
  lastFocusedElement = document.activeElement;
  contactModal.classList.add("is-open");
  contactModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  contactModal.querySelector(".contact-modal-close").focus();
}

function closeContactModal() {
  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

openContactButtons.forEach(button => button.addEventListener("click", openContactModal));
closeContactButtons.forEach(button => button.addEventListener("click", closeContactModal));
document.addEventListener("keydown", event => {
  if (!contactModal.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeContactModal();
    return;
  }

  // Не даём клавиатурному фокусу уходить за пределы открытого окна.
  if (event.key === "Tab") {
    const focusable = [...contactModal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(element => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
