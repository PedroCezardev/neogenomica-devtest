import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '@/components/ui/Modal';

describe('Componente Modal', () => {
  it('não deve renderizar nada se isOpen for falso', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Título Teste">
        <p>Conteúdo do Modal</p>
      </Modal>
    );
    expect(screen.queryByText('Conteúdo do Modal')).not.toBeInTheDocument();
  });

  it('deve renderizar o título e o conteúdo quando isOpen for verdadeiro', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Nova Sala">
        <p>Formulário da Sala</p>
      </Modal>
    );

    expect(screen.getByText('Nova Sala')).toBeInTheDocument();
    expect(screen.getByText('Formulário da Sala')).toBeInTheDocument();
  });

  it('deve chamar a função onClose ao pressionar a tecla Escape', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Teste ESC">
        <p>Conteúdo</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar os botões do footer se informados', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Confirmação"
        footer={<button>Confirmar Ação</button>}
      >
        <p>Mensagem</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: /confirmar ação/i })).toBeInTheDocument();
  });
});
