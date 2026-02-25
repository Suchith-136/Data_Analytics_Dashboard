import { useState, useMemo, useEffect } from 'react';
import { FileText, X, ChevronDown, ChevronUp, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { DatasetAnalysis } from '../utils/DataAnalyzer';
import { GlobalMetricSearch } from './GlobalMetricSearch';
import { AdvancedFilters } from './AdvancedFilters';
import { InsightKPIPanel } from './InsightKPIPanel';
import { EnhancedChartViewer } from './EnhancedChartViewer';

interface EnhancedDatasetCardProps {
  name: string;
  description?: string;
  data: any[];
  analysis: DatasetAnalysis;
  onRemove: () => void;
  onRefresh?: () => void;
}

export function EnhancedDatasetCard({ 
  name, 
  description, 
  data, 
  analysis, 
  onRemove,
  onRefresh 
}: EnhancedDatasetCardProps) {
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar' | 'composed' | 'stackedBar' | 'stackedArea'>('line');
  const [showOutliers, setShowOutliers] = useState(false);
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const previewData = data.slice(0, 10);

  // Extract all numeric columns
  const numericColumns = useMemo(() => {
    const numeric: string[] = [];
    if (data.length === 0) return numeric;

    const firstRow = data[0];
    Object.keys(firstRow).forEach(key => {
      // Check if the column contains mostly numeric values
      const values = data.slice(0, 100).map(row => row[key]);
      const numericCount = values.filter(v => !isNaN(Number(v)) && v !== '' && v !== null).length;
      if (numericCount > values.length * 0.7) {
        numeric.push(key);
      }
    });

    return numeric;
  }, [data]);

  // Find date/time column
  const dateColumn = useMemo(() => {
    if (data.length === 0) return undefined;
    
    const firstRow = data[0];
    const possibleDateColumns = Object.keys(firstRow).filter(key => 
      key.toLowerCase().includes('date') || 
      key.toLowerCase().includes('time') ||
      key.toLowerCase().includes('month') ||
      key.toLowerCase().includes('year') ||
      key.toLowerCase().includes('period')
    );

    return possibleDateColumns[0] || Object.keys(firstRow)[0];
  }, [data]);

  // Extract years from data
  const availableYears = useMemo(() => {
    if (!dateColumn || data.length === 0) return [];

    const years = new Set<number>();
    data.forEach(row => {
      const dateValue = String(row[dateColumn]);
      const yearMatch = dateValue.match(/\d{4}/);
      if (yearMatch) {
        years.add(parseInt(yearMatch[0]));
      }
    });

    return Array.from(years).sort();
  }, [data, dateColumn]);

  // Initialize with all metrics
  useEffect(() => {
    if (numericColumns.length > 0 && selectedMetrics.length === 0) {
      setSelectedMetrics(numericColumns.slice(0, 3)); // Start with first 3 metrics
    }
  }, [numericColumns]);

  // Initialize with all years
  useEffect(() => {
    if (availableYears.length > 0 && selectedYears.length === 0) {
      setSelectedYears(availableYears);
    }
  }, [availableYears]);

  // Handle show all metrics toggle
  useEffect(() => {
    if (showAllMetrics) {
      setSelectedMetrics(numericColumns);
    } else if (selectedMetrics.length === numericColumns.length) {
      setSelectedMetrics(numericColumns.slice(0, 3));
    }
  }, [showAllMetrics, numericColumns]);

  // Filter data by years
  const filteredData = useMemo(() => {
    if (selectedYears.length === 0 || selectedYears.length === availableYears.length) {
      return data;
    }

    if (!dateColumn) return data;

    return data.filter(row => {
      const dateValue = String(row[dateColumn]);
      const yearMatch = dateValue.match(/\d{4}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        return selectedYears.includes(year);
      }
      return false;
    });
  }, [data, selectedYears, availableYears, dateColumn]);

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      {/* HEADER SECTION - Fixed Height */}
      <Card className="border-2 border-gray-300 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="shrink-0 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl truncate">{name}</CardTitle>
                {description && (
                  <CardDescription className="mt-2 line-clamp-2 text-blue-100">
                    {description}
                  </CardDescription>
                )}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Badge variant="secondary" className="bg-white/90 text-blue-900 shrink-0">
                    📊 {analysis.rowCount.toLocaleString()} rows
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-blue-900 shrink-0">
                    📈 {analysis.columns.length} columns
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-blue-900 shrink-0">
                    🔢 {numericColumns.length} metrics
                  </Badge>
                  {availableYears.length > 0 && (
                    <Badge variant="secondary" className="bg-white/90 text-blue-900 shrink-0">
                      📅 {availableYears[0]} - {availableYears[availableYears.length - 1]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {onRefresh && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onRefresh}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRemove}
                className="text-white hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataPreview(!showDataPreview)}
            className="w-full justify-between h-10 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Data Preview
            </span>
            {showDataPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showDataPreview && (
            <div className="mt-4 border-2 border-gray-200 rounded-lg overflow-auto max-h-80 shadow-inner">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {Object.keys(previewData[0] || {}).map(key => (
                      <TableHead key={key} className="whitespace-nowrap font-semibold">{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      {Object.values(row).map((value: any, i) => (
                        <TableCell key={i} className="whitespace-nowrap">{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GLOBAL METRIC SEARCH */}
      <GlobalMetricSearch
        availableMetrics={numericColumns}
        selectedMetrics={selectedMetrics}
        onMetricsChange={setSelectedMetrics}
      />

      {/* ADVANCED FILTERS */}
      {availableYears.length > 0 && (
        <AdvancedFilters
          years={availableYears}
          selectedYears={selectedYears}
          onYearsChange={setSelectedYears}
          chartType={chartType}
          onChartTypeChange={setChartType}
          showOutliersOnly={showOutliers}
          onShowOutliersChange={setShowOutliers}
          showAllMetrics={showAllMetrics}
          onShowAllMetricsChange={setShowAllMetrics}
        />
      )}

      <Separator className="my-8" />

      {/* KPI INSIGHTS PANEL */}
      {selectedMetrics.length > 0 && (
        <>
          <InsightKPIPanel
            data={filteredData}
            selectedMetrics={selectedMetrics}
            dateColumn={dateColumn}
          />
          <Separator className="my-8" />
        </>
      )}

      {/* ENHANCED CHART VIEWER */}
      {selectedMetrics.length > 0 && dateColumn && (
        <EnhancedChartViewer
          data={filteredData}
          xAxis={dateColumn}
          yAxis={selectedMetrics}
          title={`${name} - Road Accident Analytics Dashboard`}
          description={`Visualizing ${selectedMetrics.length} metric${selectedMetrics.length > 1 ? 's' : ''} across ${filteredData.length} data points`}
          chartType={chartType}
          showOutliers={showOutliers}
        />
      )}

      {/* NO DATA STATE */}
      {selectedMetrics.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Metrics Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Use the Global Metric Search above to select metrics you want to visualize
            </p>
            <Button 
              onClick={() => setSelectedMetrics(numericColumns.slice(0, 3))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Load Default Metrics
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}