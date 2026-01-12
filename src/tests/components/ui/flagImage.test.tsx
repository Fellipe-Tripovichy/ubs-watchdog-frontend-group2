import { render, screen } from '@testing-library/react';
import { FlagImage, getFlagUrl } from '@/components/ui/flagImage';

describe('getFlagUrl', () => {
  describe('country name to code conversion', () => {
    it('should convert English country names to ISO codes', () => {
      expect(getFlagUrl('Brazil')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('United States')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('United Kingdom')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('Japan')).toBe('https://flagcdn.com/jp.svg');
      expect(getFlagUrl('Germany')).toBe('https://flagcdn.com/de.svg');
    });

    it('should convert Brazilian Portuguese country names to ISO codes', () => {
      expect(getFlagUrl('Brasil')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('Estados Unidos')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('Reino Unido')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('Japão')).toBe('https://flagcdn.com/jp.svg');
      expect(getFlagUrl('Alemanha')).toBe('https://flagcdn.com/de.svg');
    });

    it('should handle case-insensitive country names', () => {
      expect(getFlagUrl('BRAZIL')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('brazil')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('Brazil')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('  Brazil  ')).toBe('https://flagcdn.com/br.svg');
    });

    it('should handle country aliases', () => {
      expect(getFlagUrl('USA')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('UK')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('EUA')).toBe('https://flagcdn.com/us.svg');
    });

    it('should use ISO code directly if no mapping found', () => {
      expect(getFlagUrl('br')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('us')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('xx')).toBe('https://flagcdn.com/xx.svg');
    });

    it('should handle trimmed country names', () => {
      expect(getFlagUrl('  Brazil  ')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('  United States  ')).toBe('https://flagcdn.com/us.svg');
    });
  });

  describe('format parameter', () => {
    it('should use svg format by default', () => {
      expect(getFlagUrl('Brazil')).toBe('https://flagcdn.com/br.svg');
    });

    it('should support png format', () => {
      expect(getFlagUrl('Brazil', '', 'png')).toBe('https://flagcdn.com/br.png');
    });

    it('should support jpg format', () => {
      expect(getFlagUrl('Brazil', '', 'jpg')).toBe('https://flagcdn.com/br.jpg');
    });

    it('should support webp format', () => {
      expect(getFlagUrl('Brazil', '', 'webp')).toBe('https://flagcdn.com/br.webp');
    });

    it('should handle uppercase format and convert to lowercase', () => {
      expect(getFlagUrl('Brazil', '', 'PNG')).toBe('https://flagcdn.com/br.png');
      expect(getFlagUrl('Brazil', '', 'SVG')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('Brazil', '', 'JPG')).toBe('https://flagcdn.com/br.jpg');
      expect(getFlagUrl('Brazil', '', 'WEBP')).toBe('https://flagcdn.com/br.webp');
    });
  });

  describe('size parameter', () => {
    it('should use empty size by default', () => {
      expect(getFlagUrl('Brazil')).toBe('https://flagcdn.com/br.svg');
    });

    it('should handle string sizes', () => {
      expect(getFlagUrl('Brazil', 'w20')).toBe('https://flagcdn.com/w20/br.svg');
      expect(getFlagUrl('Brazil', 'w40')).toBe('https://flagcdn.com/w40/br.svg');
      expect(getFlagUrl('Brazil', 'w80')).toBe('https://flagcdn.com/w80/br.svg');
      expect(getFlagUrl('Brazil', 'w160')).toBe('https://flagcdn.com/w160/br.svg');
      expect(getFlagUrl('Brazil', 'w320')).toBe('https://flagcdn.com/w320/br.svg');
      expect(getFlagUrl('Brazil', 'w640')).toBe('https://flagcdn.com/w640/br.svg');
    });

    it('should handle numeric sizes by prepending w', () => {
      expect(getFlagUrl('Brazil', 20)).toBe('https://flagcdn.com/w20/br.svg');
      expect(getFlagUrl('Brazil', 40)).toBe('https://flagcdn.com/w40/br.svg');
      expect(getFlagUrl('Brazil', 80)).toBe('https://flagcdn.com/w80/br.svg');
      expect(getFlagUrl('Brazil', 160)).toBe('https://flagcdn.com/w160/br.svg');
      expect(getFlagUrl('Brazil', 320)).toBe('https://flagcdn.com/w320/br.svg');
      expect(getFlagUrl('Brazil', 640)).toBe('https://flagcdn.com/w640/br.svg');
    });

    it('should handle custom string sizes', () => {
      expect(getFlagUrl('Brazil', 'custom')).toBe('https://flagcdn.com/custom/br.svg');
    });

    it('should handle empty string size', () => {
      expect(getFlagUrl('Brazil', '')).toBe('https://flagcdn.com/br.svg');
    });
  });

  describe('combined parameters', () => {
    it('should combine size and format correctly', () => {
      expect(getFlagUrl('Brazil', 'w40', 'png')).toBe('https://flagcdn.com/w40/br.png');
      expect(getFlagUrl('United States', 320, 'jpg')).toBe('https://flagcdn.com/w320/us.jpg');
      expect(getFlagUrl('Japan', 'w160', 'webp')).toBe('https://flagcdn.com/w160/jp.webp');
    });

    it('should handle Portuguese country names with size and format', () => {
      expect(getFlagUrl('Brasil', 'w40', 'png')).toBe('https://flagcdn.com/w40/br.png');
      expect(getFlagUrl('Estados Unidos', 320, 'jpg')).toBe('https://flagcdn.com/w320/us.jpg');
    });
  });

  describe('edge cases', () => {
    it('should handle country names with special characters', () => {
      expect(getFlagUrl('grã-bretanha')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('estados unidos da américa')).toBe('https://flagcdn.com/us.svg');
    });

    it('should handle empty country string', () => {
      expect(getFlagUrl('')).toBe('https://flagcdn.com/.svg');
    });
  });
});

