import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface InsightKPIPanelProps {
  data: any[];
  selectedMetrics: string[];
  dateColumn?: string;
}

export function InsightKPIPanel({ data, selectedMetrics, dateColumn }: InsightKPIPanelProps) {
  const insights = useMemo(() => {
    if (!data || data.length === 0 || selectedMetrics.length === 0) {
      return null;
    }

    const results: any = {};

    selectedMetrics.forEach(metric => {
      const values = data
        .map(row => ({
          value: Number(row[metric]),
          date: dateColumn ? row[dateColumn] : null
        }))
        .filter(item => !isNaN(item.value));

      if (values.length === 0) return;

      const numericValues = values.map(v => v.value);
      const max = Math.max(...numericValues);
      const min = Math.min(...numericValues);
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;

      // Find top 3 highest
      const sortedWithDates = [...values].sort((a, b) => b.value - a.value);
      const top3 = sortedWithDates.slice(0, 3);

      // Find lowest
      const lowest = sortedWithDates[sortedWithDates.length - 1];

      // Calculate trend (year-on-year if possible)
      let trend = null;
      if (dateColumn && data.length > 1) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b.value, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b.value, 0) / secondHalf.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        trend = {
          change: change.toFixed(1),
          direction: change > 0 ? 'up' : 'down'
        };
      }

      results[metric] = {
        max,
        min,
        avg: avg.toFixed(2),
        sum: sum.toFixed(2),
        top3,
        lowest,
        trend
      };
    });

    return results;
  }, [data, selectedMetrics, dateColumn]);

  if (!insights || Object.keys(insights).length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select metrics to view insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedMetrics.slice(0, 4).map((metric, index) => {
          const insight = insights[metric];
          if (!insight) return null;

          return (
            <Card key={metric} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 line-clamp-2">
                    {metric}
                  </CardTitle>
                  {insight.trend && (
                    <Badge 
                      variant={insight.trend.direction === 'up' ? 'destructive' : 'default'}
                      className="ml-2 shrink-0"
                    >
                      {insight.trend.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(insight.trend.change)}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-2xl font-bold text-gray-900">{insight.avg}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                  <div>
                    <p className="text-gray-500">Max</p>
                    <p className="font-semibold text-red-600">{insight.max.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min</p>
                    <p className="font-semibold text-green-600">{insight.min.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedMetrics.map(metric => {
          const insight = insights[metric];
          if (!insight) return null;

          return (
            <Card key={metric} className="bg-white border-2 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-base">{metric}</CardTitle>
                    <p className="text-xs text-gray-600 mt-1">Detailed Analysis</p>
                  </div>
                  {insight.trend && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      insight.trend.direction === 'up' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {insight.trend.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(insight.trend.change)}% change</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Top 3 Highest */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-red-100 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Top 3 Highest Values</h4>
                  </div>
                  <div className="space-y-2">
                    {insight.top3.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="destructive" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                            {index + 1}
                          </Badge>
                          {item.date && (
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-red-700">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lowest Value */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-100 rounded">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Lowest Value</h4>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    {insight.lowest.date && (
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {insight.lowest.date}
                      </span>
                    )}
                    <span className="text-sm font-bold text-green-700">
                      {insight.lowest.value.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Statistical Summary */}
                <div className="pt-3 border-t">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Statistical Summary</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Average</p>
                      <p className="text-sm font-bold text-gray-900">{insight.avg}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Total Sum</p>
                      <p className="text-sm font-bold text-gray-900">{Number(insight.sum).toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Range</p>
                      <p className="text-sm font-bold text-gray-900">
                        {(insight.max - insight.min).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
