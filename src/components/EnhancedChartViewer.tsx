import { useState, useRef, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  ScatterChart, Scatter, PieChart, Pie, Cell, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Maximize, Move, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';

interface EnhancedChartViewerProps {
  data: any[];
  xAxis: string;
  yAxis: string[];
  title: string;
  description?: string;
  chartType?: 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar' | 'composed' | 'stackedBar' | 'stackedArea';
  showOutliers?: boolean;
}

const COLORS = ['#ec4899', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#14b8a6', '#f97316'];

export function EnhancedChartViewer({ 
  data, 
  xAxis, 
  yAxis, 
  title, 
  description,
  chartType = 'line',
  showOutliers = false
}: EnhancedChartViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullscreenZoomLevel, setFullscreenZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [fullscreenPanOffset, setFullscreenPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  const fullscreenChartRef = useRef<HTMLDivElement>(null);
  
  // Prepare and aggregate data
  const prepareData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const aggregated: Record<string, any> = {};
    
    data.forEach(row => {
      const xValue = row[xAxis];
      if (!xValue) return;
      
      if (!aggregated[xValue]) {
        aggregated[xValue] = { [xAxis]: xValue };
        yAxis.forEach(yKey => {
          aggregated[xValue][yKey] = 0;
          aggregated[xValue][`${yKey}_count`] = 0;
        });
      }
      
      yAxis.forEach(yKey => {
        const value = Number(row[yKey]);
        if (!isNaN(value)) {
          aggregated[xValue][yKey] += value;
          aggregated[xValue][`${yKey}_count`]++;
        }
      });
    });
    
    const result = Object.values(aggregated).map(item => {
      const processed: any = { [xAxis]: item[xAxis] };
      
      yAxis.forEach(yKey => {
        const count = item[`${yKey}_count`];
        if (count > 1) {
          processed[yKey] = item[yKey] / count;
        } else {
          processed[yKey] = item[yKey];
        }
      });
      
      return processed;
    });
    
    result.sort((a, b) => {
      const aVal = a[xAxis];
      const bVal = b[xAxis];
      
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      return String(aVal).localeCompare(String(bVal));
    });
    
    return result;
  }, [data, xAxis, yAxis]);

  // Calculate outliers
  const outliers = useMemo(() => {
    if (!showOutliers) return [];
    
    const result: any[] = [];
    
    yAxis.forEach(metric => {
      const values = prepareData.map(d => Number(d[metric])).filter(v => !isNaN(v));
      if (values.length === 0) return;
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      );
      
      prepareData.forEach((point, index) => {
        const value = Number(point[metric]);
        if (Math.abs(value - mean) > 2 * stdDev) {
          result.push({
            index,
            metric,
            value,
            xValue: point[xAxis]
          });
        }
      });
    });
    
    return result;
  }, [prepareData, yAxis, showOutliers, xAxis]);

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

  const handleWheel = (e: React.WheelEvent, isFullscreenView: boolean = false) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta, isFullscreenView);
    }
  };

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

  const getZoomedDomain = (isFullscreenView: boolean = false) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    const currentPan = isFullscreenView ? fullscreenPanOffset : panOffset;
    
    if (currentZoom === 1) return null;
    
    const dataLength = prepareData.length;
    const visibleRange = dataLength / currentZoom;
    const panRatio = currentPan.x / 500;
    
    let start = Math.floor((dataLength - visibleRange) / 2 + panRatio * dataLength);
    start = Math.max(0, Math.min(start, dataLength - visibleRange));
    
    const end = Math.min(start + visibleRange, dataLength);
    
    return { start, end };
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <p className="font-semibold text-gray-900 mb-3 pb-2 border-b">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = (height: number = 500, isFullscreenView: boolean = false) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    const zoomedDomain = getZoomedDomain(isFullscreenView);
    const displayData = zoomedDomain 
      ? prepareData.slice(Math.floor(zoomedDomain.start), Math.ceil(zoomedDomain.end))
      : prepareData;
    
    const chartProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    const commonProps = {
      data: displayData,
      ...chartProps
    };

    const axisProps = {
      xAxis: {
        dataKey: xAxis,
        angle: -45,
        textAnchor: 'end' as const,
        height: 80,
        tick: { fontSize: 12 },
        stroke: '#6b7280'
      },
      yAxis: {
        tick: { fontSize: 12 },
        stroke: '#6b7280'
      }
    };

    // PIE CHART
    if (chartType === 'pie') {
      // For pie chart, we need to transform data differently
      const pieData = yAxis.map((metric, index) => {
        const values = displayData.map(d => Number(d[metric])).filter(v => !isNaN(v));
        const total = values.reduce((a, b) => a + b, 0);
        return {
          name: metric,
          value: total,
          color: COLORS[index % COLORS.length]
        };
      });

      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
              outerRadius={Math.min(height / 3, 200)}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-in-out"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // RADAR CHART
    if (chartType === 'radar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius={Math.min(height / 3, 180)} data={displayData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey={xAxis} tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={90} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxis.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      );
    }

    // SCATTER CHART
    if (chartType === 'scatter') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xAxis}
              type="category"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {yAxis.map((key, index) => (
              <Scatter
                key={key}
                name={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    // COMPOSED CHART (Line + Bar)
    if (chartType === 'composed') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {showOutliers && outliers.length > 0 && (
              <>
                {outliers.slice(0, 5).map((outlier, idx) => (
                  <ReferenceLine
                    key={idx}
                    x={outlier.xValue}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  />
                ))}
              </>
            )}

            {yAxis.map((key, index) => {
              const color = COLORS[index % COLORS.length];
              // Alternate between bar and line
              if (index % 2 === 0) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={color}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                  />
                );
              } else {
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    dot={{ 
                      r: 4, 
                      strokeWidth: 2, 
                      fill: 'white',
                      stroke: color
                    }}
                    activeDot={{ 
                      r: 6,
                      fill: color,
                      stroke: 'white',
                      strokeWidth: 2
                    }}
                  />
                );
              }
            })}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    // STACKED BAR CHART
    if (chartType === 'stackedBar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {yAxis.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                radius={index === yAxis.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // STACKED AREA CHART
    if (chartType === 'stackedArea') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {yAxis.map((key, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                  strokeWidth={2}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // DEFAULT CHARTS (LINE, BAR, AREA)
    const ChartComponent = chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis {...axisProps.xAxis} />
          <YAxis {...axisProps.yAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType={chartType === 'line' ? 'circle' : 'rect'}
          />
          
          {/* Outlier reference lines */}
          {showOutliers && outliers.length > 0 && (
            <>
              {outliers.slice(0, 5).map((outlier, idx) => (
                <ReferenceLine
                  key={idx}
                  x={outlier.xValue}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
              ))}
            </>
          )}

          {yAxis.map((key, index) => {
            const color = COLORS[index % COLORS.length];
            
            if (chartType === 'bar') {
              return (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={color}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              );
            } else if (chartType === 'area') {
              return (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  dot={{ 
                    r: 3, 
                    strokeWidth: 2, 
                    fill: 'white',
                    stroke: color
                  }}
                  activeDot={{ 
                    r: 6,
                    fill: color,
                    stroke: 'white',
                    strokeWidth: 2
                  }}
                />
              );
            } else {
              return (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={color}
                  strokeWidth={2}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  dot={{ 
                    r: 4, 
                    strokeWidth: 2, 
                    fill: 'white',
                    stroke: color
                  }}
                  activeDot={{ 
                    r: 6,
                    fill: color,
                    stroke: 'white',
                    strokeWidth: 2
                  }}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const getChartStats = () => {
    const stats: any[] = [];
    
    yAxis.forEach(metric => {
      const values = prepareData.map(d => Number(d[metric])).filter(v => !isNaN(v));
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
    
    return stats;
  };

  const stats = getChartStats();

  const ZoomControls = ({ isFullscreenView = false }: { isFullscreenView?: boolean }) => {
    const currentZoom = isFullscreenView ? fullscreenZoomLevel : zoomLevel;
    
    return (
      <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg p-2 shadow-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(0.2, isFullscreenView)}
          disabled={currentZoom >= 10}
          className="flex items-center gap-1 h-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(-0.2, isFullscreenView)}
          disabled={currentZoom <= 0.5}
          className="flex items-center gap-1 h-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleResetZoom(isFullscreenView)}
          disabled={currentZoom === 1}
          className="flex items-center gap-1 h-8"
        >
          <Maximize className="w-4 h-4" />
          Reset
        </Button>
        <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
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
      <Card className="w-full border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-2 text-sm">{description}</CardDescription>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {yAxis.map((metric, index) => (
                  <Badge 
                    key={metric} 
                    className="text-xs"
                    style={{ 
                      backgroundColor: COLORS[index % COLORS.length],
                      color: 'white'
                    }}
                  >
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
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
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-end">
            <ZoomControls />
          </div>

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
            {renderChart(600, false)}
          </div>

          <div className="text-xs text-gray-500 text-center bg-gray-50 py-2 rounded">
            Hold Ctrl/Cmd and scroll to zoom • Drag to pan when zoomed
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2 mb-3">
                    {stat.metric}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-gray-500">Average</div>
                      <div className="font-bold text-gray-900">{stat.avg}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total</div>
                      <div className="font-bold text-gray-900">{stat.total}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Max</div>
                      <div className="font-bold text-red-600">{stat.max}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Min</div>
                      <div className="font-bold text-green-600">{stat.min}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0" aria-describedby="chart-description">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                {description && (
                  <p id="chart-description" className="text-sm text-gray-500 mt-1">{description}</p>
                )}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}