import { useState } from 'react';
import { Calendar, Filter, BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, TrendingUp, Zap, PieChart, Target, Layers, GitMerge } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ChartTypeGuide } from './ChartTypeGuide';

interface AdvancedFiltersProps {
  years: number[];
  selectedYears: number[];
  onYearsChange: (years: number[]) => void;
  chartType: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar' | 'composed' | 'stackedBar' | 'stackedArea';
  onChartTypeChange: (type: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar' | 'composed' | 'stackedBar' | 'stackedArea') => void;
  showOutliersOnly: boolean;
  onShowOutliersChange: (show: boolean) => void;
  showAllMetrics: boolean;
  onShowAllMetricsChange: (show: boolean) => void;
}

export function AdvancedFilters({
  years,
  selectedYears,
  onYearsChange,
  chartType,
  onChartTypeChange,
  showOutliersOnly,
  onShowOutliersChange,
  showAllMetrics,
  onShowAllMetricsChange
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter(y => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  const selectAllYears = () => {
    onYearsChange(years);
  };

  const clearAllYears = () => {
    onYearsChange([]);
  };

  return (
    <Card className="p-5 bg-white border-2 border-gray-200 shadow-md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <p className="text-xs text-gray-600">Customize your data view</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChartTypeGuide />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>

        {/* Main Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chart Type Selection */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Chart Type
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('line')}
                className="h-9 text-xs px-2"
              >
                <LineChartIcon className="w-3 h-3 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('bar')}
                className="h-9 text-xs px-2"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Bar
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('area')}
                className="h-9 text-xs px-2"
              >
                <AreaChartIcon className="w-3 h-3 mr-1" />
                Area
              </Button>
              <Button
                variant={chartType === 'scatter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('scatter')}
                className="h-9 text-xs px-2"
              >
                <Target className="w-3 h-3 mr-1" />
                Scatter
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('pie')}
                className="h-9 text-xs px-2"
              >
                <PieChart className="w-3 h-3 mr-1" />
                Pie
              </Button>
              <Button
                variant={chartType === 'radar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('radar')}
                className="h-9 text-xs px-2"
              >
                <Layers className="w-3 h-3 mr-1" />
                Radar
              </Button>
              <Button
                variant={chartType === 'composed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('composed')}
                className="h-9 text-xs px-2"
              >
                <GitMerge className="w-3 h-3 mr-1" />
                Mix
              </Button>
              <Button
                variant={chartType === 'stackedBar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('stackedBar')}
                className="h-9 text-xs px-2"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Stack
              </Button>
              <Button
                variant={chartType === 'stackedArea' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartTypeChange('stackedArea')}
                className="h-9 text-xs px-2"
              >
                <AreaChartIcon className="w-3 h-3 mr-1" />
                S.Area
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year Range
              </span>
              <span className="text-xs text-gray-500">
                {selectedYears.length === 0 ? 'All' : `${selectedYears.length} selected`}
              </span>
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {years.map(year => (
                <Badge
                  key={year}
                  variant={selectedYears.includes(year) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors px-3 py-1"
                  onClick={() => toggleYear(year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">Quick Actions</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllYears}
                  className="flex-1 h-8 text-xs"
                >
                  All Years
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllYears}
                  className="flex-1 h-8 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options - Collapsible */}
        {isExpanded && (
          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show All Metrics Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="show-all" className="text-sm font-medium cursor-pointer">
                      Show All Metrics
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Display all available metrics on the chart
                    </p>
                  </div>
                </div>
                <Switch
                  id="show-all"
                  checked={showAllMetrics}
                  onCheckedChange={onShowAllMetricsChange}
                />
              </div>

              {/* Show Outliers Only Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <Label htmlFor="show-outliers" className="text-sm font-medium cursor-pointer">
                      Highlight Outliers
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Show only spikes and unusual data points
                    </p>
                  </div>
                </div>
                <Switch
                  id="show-outliers"
                  checked={showOutliersOnly}
                  onCheckedChange={onShowOutliersChange}
                />
              </div>
            </div>

            {/* Filter Summary */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Active Filters Summary</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Chart: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Years: {selectedYears.length === 0 ? 'All' : selectedYears.join(', ')}
                </Badge>
                {showAllMetrics && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    All Metrics Visible
                  </Badge>
                )}
                {showOutliersOnly && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Outliers Highlighted
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}