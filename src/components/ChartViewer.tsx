import { useState, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ChartRecommendation } from '../utils/DataAnalyzer';

interface ChartViewerProps {
  data: any[];
  chartConfig: ChartRecommendation;
  title: string;
}

const COLORS = ['#ec4899', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#14b8a6', '#f97316'];

export function ChartViewer({ data, chartConfig, title }: ChartViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullscreenZoomLevel, setFullscreenZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [fullscreenPanOffset, setFullscreenPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const fullscreenChartRef = useRef<HTMLDivElement>(null);
  
  const prepareData = () => {
    if (!data || data.length === 0) return [];

    // For pie charts, aggregate data by category
    if (chartConfig.type === 'pie' && chartConfig.category && chartConfig.yAxis?.[0]) {
      const aggregated: Record<string, number> = {};
      data.forEach(row => {
        const category = row[chartConfig.category!];
        const value = Number(row[chartConfig.yAxis![0]]);
        if (category && !isNaN(value)) {
          aggregated[category] = (aggregated[category] || 0) + value;
        }
      });
      return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
    }

    // For all other chart types, aggregate data by x-axis to handle duplicates
    if (chartConfig.xAxis) {
      const aggregated: Record<string, any> = {};
      
      data.forEach(row => {
        const xValue = row[chartConfig.xAxis!];
        if (!xValue) return;
        
        if (!aggregated[xValue]) {
          aggregated[xValue] = { [chartConfig.xAxis!]: xValue };
          // Initialize all y-axis values
          chartConfig.yAxis?.forEach(yKey => {
            aggregated[xValue][yKey] = 0;
            aggregated[xValue][`${yKey}_count`] = 0;
          });
        }
        
        // Sum up all y-axis values for the same x-axis value
        chartConfig.yAxis?.forEach(yKey => {
          const value = Number(row[yKey]);
          if (!isNaN(value)) {
            aggregated[xValue][yKey] += value;
            aggregated[xValue][`${yKey}_count`]++;
          }
        });
      });
      
      // Convert to array and calculate averages if there were multiple entries
      const result = Object.values(aggregated).map(item => {
        const processed: any = { [chartConfig.xAxis!]: item[chartConfig.xAxis!] };
        
        chartConfig.yAxis?.forEach(yKey => {
          const count = item[`${yKey}_count`];
          if (count > 1) {
            // If multiple values exist for same x-axis, take average
            processed[yKey] = item[yKey] / count;
          } else {
            processed[yKey] = item[yKey];
          }
        });
        
        return processed;
      });
      
      // Sort by x-axis value (works for both numbers and dates/strings)
      result.sort((a, b) => {
        const aVal = a[chartConfig.xAxis!];
        const bVal = b[chartConfig.xAxis!];
        
        // Try numeric comparison first
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        
        // Fall back to string comparison
        return String(aVal).localeCompare(String(bVal));
      });
      
      return result;
    }

    return data;
  };

  const chartData = prepareData();

  // Zoom handlers
  const handleZoom = (delta: number, isFullscreenView: boolean = false) => {
    if (isFullscreenView) {
      setFullscreenZoomLevel(prev => Math.max(0.5, Math.min(10, prev + delta)));
    } else {
      setZoomLevel(prev => Math.max(0.5, Math.min(10, prev + delta)));
    }
  };

  const handleResetZoom = (isFullscreenView: boolean = false) => {
    if (isFullscreenView) {
      setFullscreenZoomLevel(1);
      setFullscreenPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent, isFullscreenView: boolean = false) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta, isFullscreenView);
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent, isFullscreenView: boolean = false) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    if (currentZoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent, isFullscreenView: boolean = false) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      if (isFullscreenView) {
        setFullscreenPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      } else {
        setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Calculate zoom domains for axis-based charts
  const getZoomedDomain = (isFullscreenView: boolean = false) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    const currentPan = isFullscreenView ? fullscreenPanOffset : panOffset;
    
    if (currentZoom === 1) return null;
    
    const dataLength = chartData.length;
    const visibleRange = dataLength / currentZoom;
    const panRatio = currentPan.x / 500; // Normalize pan
    
    let start = Math.floor((dataLength - visibleRange) / 2 + panRatio * dataLength);
    start = Math.max(0, Math.min(start, dataLength - visibleRange));
    
    const end = Math.min(start + visibleRange, dataLength);
    
    return { start, end };
  };

  const renderChart = (height: number = 500, isFullscreenView: boolean = false) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    const zoomedDomain = getZoomedDomain(isFullscreenView);
    const displayData = zoomedDomain 
      ? chartData.slice(Math.floor(zoomedDomain.start), Math.ceil(zoomedDomain.end))
      : chartData;
    
    const chartProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (chartConfig.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={displayData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis} 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              {chartConfig.yAxis?.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ 
                    r: 4, 
                    strokeWidth: 2, 
                    fill: 'white',
                    stroke: COLORS[index % COLORS.length]
                  }}
                  activeDot={{ 
                    r: 6,
                    fill: COLORS[index % COLORS.length],
                    stroke: 'white',
                    strokeWidth: 2
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={displayData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {chartConfig.yAxis?.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[index % COLORS.length]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={Math.min((height > 600 ? 180 : 140) * currentZoom, height * 0.4)}
                label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
                labelLine={{ stroke: '#666', strokeWidth: 1 }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis} 
                name={chartConfig.xAxis}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey={chartConfig.yAxis?.[0]} 
                name={chartConfig.yAxis?.[0]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Scatter 
                name={`${chartConfig.xAxis} vs ${chartConfig.yAxis?.[0]}`} 
                data={displayData} 
                fill={COLORS[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={displayData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {chartConfig.yAxis?.map((key, index) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={displayData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {chartConfig.yAxis?.map((key, index) => {
                if (index === 0) {
                  return <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} radius={[8, 8, 0, 0]} />;
                } else {
                  return <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} strokeWidth={3} />;
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-center py-8 text-gray-500">Chart type not supported</div>;
    }
  };

  const getChartStats = () => {
    const stats = [];
    
    if (chartConfig.yAxis) {
      chartConfig.yAxis.forEach(metric => {
        const values = chartData.map(d => Number(d[metric])).filter(v => !isNaN(v));
        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = sum / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);
          
          stats.push({
            metric,
            avg: avg.toFixed(2),
            max: max.toLocaleString(),
            min: min.toLocaleString(),
            total: sum.toLocaleString()
          });
        }
      });
    }
    
    return stats;
  };

  const stats = getChartStats();

  const ZoomControls = ({ isFullscreenView = false }: { isFullscreenView?: boolean }) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    
    return (
      <div className="flex items-center gap-2 bg-white border rounded-lg p-2 shadow-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(0.2, isFullscreenView)}
          disabled={currentZoom >= 10}
          className="flex items-center gap-1"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(-0.2, isFullscreenView)}
          disabled={currentZoom <= 0.5}
          className="flex items-center gap-1"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleResetZoom(isFullscreenView)}
          disabled={currentZoom === 1}
          className="flex items-center gap-1"
        >
          <Maximize className="w-4 h-4" />
          Reset
        </Button>
        <div className="px-3 py-1 bg-gray-100 rounded text-sm">
          {Math.round(currentZoom * 100)}%
        </div>
        {currentZoom > 1 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pl-2 border-l">
            <Move className="w-3 h-3" />
            Drag to pan
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-2">{chartConfig.reason}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Expand
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zoom Controls */}
          <div className="flex justify-end">
            <ZoomControls />
          </div>

          {/* Chart */}
          <div 
            ref={chartRef}
            className="bg-white rounded-lg"
            onWheel={(e) => handleWheel(e, false)}
            onMouseDown={(e) => handleMouseDown(e, false)}
            onMouseMove={(e) => handleMouseMove(e, false)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
              overflow: 'hidden'
            }}
          >
            {renderChart(700, false)}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Hold Ctrl/Cmd and scroll to zoom • Drag to pan when zoomed
          </div>

          {/* Statistics */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">
                    {stat.metric}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Average</div>
                      <div className="font-semibold">{stat.avg}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total</div>
                      <div className="font-semibold">{stat.total}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Max</div>
                      <div className="font-semibold text-green-600">{stat.max}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Min</div>
                      <div className="font-semibold text-blue-600">{stat.min}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0" aria-describedby="chart-description">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle>{title}</DialogTitle>
                <p id="chart-description" className="text-sm text-gray-500 mt-1">{chartConfig.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <ZoomControls isFullscreenView={true} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-2"
                >
                  <Minimize2 className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 pt-4 h-[calc(100%-8rem)] overflow-auto">
            <div 
              ref={fullscreenChartRef}
              className="bg-white rounded-lg h-full min-h-[600px]"
              onWheel={(e) => handleWheel(e, true)}
              onMouseDown={(e) => handleMouseDown(e, true)}
              onMouseMove={(e) => handleMouseMove(e, true)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: fullscreenZoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                overflow: 'hidden'
              }}
            >
              {renderChart(Math.max(600, window.innerHeight - 300), true)}
            </div>

            <div className="text-sm text-gray-500 text-center mt-2">
              Hold Ctrl/Cmd and scroll to zoom • Drag to pan when zoomed
            </div>
            
            {/* Fullscreen Statistics */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{stat.metric}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Average:</span>
                        <span className="font-semibold">{stat.avg}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-semibold">{stat.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Max:</span>
                        <span className="font-semibold text-green-600">{stat.max}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Min:</span>
                        <span className="font-semibold text-blue-600">{stat.min}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}