import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge, { materialVariant } from '@/components/ui/Badge';

describe('Componente Badge e Utilitário materialVariant', () => {
  
  it('deve renderizar o conteúdo do Badge corretamente', () => {
    render(<Badge variant="teal">DNA</Badge>);
    expect(screen.getByText('DNA')).toBeInTheDocument();
  });

  it('deve mapear corretamente os materiais genéticos para as variantes visuais', () => {
    expect(materialVariant('DNA')).toBe('teal');
    expect(materialVariant('Swab bucal')).toBe('blue');
    expect(materialVariant('Sangue total')).toBe('red');
    expect(materialVariant('Qualquer outro')).toBe('gray');
  });

});
