import Link from 'next/link';
import { ArrowRight, BarChart2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-darkBg text-textPrimary p-6">
      <div className="container max-w-6xl">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-4 bg-gradient-to-r from-mint via-emerald to-sage text-transparent bg-clip-text">
            BOTMUDRA Profit Calculator
          </h1>
          <p className="text-xl md:text-2xl text-textSecondary max-w-2xl mx-auto">
            Optimize your forex trading strategy with our advanced profit projection tool
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-slide-up">
          <StrategyCard 
            name="Falcon"
            color="#E82561"
            description="Conservative strategy with 5 GBPUSD pairs"
            monthlyReturn="3.32%"
            pairCount={5}
          />
          <StrategyCard 
            name="BS Buy Sell"
            color="#C6E7FF"
            description="Balanced strategy with 3 currency pairs"
            monthlyReturn="1.37%"
            pairCount={3}
          />
          <StrategyCard 
            name="Max Distance + RSI"
            color="#9B7EBD"
            description="Aggressive strategy with 10 diverse currency pairs"
            monthlyReturn="2.37%"
            pairCount={10}
          />
          <StrategyCard 
            name="UBS WITH ATR"
            color="#1679AB"
            description="High return strategy with 4 carefully selected pairs"
            monthlyReturn="6.58%"
            pairCount={4}
          />
        </div>
        
        <div className="flex justify-center animate-slide-up" style={{ animationDelay: "400ms" }}>
          <Link 
            href="/input"
            className="group bg-[#1679AB] hover:bg-[#0F5A7A] text-white font-medium py-4 px-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            Start Simulation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function StrategyCard({ name, color, description, monthlyReturn, pairCount }: { name: string; color: string; description: string; monthlyReturn: string; pairCount: number }) {
  // Calculate a visual percentage for the progress bar, capped at 100%
  const percentForVisual = Math.min(parseFloat(monthlyReturn) * 10, 100);
  
  return (
    <div className="bg-emerald/10 rounded-xl border border-emerald/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
      <div className="h-3" style={{ backgroundColor: color }} />
      <div className="p-6 flex flex-col h-[calc(100%-12px)]">
        <div className="flex items-center mb-4">
          <span 
            className="inline-block w-4 h-4 rounded-full mr-3" 
            style={{ backgroundColor: color }}
          />
          <h4 className="text-2xl font-semibold" style={{ color }}>{name}</h4>
        </div>
        
        <p className="text-base text-textSecondary mb-6 flex-grow">{description}</p>
        
        <div className="rounded-lg p-4 mb-4 border" style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-textSecondary font-medium">Avg. Monthly Return</span>
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" style={{ color }} />
              <span className="text-xl font-bold" style={{ color }}>{monthlyReturn}</span>
            </div>
          </div>
          <div className="w-full bg-emerald/5 rounded-full h-2 mb-1">
            <div 
              className="h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ 
                backgroundColor: color, 
                width: `${percentForVisual}%` 
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center text-base text-textSecondary justify-between mt-auto pt-2 border-t" style={{ borderColor: `${color}20` }}>
          <div className="flex items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: color }}
            />
            <span className="font-medium">{pairCount} currency pairs</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: `${color}20` }}>FOREX</span>
        </div>
      </div>
    </div>
  );
}
