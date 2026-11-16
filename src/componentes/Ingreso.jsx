import { useState } from 'react'
import { ingresar } from '../api.js'

export default function Ingreso({ alEntrar, alPedirCuenta, aviso }) {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [sinCuenta, setSinCuenta] = useState(false)

  async function entrar(evento) {
    evento.preventDefault()
    setError('')
    setSinCuenta(false)
    setCargando(true)
    try {
      const sesion = await ingresar(correo, clave)
      alEntrar(sesion)
    } catch (fallo) {
      setError(fallo.message)
      setSinCuenta(fallo.estado === 404)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="pagina pagina-angosta">
      <h1>UCO Kudos</h1>
      <p className="subtitulo">Reconoce a quien te ayudó</p>

      {aviso && <p className="exito">{aviso}</p>}

      <form className="tarjeta" onSubmit={entrar}>
        <h2>Ingresar</h2>
        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          placeholder="nombre@gmail.com"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          required
        />
        <label htmlFor="clave">Contraseña</label>
        <input
          id="clave"
          type="password"
          value={clave}
          onChange={(evento) => setClave(evento.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button className="boton" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <button
        className={sinCuenta ? 'boton' : 'boton boton-claro'}
        type="button"
        onClick={alPedirCuenta}
      >
        Solicitar cuenta
      </button>
    </main>
  )
}
