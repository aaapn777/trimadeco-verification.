const DESTINATION = "https://www.trimadeco.com/";

const loading = document.getElementById("loading");
const statusText = document.getElementById("status");
const continueButton = document.getElementById("continue-button");
let turnstileToken = "";
let widgetId = null;

async function loadTurnstile() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("No se pudo cargar la configuración.");
    const config = await response.json();
    if (!config.siteKey) throw new Error("Falta configurar la clave pública de Turnstile.");

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      loading.hidden = true;
      widgetId = turnstile.render("#turnstile-container", {
        sitekey: config.siteKey,
        theme: "light",
        callback: (token) => {
          turnstileToken = token;
          statusText.textContent = "Verificación completada. Pulsa continuar.";
          statusText.style.color = "#067647";
          continueButton.disabled = false;
        },
        "expired-callback": () => {
          turnstileToken = "";
          continueButton.disabled = true;
          statusText.textContent = "La verificación venció. Inténtalo nuevamente.";
          statusText.style.color = "#b42318";
        },
        "error-callback": () => {
          turnstileToken = "";
          continueButton.disabled = true;
          statusText.textContent = "No fue posible completar la verificación. Recarga la página.";
          statusText.style.color = "#b42318";
        }
      });
    };
    script.onerror = () => { throw new Error("No se pudo cargar el servicio de verificación."); };
    document.head.appendChild(script);
  } catch (error) {
    loading.textContent = error.message;
    statusText.textContent = "Revisa la configuración de Turnstile en Vercel.";
  }
}

continueButton.addEventListener("click", async () => {
  if (!turnstileToken) return;
  continueButton.disabled = true;
  continueButton.textContent = "Comprobando…";
  statusText.textContent = "";

  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("No se pudo validar la comprobación. Inténtalo de nuevo.");

    statusText.textContent = "Verificación correcta. Redirigiendo…";
    window.location.assign(DESTINATION);
  } catch (error) {
    statusText.textContent = error.message;
    continueButton.textContent = "Verificar y continuar";
    continueButton.disabled = false;
  }
});

loadTurnstile();
