import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  listarSolicitudes: vi.fn(),
  resolverSolicitud: vi.fn(),
  URL_API: 'http://prueba'
}))

import { listarSolicitudes, resolverSolicitud } from '../api.js'
import PanelAdministrador from '../componentes/PanelAdministrador.jsx'

const solicitud = {
  id: 's1',
  nombre: 'Ana Gomez',
  correo: 'ana.gomez1111@uco.net.co',
  telefono: '+573000000001',
  rol: 'ESTUDIANTE'
}

describe('PanelAdministrador', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('avisa cuando no hay solicitudes', async () => {
    listarSolicitudes.mockResolvedValue([])
    render(<PanelAdministrador />)
    await waitFor(() => expect(screen.getByText('No hay solicitudes pendientes')).toBeInTheDocument())
  })

  it('aprueba una solicitud y recarga la lista', async () => {
    listarSolicitudes.mockResolvedValueOnce([solicitud]).mockResolvedValueOnce([])
    resolverSolicitud.mockResolvedValue({ mensaje: 'Cuenta aprobada' })
    render(<PanelAdministrador />)
    await waitFor(() => expect(screen.getByText('Ana Gomez')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Aprobar' }))

    await waitFor(() => expect(screen.getByText('Cuenta aprobada')).toBeInTheDocument())
    expect(resolverSolicitud).toHaveBeenCalledWith('s1', 'aprobar')
    await waitFor(() => expect(screen.queryByText('Ana Gomez')).not.toBeInTheDocument())
  })

  it('rechaza una solicitud', async () => {
    listarSolicitudes.mockResolvedValue([solicitud])
    resolverSolicitud.mockResolvedValue({ mensaje: 'Solicitud rechazada' })
    render(<PanelAdministrador />)
    await waitFor(() => expect(screen.getByText('Ana Gomez')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }))

    await waitFor(() => expect(resolverSolicitud).toHaveBeenCalledWith('s1', 'rechazar'))
  })
})
