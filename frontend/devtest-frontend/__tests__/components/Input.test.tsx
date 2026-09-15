import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '@/components/ui/Input';

describe('Componente Input', () => {

  it('deve renderizar o label e o placeholder corretamente', () => {
    render(<Input label="Nome do Paciente" placeholder="Ex: Ana Silva" />);

    expect(screen.getByText('Nome do Paciente')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Ana Silva')).toBeInTheDocument();
  });

  it('deve capturar alterações de texto via onChange', () => {
    const handleChange = vi.fn();
    render(<Input label="E-mail" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pedro@neogenomica.com' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('deve exibir mensagem de erro quando a prop error for informada', () => {
    render(<Input label="Senha" error="A senha deve ter pelo menos 6 caracteres" />);

    expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
  });

  it('deve exibir dica (hint) quando informada', () => {
    render(<Input label="Posição" hint="Exemplo: A1, C3" />);

    expect(screen.getByText('Exemplo: A1, C3')).toBeInTheDocument();
  });

});
