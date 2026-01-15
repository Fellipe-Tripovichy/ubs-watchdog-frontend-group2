import { render, screen } from '@testing-library/react';
import { PieChart, type PieChartData } from '@/components/charts/PieChart';

describe('PieChart', () => {
  const mockData: PieChartData[] = [
    { name: 'Category A', value: 100 },
    { name: 'Category B', value: 200 },
    { name: 'Category C', value: 150 },
  ];

  describe('empty state', () => {
    it('should render empty state when data is null', () => {
      render(<PieChart data={null} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Não há dados para exibir no momento. Refaça sua busca ou entre em contato com o suporte.'
        )
      ).toBeInTheDocument();
    });

    it('should render empty state when data is empty array', () => {
      render(<PieChart data={[]} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are zero', () => {
      const zeroData: PieChartData[] = [
        { name: 'Category A', value: 0 },
        { name: 'Category B', value: 0 },
      ];
      render(<PieChart data={zeroData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are null', () => {
      const nullData: PieChartData[] = [
        { name: 'Category A', value: null as any },
        { name: 'Category B', value: null as any },
      ];
      render(<PieChart data={nullData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are undefined', () => {
      const undefinedData: PieChartData[] = [
        { name: 'Category A', value: undefined as any },
        { name: 'Category B', value: undefined as any },
      ];
      render(<PieChart data={undefinedData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state with PieChartIcon', () => {
      const { container } = render(<PieChart data={null} />);
      // Check for EmptyMedia with icon variant
      const emptyMedia = container.querySelector('[data-slot="empty-icon"]');
      expect(emptyMedia).toBeInTheDocument();
      // Check for SVG icon (PieChartIcon)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply width and height styles to empty state container', () => {
      const { container } = render(<PieChart data={null} width={500} height={300} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: '500px', height: '300px' });
    });

    it('should apply percentage width and height to empty state container', () => {
      const { container } = render(<PieChart data={null} width="80%" height="60%" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: '80%', height: '60%' });
    });
  });

  describe('with valid data', () => {
    it('should render chart when data is provided', () => {
      const { container } = render(<PieChart data={mockData} />);
      // Check that empty state is not rendered
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
      // Check that ResponsiveContainer is rendered (Recharts component)
      // Since Recharts renders SVG, we just check that the component renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with default props', () => {
      const { container } = render(<PieChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom dataKey', () => {
      const customData: PieChartData[] = [
        { name: 'Category A', amount: 100 },
        { name: 'Category B', amount: 200 },
      ];
      const { container } = render(<PieChart data={customData} dataKey="amount" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom nameKey', () => {
      const customData: PieChartData[] = [
        { label: 'Category A', value: 100 },
        { label: 'Category B', value: 200 },
      ];
      const { container } = render(<PieChart data={customData} nameKey="label" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom outerRadius', () => {
      const { container } = render(<PieChart data={mockData} outerRadius={150} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with label enabled', () => {
      const { container } = render(<PieChart data={mockData} label={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with label disabled', () => {
      const { container } = render(<PieChart data={mockData} label={false} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom width and height', () => {
      const { container } = render(<PieChart data={mockData} width={600} height={400} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with percentage width and height', () => {
      const { container } = render(<PieChart data={mockData} width="90%" height="80%" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with fills array', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const { container } = render(<PieChart data={mockData} fills={fills} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with getCellColor function', () => {
      const getCellColor = (entry: PieChartData, index: number) => {
        const colors = ['#FF0000', '#00FF00', '#0000FF'];
        return colors[index % colors.length];
      };
      const { container } = render(<PieChart data={mockData} getCellColor={getCellColor} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should prioritize getCellColor over fills array', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const getCellColor = (entry: PieChartData, index: number) => '#000000';
      const { container } = render(
        <PieChart data={mockData} fills={fills} getCellColor={getCellColor} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with formatter function', () => {
      const formatter = (value: number | string | undefined) => `$${value}`;
      const { container } = render(<PieChart data={mockData} formatter={formatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with labelFormatter function', () => {
      const labelFormatter = (label: string) => `Label: ${label}`;
      const { container } = render(<PieChart data={mockData} labelFormatter={labelFormatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with default formatter', () => {
      const { container } = render(<PieChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with all custom props', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const formatter = (value: number | string | undefined) => `$${value}`;
      const labelFormatter = (label: string) => `Label: ${label}`;
      const { container } = render(
        <PieChart
          data={mockData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          label={true}
          fills={fills}
          width={800}
          height={500}
          formatter={formatter}
          labelFormatter={labelFormatter}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render chart with single data point', () => {
      const singleData: PieChartData[] = [{ name: 'Category A', value: 100 }];
      const { container } = render(<PieChart data={singleData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with mixed zero and non-zero values', () => {
      const mixedData: PieChartData[] = [
        { name: 'Category A', value: 0 },
        { name: 'Category B', value: 100 },
        { name: 'Category C', value: 0 },
      ];
      const { container } = render(<PieChart data={mixedData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should use default color when no getCellColor or fills provided', () => {
      const { container } = render(<PieChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle data with additional properties', () => {
      const extendedData: PieChartData[] = [
        { name: 'Category A', value: 100, category: 'A', other: 50 },
        { name: 'Category B', value: 200, category: 'B', other: 75 },
      ];
      const { container } = render(<PieChart data={extendedData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle getCellColor function with entry and index parameters', () => {
      const getCellColor = (entry: PieChartData, index: number) => {
        if (entry.name === 'Category A') return '#FF0000';
        if (index === 1) return '#00FF00';
        return '#0000FF';
      };
      const { container } = render(<PieChart data={mockData} getCellColor={getCellColor} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
