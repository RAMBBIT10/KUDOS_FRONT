import { useState } from 'react'
import { solicitarCuenta } from '../api.js'

const PREFIJO_TELEFONO = import.meta.env.VITE_PREFIJO_TELEFONO || '+57'

export default function SolicitudCuenta({ alVolver, alEnviar }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [rol, setRol] = useState('ESTUDIANTE')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const respuesta = await solicitarCuenta({ nombre, correo, telefono, rol })
      alEnviar(respuesta.mensaje)
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="pagina pagina-angosta">
      <h1>UCO Kudos</h1>
      <p className="subtitulo">Solicita tu cuenta</p>

      <form className="tarjeta" onSubmit={enviar}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
        />
        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          placeholder="nombre@gmail.com"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          required
        />
        <label htmlFor="rol">Rol</label>
        <select id="rol" value={rol} onChange={(evento) => setRol(evento.target.value)}>
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="PROFESOR">Profesor</option>
        </select>
        <label htmlFor="telefono">Teléfono</label>
        <div className="campo-telefono">
          <span className="prefijo-telefono">{PREFIJO_TELEFONO}</span>
          <input
            id="telefono"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="3001234567"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="boton" type="submit" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>

      <button className="boton boton-claro" type="button" onClick={alVolver}>
        Volver
      </button>
    </main>
  )
}
