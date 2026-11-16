import { useState } from 'react'
import { publicarKudo } from '../api.js'

const LIMITE_CARACTERES = 500
const MAXIMO_ARCHIVOS = 5

export default function FormularioKudo({ autor, usuarios, alPublicar }) {
  const [destinatarioId, setDestinatarioId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [archivos, setArchivos] = useState([])
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  const otrosUsuarios = usuarios.filter((usuario) => usuario.id !== autor.id)

  function elegirArchivos(evento) {
    const elegidos = Array.from(evento.target.files)
    if (elegidos.length > MAXIMO_ARCHIVOS) {
      setError(`Máximo ${MAXIMO_ARCHIVOS} archivos`)
      setArchivos([])
      return
    }
    setError('')
    setArchivos(elegidos)
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setExito('')
    setEnviando(true)
    try {
      await publicarKudo({ destinatarioId, mensaje, archivos })
      setExito('Kudo publicado')
      setMensaje('')
      setArchivos([])
      setDestinatarioId('')
      evento.target.reset()
      alPublicar()
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2>Publicar un Kudo</h2>

      <label htmlFor="destinatario">Para quién</label>
      <select
        id="destinatario"
        value={destinatarioId}
        onChange={(evento) => setDestinatarioId(evento.target.value)}
        required
      >
        <option value="">Elige a una persona</option>
        {otrosUsuarios.map((usuario) => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombre}
          </option>
        ))}
      </select>

      <label htmlFor="mensaje">Mensaje</label>
      <textarea
        id="mensaje"
        rows="4"
        maxLength={LIMITE_CARACTERES}
        value={mensaje}
        onChange={(evento) => setMensaje(evento.target.value)}
        required
      />
      <small className="contador">
        {mensaje.length} / {LIMITE_CARACTERES}
      </small>

      <label htmlFor="archivos">Adjuntos (imágenes o PDF, máximo {MAXIMO_ARCHIVOS})</label>
      <input
        id="archivos"
        type="file"
        multiple
        accept="image/png,image/jpeg,application/pdf"
        onChange={elegirArchivos}
      />

      {error && <p className="error">{error}</p>}
      {exito && <p className="exito">{exito}</p>}

      <button className="boton" type="submit" disabled={enviando}>
        {enviando ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  )
}
