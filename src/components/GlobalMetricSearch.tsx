import { useState, useMemo } from 'react';
import { Search, X, Filter as FilterIcon, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GlobalMetricSearchProps {
  availableMetrics: string[];
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
  metricCategories?: {
    'Accident Severity': string[];
    'Human Behavior': string[];
    'Vehicle Data': string[];
    'Infrastructure': string[];
    'Other': string[];
  };
}

export function GlobalMetricSearch({ 
  availableMetrics, 
  selectedMetrics, 
  onMetricsChange,
  metricCategories
}: GlobalMetricSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Auto-categorize metrics if categories not provided
  const categories = useMemo(() => {
    if (metricCategories) return metricCategories;

    const defaultCategories: any = {
      'Accident Severity': [],
      'Human Behavior': [],
      'Vehicle Data': [],
      'Infrastructure': [],
      'Other': []
    };

    availableMetrics.forEach(metric => {
      const lower = metric.toLowerCase();
      if (lower.includes('death') || lower.includes('injury') || lower.includes('severity') || lower.includes('loss')) {
        defaultCategories['Accident Severity'].push(metric);
      } else if (lower.includes('speed') || lower.includes('violation') || lower.includes('drunk') || lower.includes('behavior')) {
        defaultCategories['Human Behavior'].push(metric);
      } else if (lower.includes('vehicle') || lower.includes('motorcycle') || lower.includes('car') || lower.includes('registered')) {
        defaultCategories['Vehicle Data'].push(metric);
      } else if (lower.includes('road') || lower.includes('infrastructure') || lower.includes('signal') || lower.includes('response')) {
        defaultCategories['Infrastructure'].push(metric);
      } else {
        defaultCategories['Other'].push(metric);
      }
    });

    return defaultCategories;
  }, [availableMetrics, metricCategories]);

  // Filter metrics based on search and category
  const filteredMetrics = useMemo(() => {
    let metrics = availableMetrics;

    // Apply category filter
    if (activeCategory !== 'all') {
      metrics = categories[activeCategory] || [];
    }

    // Apply search filter
    if (searchValue.trim()) {
      metrics = metrics.filter(metric =>
        metric.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return metrics;
  }, [availableMetrics, searchValue, activeCategory, categories]);

  const handleSelectMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      onMetricsChange(selectedMetrics.filter(m => m !== metric));
    } else {
      onMetricsChange([...selectedMetrics, metric]);
    }
    setSearchValue('');
  };

  const handleRemoveMetric = (metric: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onMetricsChange(selectedMetrics.filter(m => m !== metric));
  };

  const handleShowAll = () => {
    onMetricsChange(availableMetrics);
  };

  const handleClearAll = () => {
    onMetricsChange([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Accident Severity': return <AlertCircle className="w-4 h-4" />;
      case 'Human Behavior': return <TrendingUp className="w-4 h-4" />;
      case 'Vehicle Data': return <TrendingUp className="w-4 h-4" />;
      case 'Infrastructure': return <FilterIcon className="w-4 h-4" />;
      default: return <FilterIcon className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Global Metric Search</h3>
              <p className="text-xs text-gray-600">Filter and visualize specific metrics instantly</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAll}
              className="h-8 text-xs bg-white hover:bg-blue-50"
            >
              Show All
            </Button>
            {selectedMetrics.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 text-xs hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  placeholder="Search metrics: e.g., Deaths, Avg Response Time, Economic Loss, Severity Index..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  className="pl-12 pr-12 h-12 text-base bg-white border-2 border-blue-300 focus:border-blue-500 shadow-sm transition-all"
                />
                {searchValue && (
                  <button
                    onClick={() => {
                      setSearchValue('');
                      setOpen(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[400px] overflow-hidden" 
              align="start"
            >
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="w-full grid grid-cols-5 h-auto p-1">
                  <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
                  <TabsTrigger value="Accident Severity" className="text-xs py-2">Severity</TabsTrigger>
                  <TabsTrigger value="Human Behavior" className="text-xs py-2">Behavior</TabsTrigger>
                  <TabsTrigger value="Vehicle Data" className="text-xs py-2">Vehicles</TabsTrigger>
                  <TabsTrigger value="Infrastructure" className="text-xs py-2">Infra</TabsTrigger>
                </TabsList>

                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredMetrics.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No metrics found
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredMetrics.map((metric) => (
                        <button
                          key={metric}
                          onClick={() => handleSelectMetric(metric)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedMetrics.includes(metric)
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex-1">{metric}</span>
                            {selectedMetrics.includes(metric) && (
                              <Badge variant="default" className="ml-2 text-xs bg-blue-600">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected Metrics */}
        {selectedMetrics.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Active Metrics ({selectedMetrics.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMetrics.map((metric) => (
                <Badge
                  key={metric}
                  variant="default"
                  className="pl-3 pr-2 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all shadow-sm"
                >
                  <span className="mr-2">{metric}</span>
                  <button
                    onClick={(e) => handleRemoveMetric(metric, e)}
                    className="hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Select Categories */}
        {selectedMetrics.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(categories).filter(([_, metrics]) => metrics.length > 0).map(([category, metrics]) => (
              <button
                key={category}
                onClick={() => onMetricsChange(metrics)}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-blue-50 rounded group-hover:bg-blue-100 transition-colors">
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">{category}</div>
                    <div className="text-xs text-gray-500">{metrics.length} metrics</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
