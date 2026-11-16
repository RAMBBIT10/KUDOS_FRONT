import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../api.js', () => ({
  cambiarClave: vi.fn(),
  URL_API: 'http://prueba'
}))

import { cambiarClave } from '../api.js'
import CambiarClave from '../componentes/CambiarClave.jsx'

function llenar(actual, nueva, repetida) {
  fireEvent.change(screen.getByLabelText('Clave actual'), { target: { value: actual } })
  fireEvent.change(screen.getByLabelText('Clave nueva'), { target: { value: nueva } })
  fireEvent.change(screen.getByLabelText('Repite la clave nueva'), { target: { value: repetida } })
  fireEvent.click(screen.getByRole('button', { name: 'Guardar clave' }))
}

describe('CambiarClave', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envía la clave actual y la nueva y avisa que se cambió', async () => {
    cambiarClave.mockResolvedValue({ mensaje: 'Tu clave se cambió correctamente' })
    const alCambiar = vi.fn()
    render(<CambiarClave alVolver={() => {}} alCambiar={alCambiar} />)
    llenar('Temporal123', 'MiClaveNueva1', 'MiClaveNueva1')

    await waitFor(() => expect(alCambiar).toHaveBeenCalledWith('Tu clave se cambió correctamente'))
    expect(cambiarClave).toHaveBeenCalledWith('Temporal123', 'MiClaveNueva1')
  })

  it('no envía nada si la repetición no coincide', () => {
    render(<CambiarClave alVolver={() => {}} alCambiar={() => {}} />)
    llenar('Temporal123', 'MiClaveNueva1', 'OtraClave99')

    expect(screen.getByText('La clave nueva y su repetición no son iguales')).toBeInTheDocument()
    expect(cambiarClave).not.toHaveBeenCalled()
  })

  it('muestra el error del backend', async () => {
    cambiarClave.mockRejectedValue(new Error('La clave actual no es correcta'))
    render(<CambiarClave alVolver={() => {}} alCambiar={() => {}} />)
    llenar('mala', 'MiClaveNueva1', 'MiClaveNueva1')

    await waitFor(() => expect(screen.getByText('La clave actual no es correcta')).toBeInTheDocument())
  })

  it('permite volver', () => {
    const alVolver = vi.fn()
    render(<CambiarClave alVolver={alVolver} alCambiar={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(alVolver).toHaveBeenCalled()
  })
})
