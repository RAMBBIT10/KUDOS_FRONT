import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  solicitarCuenta: vi.fn(),
  URL_API: 'http://prueba'
}))

import { solicitarCuenta } from '../api.js'
import SolicitudCuenta from '../componentes/SolicitudCuenta.jsx'

function llenar() {
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Ana Gomez' } })
  fireEvent.change(screen.getByLabelText('Correo'), {
    target: { value: 'ana.gomez1111@uco.net.co' }
  })
  fireEvent.change(screen.getByLabelText('Rol'), { target: { value: 'PROFESOR' } })
  fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3000000001' } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))
}

describe('SolicitudCuenta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envía la solicitud con los datos y avisa', async () => {
    solicitarCuenta.mockResolvedValue({ mensaje: 'Tu solicitud fue enviada' })
    const alEnviar = vi.fn()
    render(<SolicitudCuenta alVolver={() => {}} alEnviar={alEnviar} />)
    llenar()

    await waitFor(() => expect(alEnviar).toHaveBeenCalledWith('Tu solicitud fue enviada'))
    expect(solicitarCuenta).toHaveBeenCalledWith({
      nombre: 'Ana Gomez',
      correo: 'ana.gomez1111@uco.net.co',
      telefono: '3000000001',
      rol: 'PROFESOR'
    })
  })

  it('muestra el error del backend si el correo no es válido', async () => {
    solicitarCuenta.mockRejectedValue(new Error('El correo no es válido'))
    render(<SolicitudCuenta alVolver={() => {}} alEnviar={() => {}} />)
    llenar()

    await waitFor(() => expect(screen.getByText('El correo no es válido')).toBeInTheDocument())
  })

  it('vuelve al ingreso', () => {
    const alVolver = vi.fn()
    render(<SolicitudCuenta alVolver={alVolver} alEnviar={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(alVolver).toHaveBeenCalled()
  })
})
