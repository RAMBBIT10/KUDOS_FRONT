import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  ingresar: vi.fn(),
  URL_API: 'http://prueba'
}))

import { ingresar } from '../api.js'
import Ingreso from '../componentes/Ingreso.jsx'

function llenar(correo, clave) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } })
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Ingreso', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ingresa con correo y contraseña y entrega la sesión', async () => {
    const sesion = { token: 't1', usuario: { id: 'a1', nombre: 'Ana', rol: 'ESTUDIANTE' } }
    ingresar.mockResolvedValue(sesion)
    const alEntrar = vi.fn()
    render(<Ingreso alEntrar={alEntrar} alPedirCuenta={() => {}} />)
    llenar('ana.gomez1111@uco.net.co', 'Clave123')

    await waitFor(() => expect(alEntrar).toHaveBeenCalledWith(sesion))
    expect(ingresar).toHaveBeenCalledWith('ana.gomez1111@uco.net.co', 'Clave123')
  })

  it('muestra el mensaje cuando la solicitud sigue pendiente', async () => {
    ingresar.mockRejectedValue(Object.assign(new Error('Tu solicitud sigue pendiente de aprobación'), { estado: 401 }))
    render(<Ingreso alEntrar={() => {}} alPedirCuenta={() => {}} />)
    llenar('ana.gomez1111@uco.net.co', 'x')

    await waitFor(() =>
      expect(screen.getByText('Tu solicitud sigue pendiente de aprobación')).toBeInTheDocument()
    )
  })

  it('muestra el mensaje de que no hay cuenta', async () => {
    ingresar.mockRejectedValue(
      Object.assign(new Error('No encontramos una cuenta con ese correo. Puedes solicitarla'), { estado: 404 })
    )
    render(<Ingreso alEntrar={() => {}} alPedirCuenta={() => {}} />)
    llenar('nadie.nadie0000@uco.net.co', 'x')

    await waitFor(() =>
      expect(
        screen.getByText('No encontramos una cuenta con ese correo. Puedes solicitarla')
      ).toBeInTheDocument()
    )
  })

  it('lleva a solicitar cuenta', () => {
    const alPedirCuenta = vi.fn()
    render(<Ingreso alEntrar={() => {}} alPedirCuenta={alPedirCuenta} />)
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cuenta' }))
    expect(alPedirCuenta).toHaveBeenCalled()
  })

  it('muestra el aviso de solicitud enviada', () => {
    render(<Ingreso alEntrar={() => {}} alPedirCuenta={() => {}} aviso="Tu solicitud fue enviada" />)
    expect(screen.getByText('Tu solicitud fue enviada')).toBeInTheDocument()
  })
})
