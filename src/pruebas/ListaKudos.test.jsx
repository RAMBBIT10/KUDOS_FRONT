import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  listarKudos: vi.fn(),
  URL_API: 'http://prueba'
}))

import { listarKudos } from '../api.js'
import ListaKudos from '../componentes/ListaKudos.jsx'

const usuario = { id: 'l1', nombre: 'Luis' }
const usuarios = [
  { id: 'a1', nombre: 'Ana' },
  { id: 'l1', nombre: 'Luis' }
]

function kudo(id, mensaje) {
  return {
    id,
    autorId: 'a1',
    destinatarioId: 'l1',
    mensaje,
    creadoEn: '2026-11-10T15:00:00Z',
    adjuntos: []
  }
}

describe('ListaKudos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra un mensaje cuando no hay kudos', async () => {
    listarKudos.mockResolvedValue({ kudos: [], siguienteCursor: null })
    render(<ListaKudos usuario={usuario} usuarios={usuarios} version={0} />)
    await waitFor(() => expect(screen.getByText('Todavía no tienes Kudos')).toBeInTheDocument())
  })

  it('muestra el autor y el mensaje de cada kudo', async () => {
    listarKudos.mockResolvedValue({ kudos: [kudo('1', 'Gracias por ayudarme')], siguienteCursor: null })
    render(<ListaKudos usuario={usuario} usuarios={usuarios} version={0} />)
    await waitFor(() => expect(screen.getByText('Gracias por ayudarme')).toBeInTheDocument())
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('carga más kudos con el cursor', async () => {
    listarKudos
      .mockResolvedValueOnce({ kudos: [kudo('1', 'Primero')], siguienteCursor: 'cursor-1' })
      .mockResolvedValueOnce({ kudos: [kudo('2', 'Segundo')], siguienteCursor: null })
    render(<ListaKudos usuario={usuario} usuarios={usuarios} version={0} />)
    await waitFor(() => expect(screen.getByText('Primero')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Ver más' }))

    await waitFor(() => expect(screen.getByText('Segundo')).toBeInTheDocument())
    expect(listarKudos).toHaveBeenLastCalledWith('cursor-1')
    expect(screen.queryByRole('button', { name: 'Ver más' })).not.toBeInTheDocument()
  })
})
