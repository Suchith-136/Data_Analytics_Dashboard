import { ArrowRight, BarChart3, TrendingUp, Globe, Zap } from 'lucide-react';
import { Button } from './ui/button';
import trafficImage from 'figma:asset/2a44ba4b2687129053585b2cf86192399f30a82a.png';

interface HomePageProps {
  onEnterDashboard: () => void;
}

export function HomePage({ onEnterDashboard }: HomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={trafficImage} 
          alt="Urban Transportation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white">Urban Analytics</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl text-white mb-6">
                Transportation & Urban Planning
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Data Analytics
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Unlock powerful insights from your transportation data. 
                Visualize traffic patterns, analyze trends, and make data-driven decisions for smarter cities.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <TrendingUp className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                <h3 className="text-white mb-2">Smart Analytics</h3>
                <p className="text-sm text-gray-300">AI-powered insights from your data</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <Globe className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-white mb-2">Multi-Dataset</h3>
                <p className="text-sm text-gray-300">Integrate and correlate multiple sources</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <Zap className="w-8 h-8 text-green-400 mb-3 mx-auto" />
                <h3 className="text-white mb-2">Interactive Viz</h3>
                <p className="text-sm text-gray-300">Dynamic charts with zoom and filters</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg"
                onClick={onEnterDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-400">
                Start analyzing traffic, accidents, public transport, fuel, and ridesharing data
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center">
          <p className="text-sm text-gray-400">
            Powered by advanced data analytics and visualization
          </p>
        </footer>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse delay-1000" />
    </div>
  );
}