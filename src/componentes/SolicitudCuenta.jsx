import { useState } from 'react'
import { solicitarCuenta } from '../api.js'

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
      <p className="subtitulo">Solicita tu cuenta institucional</p>

      <form className="tarjeta" onSubmit={enviar}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
        />
        <label htmlFor="correo">Correo institucional</label>
        <input
          id="correo"
          type="email"
          placeholder="nombre.apellido1234@uco.net.co"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          required
        />
        <label htmlFor="rol">Rol</label>
        <select id="rol" value={rol} onChange={(evento) => setRol(evento.target.value)}>
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="PROFESOR">Profesor</option>
        </select>
        <label htmlFor="telefono">Teléfono (con el prefijo, por ejemplo +573001234567)</label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(evento) => setTelefono(evento.target.value)}
          required
        />
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