describe('FlagImage', () => {
  it('should render', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image).toBeInTheDocument();
  });

  it('should render as an img element', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image.tagName).toBe('IMG');
  });

  it('should use correct src URL for country name', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should use correct src URL for ISO code', () => {
    render(<FlagImage country="br" />);
    const image = screen.getByAltText('Flag of br') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should use default alt text when alt prop is not provided', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image).toBeInTheDocument();
  });

  it('should use custom alt text when alt prop is provided', () => {
    render(<FlagImage country="Brazil" alt="Bandeira do Brasil" />);
    const image = screen.getByAltText('Bandeira do Brasil');
    expect(image).toBeInTheDocument();
  });

  it('should use default format (svg) when format prop is not provided', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should use custom format when format prop is provided', () => {
    render(<FlagImage country="Brazil" format="png" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.png');
  });

  it('should use empty size by default when size prop is not provided', () => {
    render(<FlagImage country="Brazil" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should use string size when size prop is provided', () => {
    render(<FlagImage country="Brazil" size="w40" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/w40/br.svg');
  });

  it('should use numeric size when size prop is a number', () => {
    render(<FlagImage country="Brazil" size={40} />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/w40/br.svg');
  });

  it('should apply className when provided', () => {
    render(<FlagImage country="Brazil" className="custom-class" />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image).toHaveClass('custom-class');
  });

  it('should combine size and format correctly', () => {
    render(<FlagImage country="Brazil" size="w40" format="png" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/w40/br.png');
  });

  it('should combine numeric size and format correctly', () => {
    render(<FlagImage country="Brazil" size={320} format="jpg" />);
    const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/w320/br.jpg');
  });

  it('should handle Portuguese country names', () => {
    render(<FlagImage country="Brasil" />);
    const image = screen.getByAltText('Flag of Brasil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should handle Portuguese country names with size and format', () => {
    render(<FlagImage country="Brasil" size="w40" format="png" />);
    const image = screen.getByAltText('Flag of Brasil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/w40/br.png');
  });

  it('should pass through additional props', () => {
    render(<FlagImage country="Brazil" data-testid="flag-image" id="flag-id" />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image).toHaveAttribute('data-testid', 'flag-image');
    expect(image).toHaveAttribute('id', 'flag-id');
  });

  it('should handle width and height props', () => {
    render(<FlagImage country="Brazil" width={40} height={30} />);
    const image = screen.getByAltText('Flag of Brazil');
    expect(image).toHaveAttribute('width', '40');
    expect(image).toHaveAttribute('height', '30');
  });

  it('should handle onClick event handler', () => {
    const handleClick = jest.fn();
    render(<FlagImage country="Brazil" onClick={handleClick} />);
    const image = screen.getByAltText('Flag of Brazil');
    image.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple countries', () => {
    const { rerender } = render(<FlagImage country="Brazil" />);
    let image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');

    rerender(<FlagImage country="United States" />);
    image = screen.getByAltText('Flag of United States') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/us.svg');

    rerender(<FlagImage country="Japan" />);
    image = screen.getByAltText('Flag of Japan') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/jp.svg');
  });

  it('should handle all format types', () => {
    const { rerender } = render(<FlagImage country="Brazil" format="svg" />);
    let image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');

    rerender(<FlagImage country="Brazil" format="png" />);
    image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.png');

    rerender(<FlagImage country="Brazil" format="jpg" />);
    image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.jpg');

    rerender(<FlagImage country="Brazil" format="webp" />);
    image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.webp');
  });

  it('should handle all predefined size strings', () => {
    const sizes: Array<'w20' | 'w40' | 'w80' | 'w160' | 'w320' | 'w640'> = [
      'w20',
      'w40',
      'w80',
      'w160',
      'w320',
      'w640',
    ];

    sizes.forEach((size) => {
      const { unmount } = render(<FlagImage country="Brazil" size={size} />);
      const image = screen.getByAltText('Flag of Brazil') as HTMLImageElement;
      expect(image.src).toBe(`https://flagcdn.com/${size}/br.svg`);
      unmount();
    });
  });

  it('should handle case-insensitive country input', () => {
    render(<FlagImage country="BRAZIL" />);
    const image = screen.getByAltText('Flag of BRAZIL') as HTMLImageElement;
    expect(image.src).toBe('https://flagcdn.com/br.svg');
  });

  it('should handle trimmed country input', () => {
    render(<FlagImage country="  Brazil  " />);
    // The country code conversion trims the input, but alt text uses the original
    // Use getByRole since getByAltText has issues with whitespace in alt text
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://flagcdn.com/br.svg');
    // Verify the alt text contains the country name (with spaces preserved)
    expect(image.alt).toBe('Flag of   Brazil  ');
  });
});
