import { Upload, Database, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { SAMPLE_DATASETS, DatasetKey } from '../utils/SampleDatasets';

interface DataUploadPanelProps {
  onDatasetLoad: (name: string, data: any[], description?: string) => void;
}

export function DataUploadPanel({ onDatasetLoad }: DataUploadPanelProps) {
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        // Try parsing as CSV
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, i) => {
              obj[header] = values[i]?.trim() || '';
            });
            return obj;
          });
          onDatasetLoad(file.name.replace('.csv', ''), data);
        } 
        // Try parsing as JSON
        else if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          onDatasetLoad(file.name.replace('.json', ''), Array.isArray(data) ? data : [data]);
        }
        // For Excel, we would need xlsx library - show message for now
        else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          alert('Excel file detected. For this demo, please convert to CSV or JSON format, or use the sample datasets.');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please ensure it is a valid CSV or JSON file.');
      }
    };
    
    reader.readAsText(file);
  };

  const loadSampleDataset = (key: DatasetKey) => {
    const dataset = SAMPLE_DATASETS[key];
    onDatasetLoad(dataset.name, dataset.data, dataset.description);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your Data
          </CardTitle>
          <CardDescription>
            Upload CSV or JSON files containing your transportation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileSpreadsheet className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span>Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV or JSON files</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Sample Datasets
          </CardTitle>
          <CardDescription>
            Explore pre-loaded transportation and urban planning data
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(SAMPLE_DATASETS) as DatasetKey[]).map((key) => {
            const dataset = SAMPLE_DATASETS[key];
            return (
              <Button
                key={key}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-1"
                onClick={() => loadSampleDataset(key)}
              >
                <span>{dataset.name}</span>
                <span className="text-xs text-gray-500 font-normal">
                  {dataset.description}
                </span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
