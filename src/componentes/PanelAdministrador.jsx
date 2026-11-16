import { useCallback, useEffect, useState } from 'react'
import { listarSolicitudes, resolverSolicitud } from '../api.js'

export default function PanelAdministrador() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [ocupado, setOcupado] = useState('')

  const cargar = useCallback(async () => {
    try {
      setSolicitudes(await listarSolicitudes())
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function resolver(id, accion) {
    setError('')
    setExito('')
    setOcupado(id)
    try {
      const respuesta = await resolverSolicitud(id, accion)
      setExito(respuesta.mensaje)
      await cargar()
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setOcupado('')
    }
  }

  return (
    <section>
      <h2>Solicitudes de cuenta</h2>

      {cargando && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {exito && <p className="exito">{exito}</p>}
      {!cargando && solicitudes.length === 0 && <p className="vacio">No hay solicitudes pendientes</p>}

      {solicitudes.map((solicitud) => (
        <article className="tarjeta" key={solicitud.id}>
          <strong>{solicitud.nombre}</strong>
          <span>{solicitud.correo}</span>
          <small>
            {solicitud.rol === 'PROFESOR' ? 'Profesor' : 'Estudiante'} · {solicitud.telefono}
          </small>
          <div className="acciones">
            <button
              className="boton"
              disabled={ocupado === solicitud.id}
              onClick={() => resolver(solicitud.id, 'aprobar')}
            >
              Aprobar
            </button>
            <button
              className="boton boton-claro"
              disabled={ocupado === solicitud.id}
              onClick={() => resolver(solicitud.id, 'rechazar')}
            >
              Rechazar
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
