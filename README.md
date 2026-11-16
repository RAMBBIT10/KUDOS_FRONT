# UCO Kudos – Frontend

Aplicación web instalable (PWA) de UCO Kudos, hecha con React y Vite. Consume el backend: https://github.com/RAMBBIT10/uco-kudos-backend

Autor: Diego Alejandro Vega, Ingeniería del Software II, Universidad Católica de Oriente.

## Qué hace

- Solicitar una cuenta (con cualquier correo) y esperar la aprobación del administrador.
- Ingresar con correo y contraseña; si no hay cuenta, si la solicitud está pendiente o si fue rechazada, la pantalla lo dice.
- El administrador ve un panel con las solicitudes pendientes y las aprueba o rechaza.
- Publicar un Kudo a otra persona, con mensaje de hasta 500 caracteres y hasta 5 adjuntos (imágenes o PDF).
- Ver los Kudos recibidos, con el botón "Ver más" (paginación por cursor).
- Recibir un aviso en tiempo real cuando alguien te manda un Kudo (Server-Sent Events, `GET /push?token=...`).
- Instalarse en el celular (manifest y service worker).

## Cómo correrlo

Necesitas Node 20 o superior y el backend corriendo.

```
copy .env.example .env
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`). La variable `VITE_API_URL` apunta al backend (por defecto `http://localhost:3000`) y `VITE_PREFIJO_TELEFONO` es el prefijo del país que se muestra junto al teléfono (por defecto `+57`).

Para que el backend acepte al frontend, en su `.env` deja `CORS_ORIGENES=*` o pon la dirección del frontend.

## Pruebas y construcción

| Comando | Qué hace |
|---|---|
| `npm test` | Corre las 18 pruebas (componentes con Vitest y Testing Library) |
| `npm run build` | Genera la carpeta `dist` lista para publicar |

## Estructura

```
src/
  api.js                  Llamadas al backend y conexión de push
  App.jsx                 Sesión, aviso en tiempo real y pantalla principal
  componentes/
    Ingreso.jsx           Ingresar con correo y contraseña
    SolicitudCuenta.jsx   Pedir una cuenta
    PanelAdministrador.jsx Aprobar o rechazar solicitudes
    FormularioKudo.jsx    Publicar un Kudo
    ListaKudos.jsx        Kudos recibidos con paginación
  pruebas/                Pruebas de los componentes
public/
  manifest.webmanifest    Datos para instalar la app
  sw.js                   Service worker (la app abre aunque no haya red)
```

## Despliegue en Azure Static Web Apps

El archivo `.github/workflows/ci-cd.yml` prueba, construye y publica cuando se hace push a `main`.

1. Crear un recurso Static Web Apps en Azure, sin conectarlo a GitHub (se publica con el token).
2. Copiar su token de implementación a un secreto del repositorio llamado `AZURE_STATIC_WEB_APPS_API_TOKEN`.
3. Crear la variable de repositorio `URL_API` con la URL pública del backend, sin la barra final.
4. En el backend, poner en `CORS_ORIGENES` la URL de este frontend.

## Limitaciones conocidas

- La sesión (token) se guarda en el navegador; si vence, la app pide ingresar de nuevo.
- La clave temporal que llega por correo todavía no obliga a cambiarla.
- Si alguien abre la app sin conexión, ve lo último que cargó, pero no puede publicar.
