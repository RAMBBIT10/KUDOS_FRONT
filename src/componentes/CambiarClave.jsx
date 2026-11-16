import { useState } from 'react'
import { cambiarClave } from '../api.js'

export default function CambiarClave({ alVolver, alCambiar }) {
  const [claveActual, setClaveActual] = useState('')
  const [claveNueva, setClaveNueva] = useState('')
  const [repetirClave, setRepetirClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    if (claveNueva !== repetirClave) {
      setError('La clave nueva y su repetición no son iguales')
      return
    }
    setCargando(true)
    try {
      const respuesta = await cambiarClave(claveActual, claveNueva)
      alCambiar(respuesta.mensaje)
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="pagina-angosta">
      <form className="tarjeta" onSubmit={enviar}>
        <h2>Cambiar clave</h2>
        <label htmlFor="clave-actual">Clave actual</label>
        <input
          id="clave-actual"
          type="password"
          value={claveActual}
          onChange={(evento) => setClaveActual(evento.target.value)}
          required
        />
        <label htmlFor="clave-nueva">Clave nueva</label>
        <input
          id="clave-nueva"
          type="password"
          value={claveNueva}
          onChange={(evento) => setClaveNueva(evento.target.value)}
          required
        />
        <label htmlFor="clave-repetida">Repite la clave nueva</label>
        <input
          id="clave-repetida"
          type="password"
          value={repetirClave}
          onChange={(evento) => setRepetirClave(evento.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button className="boton" type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar clave'}
        </button>
      </form>
      <button className="boton boton-claro" type="button" onClick={alVolver}>
        Volver
      </button>
    </section>
  )
}
