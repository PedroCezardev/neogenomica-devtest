import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@/components/ui/Button';

describe('Componente Button', () => {

  it('deve renderizar o texto do botão corretamente', () => {
    render(<Button>Cadastrar Amostra</Button>);
    expect(screen.getByRole('button', { name: /cadastrar amostra/i })).toBeInTheDocument();
  });

  it('deve chamar a função onClick ao ser clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Salvar</Button>);

    const button = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar o botão quando a prop disabled for verdadeira', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Enviar</Button>);

    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve exibir o indicador de carregamento (spinner) quando loading for verdadeiro', () => {
    render(<Button loading>Processando</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

});
