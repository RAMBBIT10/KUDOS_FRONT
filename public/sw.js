const NOMBRE_CACHE = 'uco-kudos-v1'
const ARCHIVOS_BASE = ['/', '/index.html', '/icono.svg', '/manifest.webmanifest']

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(ARCHIVOS_BASE)))
  self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((nombre) => nombre !== NOMBRE_CACHE).map((nombre) => caches.delete(nombre)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request
  const mismoOrigen = new URL(peticion.url).origin === self.location.origin
  if (peticion.method !== 'GET' || !mismoOrigen) {
    return
  }
  evento.respondWith(
    fetch(peticion)
      .then((respuesta) => {
        const copia = respuesta.clone()
        caches.open(NOMBRE_CACHE).then((cache) => cache.put(peticion, copia))
        return respuesta
      })
      .catch(() => caches.match(peticion))
  )
})
