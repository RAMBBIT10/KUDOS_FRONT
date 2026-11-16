import { useCallback, useEffect, useState } from 'react'
import { URL_API, listarKudos } from '../api.js'

function formatearFecha(texto) {
  return new Date(texto).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function ListaKudos({ usuario, usuarios, version }) {
  const [kudos, setKudos] = useState([])
  const [siguienteCursor, setSiguienteCursor] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarPrimeraPagina = useCallback(async () => {
    setError('')
    try {
      const respuesta = await listarKudos()
      setKudos(respuesta.kudos)
      setSiguienteCursor(respuesta.siguienteCursor)
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarPrimeraPagina()
  }, [cargarPrimeraPagina, version])

  async function cargarMas() {
    try {
      const respuesta = await listarKudos(siguienteCursor)
      setKudos((actuales) => [...actuales, ...respuesta.kudos])
      setSiguienteCursor(respuesta.siguienteCursor)
    } catch (fallo) {
      setError(fallo.message)
    }
  }

  function nombreDe(id) {
    const persona = usuarios.find((item) => item.id === id)
    return persona ? persona.nombre : 'Alguien'
  }

  return (
    <section>
      <h2>Kudos que recibí</h2>

      {cargando && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && kudos.length === 0 && (
        <p className="vacio">Todavía no tienes Kudos</p>
      )}

      {kudos.map((kudo) => (
        <article className="tarjeta kudo" key={kudo.id}>
          <header>
            <strong>{nombreDe(kudo.autorId)}</strong>
            <small>{formatearFecha(kudo.creadoEn)}</small>
          </header>
          <p>{kudo.mensaje}</p>
          {kudo.adjuntos.length > 0 && (
            <ul className="adjuntos">
              {kudo.adjuntos.map((adjunto) => (
                <li key={adjunto.url}>
                  <a href={`${URL_API}${adjunto.url}`} target="_blank" rel="noreferrer">
                    {adjunto.nombre}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}

      {siguienteCursor && (
        <button className="boton boton-claro" onClick={cargarMas}>
          Ver más
        </button>
      )}
    </section>
  )
}
