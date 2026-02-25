// Data analysis utilities for generating insights and recommendations

export interface DataColumn {
  name: string;
  type: 'date' | 'number' | 'string' | 'category';
  uniqueValues: number;
  hasNulls: boolean;
  min?: number;
  max?: number;
  avg?: number;
}

export interface DatasetAnalysis {
  columns: DataColumn[];
  rowCount: number;
  recommendedCharts: ChartRecommendation[];
  insights: Insight[];
}

export interface ChartRecommendation {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'composed';
  confidence: number;
  reason: string;
  xAxis?: string;
  yAxis?: string | string[];
  category?: string;
}

export interface Insight {
  type: 'trend' | 'top' | 'correlation' | 'anomaly' | 'summary';
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export class DataAnalyzer {
  
  static analyzeDataset(data: any[], datasetName: string = 'Dataset'): DatasetAnalysis {
    if (!data || data.length === 0) {
      return {
        columns: [],
        rowCount: 0,
        recommendedCharts: [],
        insights: []
      };
    }

    const columns = this.analyzeColumns(data);
    const recommendedCharts = this.recommendCharts(columns, data);
    const insights = this.generateInsights(data, columns, datasetName);

    return {
      columns,
      rowCount: data.length,
      recommendedCharts,
      insights
    };
  }

  private static analyzeColumns(data: any[]): DataColumn[] {
    if (data.length === 0) return [];

    const firstRow = data[0];
    const columnNames = Object.keys(firstRow);

    return columnNames.map(name => {
      const values = data.map(row => row[name]).filter(v => v !== null && v !== undefined && v !== '');
      const uniqueValues = new Set(values).size;
      const hasNulls = values.length < data.length;

      // Determine column type
      let type: DataColumn['type'] = 'string';
      const numericValues = values.filter(v => !isNaN(Number(v))).map(v => Number(v));
      
      if (this.isDateColumn(name, values)) {
        type = 'date';
      } else if (numericValues.length > values.length * 0.8) {
        type = 'number';
      } else if (uniqueValues < data.length * 0.1 && uniqueValues < 20) {
        type = 'category';
      }

      const column: DataColumn = {
        name,
        type,
        uniqueValues,
        hasNulls
      };

      if (type === 'number' && numericValues.length > 0) {
        column.min = Math.min(...numericValues);
        column.max = Math.max(...numericValues);
        column.avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      }

      return column;
    });
  }

  private static isDateColumn(name: string, values: any[]): boolean {
    const dateKeywords = ['date', 'time', 'day', 'month', 'year', 'timestamp'];
    const nameMatch = dateKeywords.some(keyword => name.toLowerCase().includes(keyword));
    
    if (!nameMatch) return false;

    // Check if values can be parsed as dates
    const dateValues = values.slice(0, 10).filter(v => {
      const date = new Date(v);
      return !isNaN(date.getTime());
    });

    return dateValues.length > values.slice(0, 10).length * 0.5;
  }

  private static recommendCharts(columns: DataColumn[], data: any[]): ChartRecommendation[] {
    const recommendations: ChartRecommendation[] = [];
    
    const dateColumns = columns.filter(c => c.type === 'date');
    const numericColumns = columns.filter(c => c.type === 'number');
    const categoryColumns = columns.filter(c => c.type === 'category');

    // Time series charts
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      recommendations.push({
        type: 'line',
        confidence: 0.9,
        reason: 'Time series data detected - ideal for showing trends over time',
        xAxis: dateColumns[0].name,
        yAxis: numericColumns.map(c => c.name)
      });

      recommendations.push({
        type: 'area',
        confidence: 0.8,
        reason: 'Area chart can show cumulative trends over time',
        xAxis: dateColumns[0].name,
        yAxis: numericColumns.map(c => c.name)
      });
    }

    // Category comparison charts
    if (categoryColumns.length > 0 && numericColumns.length > 0) {
      recommendations.push({
        type: 'bar',
        confidence: 0.85,
        reason: 'Categorical data with numeric values - great for comparisons',
        xAxis: categoryColumns[0].name,
        yAxis: numericColumns.map(c => c.name)
      });

      if (categoryColumns[0].uniqueValues <= 8) {
        recommendations.push({
          type: 'pie',
          confidence: 0.75,
          reason: 'Limited categories - pie chart shows distribution well',
          category: categoryColumns[0].name,
          yAxis: [numericColumns[0].name]
        });
      }
    }

    // Scatter plot for correlation
    if (numericColumns.length >= 2) {
      recommendations.push({
        type: 'scatter',
        confidence: 0.7,
        reason: 'Multiple numeric columns - scatter plot reveals correlations',
        xAxis: numericColumns[0].name,
        yAxis: [numericColumns[1].name]
      });
    }

    // Composed chart for multi-metric analysis
    if (numericColumns.length > 1 && (dateColumns.length > 0 || categoryColumns.length > 0)) {
      recommendations.push({
        type: 'composed',
        confidence: 0.75,
        reason: 'Multiple metrics can be compared simultaneously',
        xAxis: dateColumns[0]?.name || categoryColumns[0]?.name,
        yAxis: numericColumns.map(c => c.name)
      });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private static generateInsights(data: any[], columns: DataColumn[], datasetName: string): Insight[] {
    const insights: Insight[] = [];

    // Summary insight
    insights.push({
      type: 'summary',
      title: 'Dataset Overview',
      description: `This dataset contains ${data.length} records across ${columns.length} fields, including ${columns.filter(c => c.type === 'number').length} numeric metrics, ${columns.filter(c => c.type === 'category').length} categorical variables, and ${columns.filter(c => c.type === 'date').length} time-based fields.`,
      importance: 'medium'
    });

    // Trend analysis for numeric columns
    const numericColumns = columns.filter(c => c.type === 'number');
    const dateColumns = columns.filter(c => c.type === 'date');

    if (dateColumns.length > 0 && numericColumns.length > 0) {
      const dateCol = dateColumns[0].name;
      const sortedData = [...data].sort((a, b) => {
        return new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime();
      });

      numericColumns.forEach(col => {
        const values = sortedData.map(row => Number(row[col.name])).filter(v => !isNaN(v));
        if (values.length < 2) return;

        const trend = this.calculateTrend(values);
        const changePercent = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1);
        
        if (Math.abs(trend) > 0.1) {
          insights.push({
            type: 'trend',
            title: `${col.name} ${trend > 0 ? 'Increasing' : 'Decreasing'} Trend`,
            description: `${col.name} shows a ${trend > 0 ? 'positive' : 'negative'} trend over time with a ${Math.abs(Number(changePercent))}% change from start to end. ${trend > 0 ? 'This indicates growth' : 'This suggests a decline'} in this metric.`,
            importance: Math.abs(Number(changePercent)) > 20 ? 'high' : 'medium'
          });
        }
      });
    }

    // Top values for categorical data
    const categoryColumns = columns.filter(c => c.type === 'category');
    if (categoryColumns.length > 0 && numericColumns.length > 0) {
      const catCol = categoryColumns[0].name;
      const numCol = numericColumns[0].name;

      const aggregated = this.aggregateByCategory(data, catCol, numCol);
      const sorted = Object.entries(aggregated).sort((a, b) => b[1] - a[1]);
      
      if (sorted.length > 0) {
        const top3 = sorted.slice(0, 3);
        insights.push({
          type: 'top',
          title: `Top ${catCol} by ${numCol}`,
          description: `The top 3 ${catCol.toLowerCase()} are: ${top3.map((item, i) => `${i + 1}. ${item[0]} (${item[1].toLocaleString()})`).join(', ')}. ${top3[0][0]} leads with ${((top3[0][1] / sorted.reduce((sum, item) => sum + item[1], 0)) * 100).toFixed(1)}% of the total.`,
          importance: 'high'
        });
      }
    }

    // Correlation insights
    if (numericColumns.length >= 2) {
      const col1 = numericColumns[0];
      const col2 = numericColumns[1];
      const correlation = this.calculateCorrelation(data, col1.name, col2.name);

      if (Math.abs(correlation) > 0.5) {
        insights.push({
          type: 'correlation',
          title: `${col1.name} and ${col2.name} ${correlation > 0 ? 'Positive' : 'Negative'} Correlation`,
          description: `There is a ${Math.abs(correlation) > 0.7 ? 'strong' : 'moderate'} ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation.toFixed(2)}) between ${col1.name} and ${col2.name}. ${correlation > 0 ? 'As one increases, the other tends to increase as well.' : 'As one increases, the other tends to decrease.'}`,
          importance: Math.abs(correlation) > 0.7 ? 'high' : 'medium'
        });
      }
    }

    // Anomaly detection
    numericColumns.forEach(col => {
      const values = data.map(row => Number(row[col.name])).filter(v => !isNaN(v));
      const outliers = this.detectOutliers(values);
      
      if (outliers.length > 0 && outliers.length < values.length * 0.1) {
        insights.push({
          type: 'anomaly',
          title: `Outliers Detected in ${col.name}`,
          description: `Found ${outliers.length} unusual values in ${col.name} that deviate significantly from the normal range. These may represent special events or data quality issues worth investigating.`,
          importance: 'low'
        });
      }
    });

    return insights;
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private static aggregateByCategory(data: any[], categoryCol: string, numericCol: string): Record<string, number> {
    const aggregated: Record<string, number> = {};
    
    data.forEach(row => {
      const category = row[categoryCol];
      const value = Number(row[numericCol]);
      
      if (category && !isNaN(value)) {
        aggregated[category] = (aggregated[category] || 0) + value;
      }
    });
    
    return aggregated;
  }

  private static calculateCorrelation(data: any[], col1: string, col2: string): number {
    const pairs = data
      .map(row => [Number(row[col1]), Number(row[col2])])
      .filter(pair => !isNaN(pair[0]) && !isNaN(pair[1]));
    
    if (pairs.length < 2) return 0;
    
    const n = pairs.length;
    const sum1 = pairs.reduce((sum, pair) => sum + pair[0], 0);
    const sum2 = pairs.reduce((sum, pair) => sum + pair[1], 0);
    const sum1Sq = pairs.reduce((sum, pair) => sum + pair[0] * pair[0], 0);
    const sum2Sq = pairs.reduce((sum, pair) => sum + pair[1] * pair[1], 0);
    const pSum = pairs.reduce((sum, pair) => sum + pair[0] * pair[1], 0);
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
    
    return den === 0 ? 0 : num / den;
  }

  private static detectOutliers(values: number[]): number[] {
    if (values.length < 4) return [];
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.filter(v => v < lowerBound || v > upperBound);
  }

  static combineDatasets(datasets: { name: string; data: any[] }[]): Insight[] {
    const insights: Insight[] = [];

    if (datasets.length < 2) return insights;

    insights.push({
      type: 'summary',
      title: 'Multi-Dataset Analysis',
      description: `Analyzing ${datasets.length} datasets together: ${datasets.map(d => d.name).join(', ')}. Cross-dataset patterns can reveal important relationships in urban planning and transportation.`,
      importance: 'high'
    });

    // Look for common columns across datasets
    const commonColumns = this.findCommonColumns(datasets);
    
    if (commonColumns.length > 0) {
      insights.push({
        type: 'correlation',
        title: 'Common Data Points Identified',
        description: `Found ${commonColumns.length} common fields across datasets: ${commonColumns.slice(0, 3).join(', ')}. These can be used to merge and correlate information for deeper analysis.`,
        importance: 'medium'
      });
    }

    return insights;
  }

  private static findCommonColumns(datasets: { name: string; data: any[] }[]): string[] {
    if (datasets.length === 0) return [];
    
    const allColumns = datasets.map(ds => 
      ds.data.length > 0 ? Object.keys(ds.data[0]) : []
    );
    
    const firstSet = new Set(allColumns[0]);
    const common = allColumns.slice(1).reduce((acc, cols) => {
      return acc.filter(col => cols.includes(col));
    }, Array.from(firstSet));
    
    return common;
  }
}
