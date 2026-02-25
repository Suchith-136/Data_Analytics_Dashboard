import { useState, useMemo } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MetricSearchFilterProps {
  availableMetrics: string[];
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
  xAxisColumn?: string;
}

export function MetricSearchFilter({ 
  availableMetrics, 
  selectedMetrics, 
  onMetricsChange,
  xAxisColumn 
}: MetricSearchFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Filter out the x-axis column from available metrics
  const selectableMetrics = useMemo(() => {
    return availableMetrics.filter(metric => metric !== xAxisColumn);
  }, [availableMetrics, xAxisColumn]);

  // Filter metrics based on search
  const filteredMetrics = useMemo(() => {
    if (!searchValue.trim()) return selectableMetrics;
    return selectableMetrics.filter(metric =>
      metric.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [selectableMetrics, searchValue]);

  const handleSelectMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      // Remove metric
      onMetricsChange(selectedMetrics.filter(m => m !== metric));
    } else {
      // Add metric
      onMetricsChange([...selectedMetrics, metric]);
    }
  };

  const handleRemoveMetric = (metric: string) => {
    onMetricsChange(selectedMetrics.filter(m => m !== metric));
  };

  const handleReset = () => {
    onMetricsChange(selectableMetrics);
    setSearchValue('');
  };

  const handleClearAll = () => {
    onMetricsChange([]);
    setSearchValue('');
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input with Popover */}
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search metrics (e.g., Avg Response Time, Deaths, Traffic Volume)..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="pl-9 pr-10 h-11 bg-white border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue('');
                    setOpen(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command>
              <CommandList>
                {filteredMetrics.length === 0 ? (
                  <CommandEmpty>No metrics found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredMetrics.map((metric) => (
                      <CommandItem
                        key={metric}
                        onSelect={() => {
                          handleSelectMetric(metric);
                          setSearchValue('');
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{metric}</span>
                          {selectedMetrics.includes(metric) && (
                            <Badge variant="secondary" className="ml-2">Selected</Badge>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="default"
          onClick={handleReset}
          className="shrink-0 h-11 px-4"
          title="Reset to show all metrics"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Selected Metrics Display */}
      {selectedMetrics.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Selected Metrics ({selectedMetrics.length} of {selectableMetrics.length})
            </span>
            {selectedMetrics.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs text-blue-700 hover:text-blue-900"
              >
                Clear All
              </Button>
            )}
          </div>
          {selectedMetrics.map((metric) => (
            <Badge
              key={metric}
              variant="default"
              className="pl-3 pr-2 py-1.5 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <span className="mr-2">{metric}</span>
              <button
                onClick={() => handleRemoveMetric(metric)}
                className="hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Available Metrics Grid */}
      {selectedMetrics.length < selectableMetrics.length && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-3">
            Available Metrics - Click to add:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectableMetrics
              .filter(metric => !selectedMetrics.includes(metric))
              .map((metric) => (
                <Badge
                  key={metric}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-colors px-3 py-1.5"
                  onClick={() => handleSelectMetric(metric)}
                >
                  {metric}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 px-1">
        💡 Tip: Search and select metrics to dynamically update the chart. The graph will adjust automatically.
      </p>
    </div>
  );
}