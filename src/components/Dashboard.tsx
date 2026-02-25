import { useState } from 'react';
import { BarChart3, Plus, Home } from 'lucide-react';
import { DataUploadPanel } from './DataUploadPanel';
import { EnhancedDatasetCard } from './EnhancedDatasetCard';
import { MultiDatasetAnalysis } from './MultiDatasetAnalysis';
import { DataAnalyzer, DatasetAnalysis } from '../utils/DataAnalyzer';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface LoadedDataset {
  id: string;
  name: string;
  description?: string;
  data: any[];
  analysis: DatasetAnalysis;
}

interface DashboardProps {
  onBackToHome: () => void;
}

export function Dashboard({ onBackToHome }: DashboardProps) {
  const [datasets, setDatasets] = useState<LoadedDataset[]>([]);
  const [showUploadPanel, setShowUploadPanel] = useState(true);

  const handleDatasetLoad = (name: string, data: any[], description?: string) => {
    const analysis = DataAnalyzer.analyzeDataset(data, name);
    
    const newDataset: LoadedDataset = {
      id: `${name}-${Date.now()}`,
      name,
      description,
      data,
      analysis
    };

    setDatasets(prev => [...prev, newDataset]);
    setShowUploadPanel(false);
  };

  const handleRemoveDataset = (id: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Fixed */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl text-gray-900 truncate">
                  Transportation & Urban Planning Analytics
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  Data-driven insights for smarter cities
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={onBackToHome}
                variant="outline"
                size="default"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              {datasets.length > 0 && (
                <Button
                  onClick={() => setShowUploadPanel(!showUploadPanel)}
                  variant={showUploadPanel ? 'outline' : 'default'}
                  size="default"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Dataset
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Stable Container */}
      <main className="container mx-auto px-4 lg:px-6 py-10 max-w-[1600px]">{datasets.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl text-gray-900 mb-3">
                Welcome to Your Analytics Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Upload your data or explore sample datasets to begin analysis
              </p>
            </div>
            <DataUploadPanel onDatasetLoad={handleDatasetLoad} />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upload Panel (collapsible when datasets are loaded) */}
            {showUploadPanel && (
              <>
                <div className="max-w-4xl mx-auto">
                  <DataUploadPanel onDatasetLoad={handleDatasetLoad} />
                </div>
                <Separator className="my-12" />
              </>
            )}

            {/* Multi-Dataset Analysis */}
            {datasets.length >= 2 && (
              <div className="mb-10">
                <MultiDatasetAnalysis 
                  datasets={datasets.map(ds => ({ name: ds.name, data: ds.data }))} 
                />
              </div>
            )}

            {/* Individual Datasets - Stable Layout */}
            <div className="space-y-16">
              {datasets.map(dataset => (
                <EnhancedDatasetCard
                  key={dataset.id}
                  name={dataset.name}
                  description={dataset.description}
                  data={dataset.data}
                  analysis={dataset.analysis}
                  onRemove={() => handleRemoveDataset(dataset.id)}
                />
              ))}
            </div>

            {/* Footer Stats - Fixed Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 p-6 bg-white rounded-lg border shadow-sm">
              <div className="text-center py-2">
                <div className="text-3xl text-blue-600">
                  {datasets.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Datasets</div>
              </div>
              <div className="text-center py-2">
                <div className="text-3xl text-green-600">
                  {datasets.reduce((sum, ds) => sum + ds.data.length, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Records</div>
              </div>
              <div className="text-center py-2">
                <div className="text-3xl text-purple-600">
                  {datasets.reduce((sum, ds) => sum + ds.analysis.insights.length, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Insights Generated</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Fixed */}
      <footer className="mt-16 py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Powered by advanced data analytics and visualization
          </p>
        </div>
      </footer>
    </div>
  );
}