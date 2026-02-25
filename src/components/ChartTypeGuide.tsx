import { useState } from 'react';
import { Info, LineChart, BarChart3, AreaChart, Target, PieChart, Layers, GitMerge, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';

export function ChartTypeGuide() {
  const [open, setOpen] = useState(false);

  const chartTypes = [
    {
      name: 'Line Chart',
      icon: <LineChart className="w-6 h-6" />,
      description: 'Shows trends over time with connected data points',
      bestFor: 'Time series data, trends, continuous data',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      name: 'Bar Chart',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Compares values across categories using vertical bars',
      bestFor: 'Comparing discrete categories, showing differences',
      color: 'bg-green-100 text-green-700'
    },
    {
      name: 'Area Chart',
      icon: <AreaChart className="w-6 h-6" />,
      description: 'Similar to line chart but with filled area below',
      bestFor: 'Showing volume or magnitude over time',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      name: 'Scatter Chart',
      icon: <Target className="w-6 h-6" />,
      description: 'Displays individual data points to show distribution',
      bestFor: 'Finding patterns, correlations, outliers',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      name: 'Pie Chart',
      icon: <PieChart className="w-6 h-6" />,
      description: 'Shows proportions of a whole as slices',
      bestFor: 'Showing percentage breakdown, composition',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      name: 'Radar Chart',
      icon: <Layers className="w-6 h-6" />,
      description: 'Displays multivariate data on axes starting from center',
      bestFor: 'Comparing multiple variables, performance metrics',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      name: 'Composed Chart',
      icon: <GitMerge className="w-6 h-6" />,
      description: 'Combines bars and lines in one chart',
      bestFor: 'Showing related metrics with different scales',
      color: 'bg-cyan-100 text-cyan-700'
    },
    {
      name: 'Stacked Bar',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Stacks bars to show part-to-whole relationships',
      bestFor: 'Showing composition and comparison together',
      color: 'bg-teal-100 text-teal-700'
    },
    {
      name: 'Stacked Area',
      icon: <AreaChart className="w-6 h-6" />,
      description: 'Stacks areas to show cumulative values over time',
      bestFor: 'Showing how parts contribute to total over time',
      color: 'bg-emerald-100 text-emerald-700'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Chart Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            Chart Type Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-gray-600">
            Choose the right chart type for your data analysis. Each chart type excels at different visualization tasks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartTypes.map((chart, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${chart.color}`}>
                      {chart.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{chart.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {chart.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">Best For:</div>
                    <Badge variant="secondary" className="text-xs">
                      {chart.bestFor}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Line charts</strong> are ideal for showing accident trends over months/years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Bar charts</strong> work best for comparing metrics across different time periods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Pie charts</strong> help visualize the distribution of total deaths, injuries, or losses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Radar charts</strong> are great for comparing multiple safety metrics at once</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Stacked charts</strong> show how different categories contribute to totals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}