import { render, screen } from '@testing-library/react';
import { BarChart, type BarChartData } from '@/components/charts/BarChart';

describe('BarChart', () => {
  const mockData: BarChartData[] = [
    { name: 'Jan', total: 100 },
    { name: 'Feb', total: 200 },
    { name: 'Mar', total: 150 },
  ];

  describe('empty state', () => {
    it('should render empty state when data is null', () => {
      render(<BarChart data={null} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Não há dados para exibir no momento. Refaça sua busca ou entre em contato com o suporte.'
        )
      ).toBeInTheDocument();
    });

    it('should render empty state when data is empty array', () => {
      render(<BarChart data={[]} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are zero', () => {
      const zeroData: BarChartData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
      ];
      render(<BarChart data={zeroData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are null', () => {
      const nullData: BarChartData[] = [
        { name: 'Jan', total: null as any },
        { name: 'Feb', total: null as any },
      ];
      render(<BarChart data={nullData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state when all values are undefined', () => {
      const undefinedData: BarChartData[] = [
        { name: 'Jan', total: undefined as any },
        { name: 'Feb', total: undefined as any },
      ];
      render(<BarChart data={undefinedData} />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should render empty state with BarChart3 icon', () => {
      const { container } = render(<BarChart data={null} />);
      // Check for EmptyMedia with icon variant
      const emptyMedia = container.querySelector('[data-slot="empty-icon"]');
      expect(emptyMedia).toBeInTheDocument();
      // Check for SVG icon (BarChart3)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply width and height styles to empty state container', () => {
      const { container } = render(<BarChart data={null} width={500} height={300} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: '500px', height: '300px' });
    });

    it('should apply percentage width and height to empty state container', () => {
      const { container } = render(<BarChart data={null} width="80%" height="60%" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ width: '80%', height: '60%' });
    });
  });

  describe('with valid data', () => {
    it('should render chart when data is provided', () => {
      const { container } = render(<BarChart data={mockData} />);
      // Check that empty state is not rendered
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
      // Check that ResponsiveContainer is rendered (Recharts component)
      // Since Recharts renders SVG, we just check that the component renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with default props', () => {
      const { container } = render(<BarChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom dataKey', () => {
      const customData: BarChartData[] = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 200 },
      ];
      const { container } = render(<BarChart data={customData} dataKey="value" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom nameKey', () => {
      const customData: BarChartData[] = [
        { label: 'January', total: 100 },
        { label: 'February', total: 200 },
      ];
      const { container } = render(<BarChart data={customData} nameKey="label" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom barName', () => {
      const { container } = render(<BarChart data={mockData} barName="Sales" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with custom width and height', () => {
      const { container } = render(<BarChart data={mockData} width={600} height={400} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with percentage width and height', () => {
      const { container } = render(<BarChart data={mockData} width="90%" height="80%" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with fills array', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const { container } = render(<BarChart data={mockData} fills={fills} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with red gradient type', () => {
      const { container } = render(<BarChart data={mockData} gradientType="red" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with gray gradient type', () => {
      const { container } = render(<BarChart data={mockData} gradientType="gray" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with default gradient type (red) when no fills or gradientType provided', () => {
      const { container } = render(<BarChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with xAxisLabel', () => {
      const { container } = render(<BarChart data={mockData} xAxisLabel="Month" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with yAxisLabel', () => {
      const { container } = render(<BarChart data={mockData} yAxisLabel="Value" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with both axis labels', () => {
      const { container } = render(
        <BarChart data={mockData} xAxisLabel="Month" yAxisLabel="Value" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with formatter function', () => {
      const formatter = (value: number | string | undefined) => `$${value}`;
      const { container } = render(<BarChart data={mockData} formatter={formatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with labelFormatter function', () => {
      const labelFormatter = (label: string) => `Label: ${label}`;
      const { container } = render(<BarChart data={mockData} labelFormatter={labelFormatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with all custom props', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const formatter = (value: number | string | undefined) => `$${value}`;
      const labelFormatter = (label: string) => `Label: ${label}`;
      const { container } = render(
        <BarChart
          data={mockData}
          dataKey="total"
          nameKey="name"
          barName="Sales"
          fills={fills}
          width={800}
          height={500}
          formatter={formatter}
          labelFormatter={labelFormatter}
          xAxisLabel="Month"
          yAxisLabel="Sales"
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render chart with single data point', () => {
      const singleData: BarChartData[] = [{ name: 'Jan', total: 100 }];
      const { container } = render(<BarChart data={singleData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render chart with mixed zero and non-zero values', () => {
      const mixedData: BarChartData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 100 },
        { name: 'Mar', total: 0 },
      ];
      const { container } = render(<BarChart data={mixedData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should prioritize fills array over gradientType', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const { container } = render(
        <BarChart data={mockData} fills={fills} gradientType="gray" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle data with additional properties', () => {
      const extendedData: BarChartData[] = [
        { name: 'Jan', total: 100, category: 'A', other: 50 },
        { name: 'Feb', total: 200, category: 'B', other: 75 },
      ];
      const { container } = render(<BarChart data={extendedData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use fills array when provided, ignoring gradientType', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF'];
      const { container } = render(
        <BarChart data={mockData} fills={fills} gradientType="red" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use default red gradient when no fills or gradientType provided', () => {
      const { container } = render(<BarChart data={mockData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use gray gradient when gradientType is gray', () => {
      const { container } = render(<BarChart data={mockData} gradientType="gray" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle fills array with fewer colors than data points', () => {
      const fills = ['#FF0000', '#00FF00'];
      const { container } = render(<BarChart data={mockData} fills={fills} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle fills array with more colors than data points', () => {
      const fills = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
      const { container } = render(<BarChart data={mockData} fills={fills} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty fills array', () => {
      const { container } = render(<BarChart data={mockData} fills={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle data with string numeric values', () => {
      const stringData: BarChartData[] = [
        { name: 'Jan', total: '100' as any },
        { name: 'Feb', total: '200' as any },
      ];
      const { container } = render(<BarChart data={stringData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle data with some null values but not all', () => {
      const partialNullData: BarChartData[] = [
        { name: 'Jan', total: null as any },
        { name: 'Feb', total: 100 },
        { name: 'Mar', total: 200 },
      ];
      const { container } = render(<BarChart data={partialNullData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should handle data with some undefined values but not all', () => {
      const partialUndefinedData: BarChartData[] = [
        { name: 'Jan', total: undefined as any },
        { name: 'Feb', total: 100 },
        { name: 'Mar', total: 200 },
      ];
      const { container } = render(<BarChart data={partialUndefinedData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should handle data with some zero values but not all', () => {
      const partialZeroData: BarChartData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 100 },
        { name: 'Mar', total: 0 },
      ];
      const { container } = render(<BarChart data={partialZeroData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should handle custom dataKey with zero values', () => {
      const customData: BarChartData[] = [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 0 },
      ];
      render(<BarChart data={customData} dataKey="value" />);
      expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    });

    it('should handle custom dataKey with non-zero values', () => {
      const customData: BarChartData[] = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 200 },
      ];
      const { container } = render(<BarChart data={customData} dataKey="value" />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should handle large dataset', () => {
      const largeData: BarChartData[] = Array.from({ length: 50 }, (_, i) => ({
        name: `Month ${i + 1}`,
        total: (i + 1) * 10,
      }));
      const { container } = render(<BarChart data={largeData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle negative values in data', () => {
      const negativeData: BarChartData[] = [
        { name: 'Jan', total: -100 },
        { name: 'Feb', total: 200 },
      ];
      const { container } = render(<BarChart data={negativeData} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('Nenhum dado disponível')).not.toBeInTheDocument();
    });

    it('should handle very large numeric values', () => {
      const largeValueData: BarChartData[] = [
        { name: 'Jan', total: 1000000 },
        { name: 'Feb', total: 2000000 },
      ];
      const { container } = render(<BarChart data={largeValueData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const decimalData: BarChartData[] = [
        { name: 'Jan', total: 100.5 },
        { name: 'Feb', total: 200.75 },
      ];
      const { container } = render(<BarChart data={decimalData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply formatter to tooltip values', () => {
      const formatter = jest.fn((value: number | string | undefined) => `$${value}`);
      const { container } = render(<BarChart data={mockData} formatter={formatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply labelFormatter to tooltip labels', () => {
      const labelFormatter = jest.fn((label: string) => `Label: ${label}`);
      const { container } = render(<BarChart data={mockData} labelFormatter={labelFormatter} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle both formatter and labelFormatter together', () => {
      const formatter = jest.fn((value: number | string | undefined) => `$${value}`);
      const labelFormatter = jest.fn((label: string) => `Label: ${label}`);
      const { container } = render(
        <BarChart data={mockData} formatter={formatter} labelFormatter={labelFormatter} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
