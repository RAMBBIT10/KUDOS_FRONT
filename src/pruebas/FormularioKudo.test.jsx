import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  publicarKudo: vi.fn(),
  URL_API: 'http://prueba'
}))

import { publicarKudo } from '../api.js'
import FormularioKudo from '../componentes/FormularioKudo.jsx'

const autor = { id: 'a1', nombre: 'Ana' }
const usuarios = [
  { id: 'a1', nombre: 'Ana' },
  { id: 'l1', nombre: 'Luis' }
]

describe('FormularioKudo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no muestra al autor en la lista de destinatarios', () => {
    render(<FormularioKudo autor={autor} usuarios={usuarios} alPublicar={() => {}} />)
    expect(screen.getByRole('option', { name: 'Luis' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Ana' })).not.toBeInTheDocument()
  })

  it('cuenta los caracteres del mensaje', () => {
    render(<FormularioKudo autor={autor} usuarios={usuarios} alPublicar={() => {}} />)
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Gracias' } })
    expect(screen.getByText('7 / 500')).toBeInTheDocument()
  })

  it('publica el kudo y avisa que salió bien', async () => {
    publicarKudo.mockResolvedValue({ id: 'k1' })
    const alPublicar = vi.fn()
    render(<FormularioKudo autor={autor} usuarios={usuarios} alPublicar={alPublicar} />)
    fireEvent.change(screen.getByLabelText('Para quién'), { target: { value: 'l1' } })
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Gracias por todo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('Kudo publicado')).toBeInTheDocument())
    expect(publicarKudo).toHaveBeenCalledWith({
      destinatarioId: 'l1',
      mensaje: 'Gracias por todo',
      archivos: []
    })
    expect(alPublicar).toHaveBeenCalled()
  })

  it('muestra el error que devuelve el backend', async () => {
    publicarKudo.mockRejectedValue(new Error('El mensaje no puede estar vacío'))
    render(<FormularioKudo autor={autor} usuarios={usuarios} alPublicar={() => {}} />)
    fireEvent.change(screen.getByLabelText('Para quién'), { target: { value: 'l1' } })
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'hola' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() =>
      expect(screen.getByText('El mensaje no puede estar vacío')).toBeInTheDocument()
    )
  })
})
