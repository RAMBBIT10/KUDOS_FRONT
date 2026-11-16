import { useCallback, useEffect, useRef, useState } from 'react'
import { cerrarSesion, conectarPush, guardarToken, listarUsuarios } from './api.js'
import Ingreso from './componentes/Ingreso.jsx'
import SolicitudCuenta from './componentes/SolicitudCuenta.jsx'
import PanelAdministrador from './componentes/PanelAdministrador.jsx'
import FormularioKudo from './componentes/FormularioKudo.jsx'
import ListaKudos from './componentes/ListaKudos.jsx'

const CLAVE_SESION = 'uco-kudos-sesion'

function leerSesionGuardada() {
  try {
    const texto = localStorage.getItem(CLAVE_SESION)
    const sesion = texto ? JSON.parse(texto) : null
    if (sesion) {
      guardarToken(sesion.token)
    }
    return sesion
  } catch {
    return null
  }
}

export default function App() {
  const [sesion, setSesion] = useState(leerSesionGuardada)
  const [pantalla, setPantalla] = useState('ingreso')
  const [mensajeInicial, setMensajeInicial] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [aviso, setAviso] = useState('')
  const [versionLista, setVersionLista] = useState(0)
  const usuariosActuales = useRef([])

  usuariosActuales.current = usuarios
  const usuario = sesion ? sesion.usuario : null
  const esAdministrador = usuario && usuario.rol === 'ADMINISTRADOR'

  const cerrarLocalmente = useCallback(() => {
    localStorage.removeItem(CLAVE_SESION)
    guardarToken('')
    setSesion(null)
    setUsuarios([])
  }, [])

  const cargarUsuarios = useCallback(async () => {
    try {
      setUsuarios(await listarUsuarios())
    } catch (fallo) {
      if (fallo.estado === 401) {
        cerrarLocalmente()
        return
      }
      setUsuarios([])
    }
  }, [cerrarLocalmente])

  useEffect(() => {
    if (sesion) {
      cargarUsuarios()
    }
  }, [sesion, cargarUsuarios])

  useEffect(() => {
    if (!sesion || esAdministrador) {
      return undefined
    }
    return conectarPush((kudo) => {
      const autor = usuariosActuales.current.find((persona) => persona.id === kudo.autorId)
      setAviso(`${autor ? autor.nombre : 'Alguien'} te mandó un Kudo`)
      setVersionLista((version) => version + 1)
    })
  }, [sesion, esAdministrador])

  useEffect(() => {
    if (!aviso) {
      return undefined
    }
    const temporizador = setTimeout(() => setAviso(''), 5000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  function entrar(nuevaSesion) {
    guardarToken(nuevaSesion.token)
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion))
    setMensajeInicial('')
    setSesion(nuevaSesion)
  }

  async function salir() {
    try {
      await cerrarSesion()
    } catch {
      setAviso('')
    }
    cerrarLocalmente()
    setPantalla('ingreso')
  }

  function solicitudEnviada(mensaje) {
    setMensajeInicial(mensaje)
    setPantalla('ingreso')
  }

  if (!sesion) {
    if (pantalla === 'solicitud') {
      return (
        <SolicitudCuenta alVolver={() => setPantalla('ingreso')} alEnviar={solicitudEnviada} />
      )
    }
    return (
      <Ingreso
        alEntrar={entrar}
        alPedirCuenta={() => setPantalla('solicitud')}
        aviso={mensajeInicial}
      />
    )
  }

  return (
    <main className="pagina">
      <header className="encabezado">
        <h1>UCO Kudos</h1>
        <div className="sesion">
          <span>{usuario.nombre}</span>
          <button className="boton boton-claro" onClick={salir}>
            Salir
          </button>
        </div>
      </header>

      {aviso && (
        <div className="aviso" role="status">
          {aviso}
        </div>
      )}

      {esAdministrador ? (
        <PanelAdministrador />
      ) : (
        <>
          <FormularioKudo autor={usuario} usuarios={usuarios} alPublicar={cargarUsuarios} />
          <ListaKudos usuario={usuario} usuarios={usuarios} version={versionLista} />
        </>
      )}
    </main>
  )
}
