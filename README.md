# Landing de verificación para Trimadeco

Landing sencilla que muestra claramente el destino `https://www.trimadeco.com/` y usa Cloudflare Turnstile con validación del token en una función serverless de Vercel.

## 1. Crear las claves de Turnstile

1. Entra a https://dash.cloudflare.com/ y abre **Turnstile**.
2. Crea un widget para los dominios donde publicarás la página (por ejemplo, tu dominio de Vercel y tu dominio personalizado).
3. Copia la **Site key** y la **Secret key**.

## 2. Subir a GitHub

Sube todos los archivos y carpetas de este proyecto a un repositorio nuevo. Mantén `api/config.js` y `api/verify.js` dentro de la carpeta `api`.

## 3. Importar en Vercel

1. Entra a https://vercel.com/ y selecciona **Add New → Project**.
2. Importa el repositorio de GitHub.
3. En **Settings → Environment Variables**, agrega:
   - `TURNSTILE_SITE_KEY` = tu Site key (clave pública).
   - `TURNSTILE_SECRET_KEY` = tu Secret key (clave privada).
4. Aplica las variables a Production (y Preview si lo necesitas).
5. Haz un nuevo Deploy.

No publiques la Secret key en GitHub ni la pongas en `app.js` o `index.html`.

## 4. Probar

Abre el dominio de Vercel. La página informa al visitante que continuará a `www.trimadeco.com`. Al superar Turnstile y pulsar **Verificar y continuar**, el servidor valida el token y recién entonces el navegador redirige al destino.

## Personalización

El destino está definido en `app.js`, en la constante `DESTINATION`. En este proyecto queda fijado a `https://www.trimadeco.com/`.

## Nota

La verificación real depende de configurar correctamente las dos variables de entorno y autorizar el dominio en el panel de Cloudflare Turnstile. La clave secreta debe mantenerse solo en las variables de entorno de Vercel.
