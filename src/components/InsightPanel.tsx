import { TrendingUp, Award, AlertCircle, Info, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Insight } from '../utils/DataAnalyzer';

interface InsightPanelProps {
  insights: Insight[];
  datasetName: string;
}

export function InsightPanel({ insights, datasetName }: InsightPanelProps) {
  
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'top':
        return <Award className="w-5 h-5" />;
      case 'correlation':
        return <Network className="w-5 h-5" />;
      case 'anomaly':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getImportanceColor = (importance: Insight['importance']) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          AI-Powered Insights for {datasetName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 text-blue-600">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <Badge variant="outline" className={getImportanceColor(insight.importance)}>
                    {insight.importance}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
