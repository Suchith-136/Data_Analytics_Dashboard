import { useState, useMemo, useEffect } from 'react';
import { FileText, TrendingUp, X, ChevronDown, ChevronUp, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { DatasetAnalysis, ChartRecommendation } from '../utils/DataAnalyzer';
import { ChartViewer } from './ChartViewer';
import { InsightPanel } from './InsightPanel';
import { GlobalMetricSearch } from './GlobalMetricSearch';
import { AdvancedFilters } from './AdvancedFilters';
import { InsightKPIPanel } from './InsightKPIPanel';
import { EnhancedChartViewer } from './EnhancedChartViewer';

interface DatasetCardProps {
  name: string;
  description?: string;
  data: any[];
  analysis: DatasetAnalysis;
  onRemove: () => void;
}

export function DatasetCard({ name, description, data, analysis, onRemove }: DatasetCardProps) {
  const [selectedChart, setSelectedChart] = useState<ChartRecommendation>(
    analysis.recommendedCharts[0]
  );
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'name'>('confidence');
  
  // Metric filtering state
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const previewData = data.slice(0, 10);

  // Initialize selected metrics when chart changes
  useEffect(() => {
    if (selectedChart?.yAxis) {
      setSelectedMetrics(selectedChart.yAxis);
    }
  }, [selectedChart]);

  // Get unique chart types for filter
  const chartTypes = useMemo(() => {
    const types = new Set(analysis.recommendedCharts.map(chart => chart.type));
    return Array.from(types);
  }, [analysis.recommendedCharts]);

  // Filter and sort charts (removed search query since we're using metric filter now)
  const filteredAndSortedCharts = useMemo(() => {
    let charts = [...analysis.recommendedCharts];

    // Apply type filter
    if (filterType !== 'all') {
      charts = charts.filter(chart => chart.type === filterType);
    }

    // Apply sorting
    charts.sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    return charts;
  }, [analysis.recommendedCharts, filterType, sortBy]);

  // Update selected chart if it's filtered out
  useEffect(() => {
    if (filteredAndSortedCharts.length > 0 && !filteredAndSortedCharts.includes(selectedChart)) {
      setSelectedChart(filteredAndSortedCharts[0]);
    }
  }, [filteredAndSortedCharts, selectedChart]);

  // Create filtered chart config based on selected metrics
  const filteredChartConfig = useMemo(() => {
    if (!selectedChart || selectedMetrics.length === 0) {
      return selectedChart;
    }

    return {
      ...selectedChart,
      yAxis: selectedMetrics
    };
  }, [selectedChart, selectedMetrics]);

  // Get all numeric columns for metric filtering
  const availableMetrics = useMemo(() => {
    if (!selectedChart?.yAxis) return [];
    return selectedChart.yAxis;
  }, [selectedChart]);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      {/* SECTION 1: Dataset Header - Fixed Height */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="shrink-0 mt-1">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate">{name}</CardTitle>
                {description && (
                  <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
                )}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Badge variant="outline" className="bg-white shrink-0">
                    {analysis.rowCount} rows
                  </Badge>
                  <Badge variant="outline" className="bg-white shrink-0">
                    {analysis.columns.length} columns
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRemove}
              className="text-gray-500 hover:text-red-600 shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* SECTION 2: Data Preview - Collapsible */}
          <div className="w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataPreview(!showDataPreview)}
              className="w-full justify-between h-10"
            >
              <span>Data Preview</span>
              {showDataPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showDataPreview && (
              <div className="mt-3 border rounded-lg overflow-auto max-h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0] || {}).map(key => (
                        <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <TableCell key={i} className="whitespace-nowrap">{String(value)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* SECTION 3: Chart Type Selection - Fixed Layout */}
          {analysis.recommendedCharts.length > 0 && (
            <div className="w-full bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="font-medium">Visualization Type</span>
                </div>
                <Badge variant="outline" className="bg-white shrink-0">
                  {filteredAndSortedCharts.length} charts available
                </Badge>
              </div>

              {/* Filter and Sort Controls - Fixed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* Filter by Type */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {chartTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type} Chart
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: 'confidence' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confidence">Sort by Confidence</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Type Buttons - Fixed Layout */}
              {filteredAndSortedCharts.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredAndSortedCharts.map((chart, index) => (
                      <Button
                        key={index}
                        variant={selectedChart === chart ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedChart(chart)}
                        className="capitalize h-9"
                      >
                        {chart.type} Chart
                        <Badge 
                          variant="secondary" 
                          className={selectedChart === chart ? 'ml-2 bg-blue-700' : 'ml-2'}
                        >
                          {Math.round(chart.confidence * 100)}%
                        </Badge>
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {selectedChart?.reason}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No charts available for this filter</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className="mt-2"
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: Metric Search Filter - Fixed Above Chart */}
      {selectedChart && availableMetrics.length > 0 && (
        <Card className="border-2 border-blue-300 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filter Chart Metrics
            </CardTitle>
            <CardDescription>
              Search and select specific metrics to display on the chart
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <MetricSearchFilter
              availableMetrics={availableMetrics}
              selectedMetrics={selectedMetrics}
              onMetricsChange={setSelectedMetrics}
              xAxisColumn={selectedChart.xAxis}
            />
          </CardContent>
        </Card>
      )}

      {/* SECTION 5: Chart Visualization - Fixed Container */}
      {selectedChart && selectedMetrics.length > 0 && (
        <div className="w-full">
          <ChartViewer 
            data={data} 
            chartConfig={filteredChartConfig}
            title={`${name} - ${selectedChart.type.charAt(0).toUpperCase() + selectedChart.type.slice(1)} Chart`}
          />
        </div>
      )}

      {/* SECTION 6: Insights - Fixed Layout */}
      {analysis.insights.length > 0 && (
        <div className="w-full">
          <InsightPanel insights={analysis.insights} datasetName={name} />
        </div>
      )}
    </div>
  );
}