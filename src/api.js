export const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let tokenActual = ''

export function guardarToken(token) {
  tokenActual = token || ''
}

function cabeceras(extra = {}) {
  if (!tokenActual) {
    return extra
  }
  return { ...extra, Authorization: `Bearer ${tokenActual}` }
}

async function leerRespuesta(respuesta) {
  if (respuesta.ok) {
    if (respuesta.status === 204) {
      return null
    }
    return respuesta.json()
  }
  let mensaje = 'Algo salió mal, intenta de nuevo'
  try {
    const cuerpo = await respuesta.json()
    if (cuerpo.mensaje) {
      mensaje = cuerpo.mensaje
    }
  } catch {
    mensaje = 'Algo salió mal, intenta de nuevo'
  }
  const error = new Error(mensaje)
  error.estado = respuesta.status
  throw error
}

export async function solicitarCuenta(datos) {
  const respuesta = await fetch(`${URL_API}/cuentas/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return leerRespuesta(respuesta)
}

export async function ingresar(correo, clave) {
  const respuesta = await fetch(`${URL_API}/sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave })
  })
  return leerRespuesta(respuesta)
}

export async function cerrarSesion() {
  const respuesta = await fetch(`${URL_API}/sesion`, {
    method: 'DELETE',
    headers: cabeceras()
  })
  return leerRespuesta(respuesta)
}

export async function cambiarClave(claveActual, claveNueva) {
  const respuesta = await fetch(`${URL_API}/sesion/clave`, {
    method: 'PUT',
    headers: cabeceras({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ claveActual, claveNueva })
  })
  return leerRespuesta(respuesta)
}

export async function listarSolicitudes() {
  const respuesta = await fetch(`${URL_API}/cuentas/solicitudes`, { headers: cabeceras() })
  return leerRespuesta(respuesta)
}

export async function resolverSolicitud(id, accion) {
  const respuesta = await fetch(`${URL_API}/cuentas/solicitudes/${id}/${accion}`, {
    method: 'POST',
    headers: cabeceras()
  })
  return leerRespuesta(respuesta)
}

export async function listarUsuarios() {
  const respuesta = await fetch(`${URL_API}/usuarios`, { headers: cabeceras() })
  return leerRespuesta(respuesta)
}

export async function publicarKudo({ destinatarioId, mensaje, archivos }) {
  const formulario = new FormData()
  formulario.append('destinatarioId', destinatarioId)
  formulario.append('mensaje', mensaje)
  archivos.forEach((archivo) => formulario.append('archivos', archivo))
  const respuesta = await fetch(`${URL_API}/kudos`, {
    method: 'POST',
    headers: cabeceras(),
    body: formulario
  })
  return leerRespuesta(respuesta)
}

export async function listarKudos(cursor) {
  const parametros = new URLSearchParams({ limite: '10' })
  if (cursor) {
    parametros.set('cursor', cursor)
  }
  const respuesta = await fetch(`${URL_API}/kudos?${parametros.toString()}`, {
    headers: cabeceras()
  })
  return leerRespuesta(respuesta)
}

export function conectarPush(alRecibirKudo) {
  const conexion = new EventSource(`${URL_API}/push?token=${encodeURIComponent(tokenActual)}`)
  conexion.addEventListener('kudo-recibido', (evento) => {
    alRecibirKudo(JSON.parse(evento.data))
  })
  return () => conexion.close()
}
