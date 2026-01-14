import { render, screen, fireEvent } from '@testing-library/react';
import { FlagImage, getFlagUrl, type FlagFormat, type FlagSize } from '@/components/ui/flagImage';

jest.mock('lucide-react', () => ({
  Flag: ({ className, 'aria-label': ariaLabel, ...props }: any) => (
    <svg data-testid="flag-icon" className={className} aria-label={ariaLabel} {...props} />
  ),
}));

describe('FlagImage', () => {
  describe('getFlagUrl', () => {
    it('should generate correct URL for country name', () => {
      const url = getFlagUrl('Brazil');
      expect(url).toBe('https://flagcdn.com/br.svg');
    });

    it('should handle country names with different cases', () => {
      const url1 = getFlagUrl('BRAZIL');
      const url2 = getFlagUrl('brazil');
      const url3 = getFlagUrl('  Brazil  ');
      expect(url1).toBe('https://flagcdn.com/br.svg');
      expect(url2).toBe('https://flagcdn.com/br.svg');
      expect(url3).toBe('https://flagcdn.com/br.svg');
    });

    it('should map common country names to codes', () => {
      expect(getFlagUrl('United States')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('USA')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('United Kingdom')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('UK')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('European Union')).toBe('https://flagcdn.com/eu.svg');
    });

    it('should map Portuguese country names to codes', () => {
      expect(getFlagUrl('Brasil')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('Estados Unidos')).toBe('https://flagcdn.com/us.svg');
      expect(getFlagUrl('Reino Unido')).toBe('https://flagcdn.com/gb.svg');
      expect(getFlagUrl('União Europeia')).toBe('https://flagcdn.com/eu.svg');
    });

    it('should use country name as code if not in map', () => {
      const url = getFlagUrl('UnknownCountry');
      expect(url).toBe('https://flagcdn.com/unknowncountry.svg');
    });

    it('should handle size parameter with string values', () => {
      expect(getFlagUrl('Brazil', 'w20')).toBe('https://flagcdn.com/w20/br.svg');
      expect(getFlagUrl('Brazil', 'w40')).toBe('https://flagcdn.com/w40/br.svg');
      expect(getFlagUrl('Brazil', 'w80')).toBe('https://flagcdn.com/w80/br.svg');
      expect(getFlagUrl('Brazil', 'w160')).toBe('https://flagcdn.com/w160/br.svg');
      expect(getFlagUrl('Brazil', 'w320')).toBe('https://flagcdn.com/w320/br.svg');
      expect(getFlagUrl('Brazil', 'w640')).toBe('https://flagcdn.com/w640/br.svg');
    });

    it('should handle size parameter with number values', () => {
      expect(getFlagUrl('Brazil', 100)).toBe('https://flagcdn.com/w100/br.svg');
      expect(getFlagUrl('Brazil', 200)).toBe('https://flagcdn.com/w200/br.svg');
    });

    it('should handle format parameter', () => {
      expect(getFlagUrl('Brazil', '', 'png')).toBe('https://flagcdn.com/br.png');
      expect(getFlagUrl('Brazil', '', 'svg')).toBe('https://flagcdn.com/br.svg');
      expect(getFlagUrl('Brazil', '', 'jpg')).toBe('https://flagcdn.com/br.jpg');
      expect(getFlagUrl('Brazil', '', 'webp')).toBe('https://flagcdn.com/br.webp');
    });

    it('should handle format parameter with different cases', () => {
      expect(getFlagUrl('Brazil', '', 'PNG' as FlagFormat)).toBe('https://flagcdn.com/br.png');
      expect(getFlagUrl('Brazil', '', 'SVG' as FlagFormat)).toBe('https://flagcdn.com/br.svg');
    });

    it('should combine size and format parameters', () => {
      expect(getFlagUrl('Brazil', 'w40', 'png')).toBe('https://flagcdn.com/w40/br.png');
      expect(getFlagUrl('Brazil', 100, 'jpg')).toBe('https://flagcdn.com/w100/br.jpg');
    });
  });

  describe('FlagImage component', () => {
    it('should render flag image with correct src', () => {
      render(<FlagImage country="Brazil" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://flagcdn.com/w20/br.png');
    });

    it('should use default size and format', () => {
      render(<FlagImage country="Brazil" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('width', '20');
      expect(img).toHaveAttribute('src', expect.stringContaining('.png'));
    });

    it('should apply custom size', () => {
      render(<FlagImage country="Brazil" size="w40" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('width', '40');
      expect(img).toHaveAttribute('src', expect.stringContaining('w40'));
    });

    it('should apply numeric size', () => {
      render(<FlagImage country="Brazil" size={100} />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('width', '100');
    });

    it('should apply custom format', () => {
      render(<FlagImage country="Brazil" format="svg" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('src', expect.stringContaining('.svg'));
    });

    it('should apply custom className', () => {
      render(<FlagImage country="Brazil" className="custom-class" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveClass('custom-class');
    });

    it('should use custom alt text', () => {
      render(<FlagImage country="Brazil" alt="Custom alt text" />);
      const img = screen.getByAltText('Custom alt text');
      expect(img).toBeInTheDocument();
    });

    it('should generate default alt text from country name', () => {
      render(<FlagImage country="United States" />);
      const img = screen.getByAltText('Flag of United States');
      expect(img).toBeInTheDocument();
    });

    it('should pass through additional props', () => {
      render(<FlagImage country="Brazil" data-testid="flag-image" data-country="br" />);
      const img = screen.getByTestId('flag-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('data-country', 'br');
    });

    it('should render Flag icon on image error', () => {
      render(<FlagImage country="Brazil" />);
      const img = screen.getByAltText('Flag of Brazil');
      
      fireEvent.error(img);
      
      expect(screen.queryByAltText('Flag of Brazil')).not.toBeInTheDocument();
      const flagIcon = screen.getByTestId('flag-icon');
      expect(flagIcon).toBeInTheDocument();
      expect(flagIcon).toHaveAttribute('aria-label', 'Flag of Brazil');
    });

    it('should render Flag icon with correct size class on error', () => {
      render(<FlagImage country="Brazil" size="w40" />);
      const img = screen.getByAltText('Flag of Brazil');
      
      fireEvent.error(img);
      
      const flagIcon = screen.getByTestId('flag-icon');
      expect(flagIcon).toHaveClass('size-10');
    });

    it('should handle different country names correctly', () => {
      render(<FlagImage country="United States" />);
      const img = screen.getByAltText('Flag of United States');
      expect(img).toHaveAttribute('src', expect.stringContaining('us'));
    });

    it('should handle Portuguese country names', () => {
      render(<FlagImage country="Brasil" />);
      const img = screen.getByAltText('Flag of Brasil');
      expect(img).toHaveAttribute('src', expect.stringContaining('br'));
    });

    it('should set height to auto', () => {
      render(<FlagImage country="Brazil" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('height', 'auto');
    });

    it('should handle empty string size', () => {
      render(<FlagImage country="Brazil" size="" />);
      const img = screen.getByAltText('Flag of Brazil');
      expect(img).toHaveAttribute('width', '40');
    });

    it('should handle unknown country names', () => {
      render(<FlagImage country="UnknownCountry" />);
      const img = screen.getByAltText('Flag of UnknownCountry');
      expect(img).toHaveAttribute('src', expect.stringContaining('unknowncountry'));
    });
  });
});
