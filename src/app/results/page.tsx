"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import AllocationPieChart from "@/components/charts/AllocationPieChart";
import ProjectionLineChart from "@/components/charts/ProjectionLineChart";
import StrategyBarChart from "@/components/charts/StrategyBarChart";
import historicalData from "@/lib/data/historical_data.json";

// Types for the investment inputs and results
interface InvestmentInputs {
  totalInvestment: number;
  duration: number;
  falconAllocation: number;
  bsBuyAllocation: number;
  maxDistanceAllocation: number;
  ubsAllocation: number;
}

interface InvestmentResults {
  totalReturn: number;
  totalProfit: number;
  percentageReturn: string;
  avgMonthlyReturn: string;
  avgMonthlyProfit: number;
  riskLevel: string;
  riskDescription: string;
  strategies: Record<string, any>;
  monthlyProjections: Array<{
    month: number;
    value: number;
    profit: number;
  }>;
}

// Static example data for visualization (until API is implemented)
const exampleChartImages = {
  allocationPieChart: "/images/allocation-pie-chart.png",
  monthlyReturnsChart: "/images/monthly-returns-chart.png",
  projectionChart: "/images/projection-chart.png",
};

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<InvestmentResults | null>(null);
  const [inputs, setInputs] = useState<InvestmentInputs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Fetch results from localStorage
      const storedResults = localStorage.getItem("investmentResults");
      const storedInputs = localStorage.getItem("investmentInputs");
      
      if (!storedResults || !storedInputs) {
        // If no results found, redirect to input page
        router.push("/input");
        return;
      }
      
      setResults(JSON.parse(storedResults));
      setInputs(JSON.parse(storedInputs));
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Generate example results until API is implemented
  useEffect(() => {
    if (!results && !loading && inputs) {
      const exampleResults = generateExampleResults(inputs);
      setResults(exampleResults);
    }
  }, [inputs, results, loading]);

  // Handle report export
  const handleExportReport = () => {
    if (!results || !inputs) return;
    
    // Generate CSV content
    const csvContent = generateCSVReport(results, inputs);
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create and click a temporary download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.setAttribute('download', `investment-report-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  if (loading) {
    return <ResultsPageSkeleton />;
  }

  // Prepare allocation data for pie chart
  const allocationData = [
    { strategy: "Falcon", percentage: inputs?.falconAllocation || 0, color: "#E82561" },
    { strategy: "BS Buy Sell", percentage: inputs?.bsBuyAllocation || 0, color: "#C6E7FF" },
    { strategy: "Max Distance + RSI", percentage: inputs?.maxDistanceAllocation || 0, color: "#9B7EBD" },
    { strategy: "UBS WITH ATR", percentage: inputs?.ubsAllocation || 0, color: "#1679AB" },
  ];

  // Prepare strategy data for bar chart with pair contributions
  const strategyData = [
    { 
      name: "Falcon", 
      monthlyReturn: 3.32, 
      projectedProfit: Math.round((inputs?.totalInvestment || 0) * (inputs?.falconAllocation || 0) / 100 * 0.0332 * (inputs?.duration || 12)),
      color: "#E82561",
      pairs: [
        { name: "GBPUSD V1", contribution: 2.6 },
        { name: "GBPUSD V2", contribution: 3.5 },
        { name: "GBPUSD V3", contribution: 4.0 },
        { name: "GBPUSD V4", contribution: 3.3 },
        { name: "GBPUSD V5", contribution: 3.2 }
      ]
    },
    { 
      name: "BS Buy Sell", 
      monthlyReturn: 1.37, 
      projectedProfit: Math.round((inputs?.totalInvestment || 0) * (inputs?.bsBuyAllocation || 0) / 100 * 0.0137 * (inputs?.duration || 12)),
      color: "#C6E7FF",
      pairs: [
        { name: "EURUSD", contribution: 2.0 },
        { name: "NZDCAD", contribution: 1.0 },
        { name: "USDCAD", contribution: 1.1 }
      ]
    },
    { 
      name: "Max Distance + RSI", 
      monthlyReturn: 2.37, 
      projectedProfit: Math.round((inputs?.totalInvestment || 0) * (inputs?.maxDistanceAllocation || 0) / 100 * 0.0237 * (inputs?.duration || 12)),
      color: "#9B7EBD",
      pairs: [
        { name: "AUDUSD", contribution: 1.4 },
        { name: "EURGBP V1", contribution: 1.0 },
        { name: "EURGBP V2", contribution: 1.0 },
        { name: "EURUSD V1", contribution: 1.8 },
        { name: "EURUSD V2", contribution: 4.2 },
        { name: "NZDCAD", contribution: 8.5 },
        { name: "USDCAD", contribution: 1.2 },
        { name: "USDCHF", contribution: 2.0 },
        { name: "USDJPY V1", contribution: 1.3 },
        { name: "USDJPY V2", contribution: 1.3 }
      ]
    },
    { 
      name: "UBS WITH ATR", 
      monthlyReturn: 6.58, 
      projectedProfit: Math.round((inputs?.totalInvestment || 0) * (inputs?.ubsAllocation || 0) / 100 * 0.0658 * (inputs?.duration || 12)),
      color: "#1679AB",
      pairs: [
        { name: "AUDUSD", contribution: 3.9 },
        { name: "EURUSD", contribution: 11.0 },
        { name: "NZDCAD", contribution: 7.5 },
        { name: "USDCAD", contribution: 3.9 }
      ]
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-darkBg text-textPrimary">
      <div className="container px-4 py-16 mx-auto">
        <Link
          href="/input"
          className="inline-flex items-center text-mint hover:text-neutral-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Input
        </Link>
        
        <header className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold font-montserrat text-mint mb-3">Investment Projection Results</h1>
          <p className="text-xl text-textSecondary max-w-3xl">
            Based on your ${inputs?.totalInvestment?.toLocaleString()} investment over {inputs?.duration} months
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <SummaryCard 
            title="Total Return"
            value={`$${results?.totalReturn?.toLocaleString() || '0'}`}
            description={`$${results?.totalProfit?.toLocaleString() || '0'} profit (${results?.percentageReturn || '0'}%)`}
            color="from-mint to-emerald"
            delay={100}
          />
          
          <SummaryCard 
            title="Average Monthly Return"
            value={`${results?.avgMonthlyReturn || '0'}%`}
            description={`$${results?.avgMonthlyProfit?.toLocaleString() || '0'} profit per month`}
            color="from-emerald to-sage"
            delay={200}
          />
          
          <SummaryCard 
            title="Risk Assessment"
            value={results?.riskLevel || 'Moderate'}
            description={results?.riskDescription || 'Balanced portfolio with moderate volatility'}
            color="from-sage to-mint"
            delay={300}
          />
        </div>
        
        <Tabs defaultValue="allocation" className="animate-slide-up">
          <TabsList className="bg-emerald/10 shadow-sm border border-emerald/20 mb-6">
            <TabsTrigger value="allocation" className="text-textPrimary data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Allocation</TabsTrigger>
            <TabsTrigger value="strategies" className="text-textPrimary data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Strategies</TabsTrigger>
            <TabsTrigger value="projections" className="text-textPrimary data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Projections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="mt-0">
            <Card className="bg-emerald/10 border-emerald/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-mint">Strategy Allocation</CardTitle>
                <CardDescription className="text-textSecondary">How your investment is distributed across strategies</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="w-full h-[400px] flex items-center justify-center">
                    <AllocationPieChart allocations={allocationData} />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <ul className="space-y-4">
                    {allocationData.map((strategy) => (
                      <li key={strategy.strategy} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span 
                            className="w-4 h-4 rounded-full mr-3" 
                            style={{ backgroundColor: strategy.color }}
                          />
                          <span className="font-medium text-mint">{strategy.strategy}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-mint font-semibold">{strategy.percentage}%</span>
                          <span className="text-textSecondary ml-2">
                            ${((inputs?.totalInvestment || 0) * (strategy.percentage / 100)).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategies" className="mt-0">
            <Card className="bg-emerald/10 border-emerald/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-mint">Strategy Performance</CardTitle>
                <CardDescription className="text-textSecondary">Monthly returns by strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96">
                  <StrategyBarChart strategies={strategyData} />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strategyData.map((strategy) => (
                    <div 
                      key={strategy.name} 
                      className="bg-neutral-900/40 backdrop-blur-sm rounded-lg p-6 border hover:border-opacity-20 transition-colors"
                      style={{ borderColor: strategy.color }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span 
                            className="w-4 h-4 rounded-full mr-3" 
                            style={{ backgroundColor: strategy.color }}
                          />
                          <h4 className="font-semibold text-xl" style={{ color: strategy.color }}>{strategy.name}</h4>
                        </div>
                        <span className="text-sm px-3 py-1 rounded-full border" 
                          style={{ 
                            backgroundColor: `${strategy.color}10`,
                            borderColor: `${strategy.color}20`,
                            color: strategy.color
                          }}
                        >
                          {strategy.pairs.length} pairs
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 rounded-lg p-4 border" 
                        style={{ 
                          backgroundColor: `${strategy.color}10`,
                          borderColor: `${strategy.color}20`
                        }}
                      >
                        <div>
                          <p className="text-textSecondary text-sm mb-1">Monthly Return</p>
                          <p className="font-semibold text-lg" style={{ color: strategy.color }}>{strategy.monthlyReturn}%</p>
                        </div>
                        <div>
                          <p className="text-textSecondary text-sm mb-1">Projected Profit</p>
                          <p className="font-semibold text-lg" style={{ color: strategy.color }}>${strategy.projectedProfit.toLocaleString()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-textSecondary text-sm mb-3">Currency Pair Contributions</p>
                        <div className="grid grid-cols-1 gap-2">
                          {strategy.pairs?.map((pair) => (
                            <div 
                              key={pair.name} 
                              className="flex items-center justify-between rounded-lg p-3 border"
                              style={{ 
                                backgroundColor: `${strategy.color}10`,
                                borderColor: `${strategy.color}20`
                              }}
                            >
                              <span className="text-textPrimary">{pair.name}</span>
                              <div className="flex items-center">
                                <div className="w-24 h-1.5 rounded-full mr-3" style={{ backgroundColor: `${strategy.color}20` }}>
                                  <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${Math.min(pair.contribution * 10, 100)}%`,
                                      backgroundColor: strategy.color 
                                    }}
                                  />
                                </div>
                                <span style={{ color: strategy.color }}>{pair.contribution.toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projections" className="mt-0">
            <Card className="bg-emerald/10 border-emerald/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-mint">Investment Projection</CardTitle>
                <CardDescription className="text-textSecondary">Monthly growth forecast over {inputs?.duration} months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96">
                  {results?.monthlyProjections && (
                    <ProjectionLineChart 
                      monthlyProjections={results.monthlyProjections} 
                      initialInvestment={inputs?.totalInvestment || 0} 
                    />
                  )}
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-emerald/5 rounded-lg p-4 border border-emerald/20">
                    <p className="text-textSecondary text-sm">Initial Investment</p>
                    <p className="text-mint font-medium text-xl">${inputs?.totalInvestment?.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald/5 rounded-lg p-4 border border-emerald/20">
                    <p className="text-textSecondary text-sm">Final Balance</p>
                    <p className="text-mint font-medium text-xl">${results?.totalReturn?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-emerald/5 rounded-lg p-4 border border-emerald/20">
                    <p className="text-textSecondary text-sm">Total Profit</p>
                    <p className="text-mint font-medium text-xl">${results?.totalProfit?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-emerald/5 rounded-lg p-4 border border-emerald/20">
                    <p className="text-textSecondary text-sm">Growth Rate</p>
                    <p className="text-mint font-medium text-xl">{results?.percentageReturn || '0'}%</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  variant="outline" 
                  className="bg-[#9B7EBD] hover:bg-[#7A5E99] text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center group"
                  onClick={handleExportReport}
                >
                  <Download className="mr-2 h-4 w-4 group-hover:translate-y-[-2px] transition-transform duration-300" />
                  Export Report
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-tr from-[#9B7EBD]/0 to-[#C6E7FF]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

// Function to generate CSV report
function generateCSVReport(results: InvestmentResults, inputs: InvestmentInputs): string {
  const lines = [];
  
  // Add header
  lines.push('Investment Report');
  lines.push('');
  
  // Add summary information
  lines.push('SUMMARY');
  lines.push(`Total Investment,$${inputs.totalInvestment.toLocaleString()}`);
  lines.push(`Investment Duration,${inputs.duration} months`);
  lines.push(`Final Balance,$${results.totalReturn.toLocaleString()}`);
  lines.push(`Total Profit,$${results.totalProfit.toLocaleString()}`);
  lines.push(`Percentage Return,${results.percentageReturn}%`);
  lines.push(`Average Monthly Return,${results.avgMonthlyReturn}%`);
  lines.push(`Average Monthly Profit,$${results.avgMonthlyProfit.toLocaleString()}`);
  lines.push(`Risk Level,${results.riskLevel}`);
  lines.push(`Risk Description,${results.riskDescription}`);
  lines.push('');
  
  // Add allocation information
  lines.push('STRATEGY ALLOCATION');
  lines.push('Strategy,Allocation %,Investment Amount,Number of Pairs');
  lines.push(`Falcon,${inputs.falconAllocation}%,$${(inputs.totalInvestment * (inputs.falconAllocation / 100)).toLocaleString()},5`);
  lines.push(`BS Buy Sell,${inputs.bsBuyAllocation}%,$${(inputs.totalInvestment * (inputs.bsBuyAllocation / 100)).toLocaleString()},3`);
  lines.push(`Max Distance + RSI,${inputs.maxDistanceAllocation}%,$${(inputs.totalInvestment * (inputs.maxDistanceAllocation / 100)).toLocaleString()},10`);
  lines.push(`UBS WITH ATR,${inputs.ubsAllocation}%,$${(inputs.totalInvestment * (inputs.ubsAllocation / 100)).toLocaleString()},4`);
  lines.push('');
  
  // Add monthly projections
  lines.push('MONTHLY PROJECTIONS');
  lines.push('Month,Investment Value,Profit');
  results.monthlyProjections.forEach(projection => {
    lines.push(`${projection.month},$${projection.value.toLocaleString()},$${projection.profit.toLocaleString()}`);
  });
  
  return lines.join('\n');
}

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
  delay?: number;
}

function SummaryCard({ title, value, description, color, delay = 0 }: SummaryCardProps) {
  return (
    <div 
      className={`bg-emerald/10 backdrop-blur-sm rounded-xl overflow-hidden border border-emerald/20 shadow-md animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-6">
        <h3 className="text-textSecondary text-lg mb-3 font-poppins">{title}</h3>
        <p className="text-3xl font-bold text-mint mb-2">{value}</p>
        <p className="text-textSecondary text-sm">{description}</p>
      </div>
    </div>
  );
}

function ResultsPageSkeleton() {
  return (
    <main className="flex min-h-screen flex-col bg-darkBg text-textPrimary">
      <div className="container px-4 py-16 mx-auto">
        <div className="w-32 h-8 mb-8">
          <Skeleton className="h-full w-full bg-emerald/10" />
        </div>
        
        <div className="mb-10">
          <Skeleton className="h-12 w-96 bg-emerald/10 mb-3" />
          <Skeleton className="h-8 w-64 bg-emerald/10" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-emerald/10 rounded-xl overflow-hidden border border-emerald/20 shadow-md">
              <div className="h-2 bg-emerald/20" />
              <div className="p-6">
                <Skeleton className="h-6 w-32 bg-emerald/20 mb-3" />
                <Skeleton className="h-10 w-40 bg-emerald/20 mb-2" />
                <Skeleton className="h-4 w-48 bg-emerald/20" />
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <Skeleton className="h-12 w-64 bg-emerald/10 mb-6" />
          <div className="bg-emerald/10 border border-emerald/20 rounded-lg p-6 shadow-md">
            <Skeleton className="h-8 w-48 bg-emerald/20 mb-3" />
            <Skeleton className="h-6 w-72 bg-emerald/20 mb-6" />
            <Skeleton className="h-96 w-full bg-emerald/20" />
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate example results for demonstration
function generateExampleResults(inputs: InvestmentInputs): InvestmentResults {
  if (!inputs) return null as unknown as InvestmentResults;
  
  const { totalInvestment, duration, falconAllocation, bsBuyAllocation, maxDistanceAllocation, ubsAllocation } = inputs;
  
  // Calculate weighted average return based on the user provided data
  const strategyMonthlyReturns = {
    falcon: 3.32, // Average of 5 GBPUSD pairs
    bsBuySell: 1.37, // Average of 3 pairs
    maxDistance: 2.37, // Average of 10 pairs
    ubs: 6.58 // Average of 4 pairs
  };
  
  // Calculate weighted average return
  const weightedAvgReturn = (
    (falconAllocation * strategyMonthlyReturns.falcon) +
    (bsBuyAllocation * strategyMonthlyReturns.bsBuySell) +
    (maxDistanceAllocation * strategyMonthlyReturns.maxDistance) +
    (ubsAllocation * strategyMonthlyReturns.ubs)
  ) / 100;
  
  // Calculate total growth
  const totalGrowth = Math.pow(1 + (weightedAvgReturn / 100), duration);
  const totalReturn = totalInvestment * totalGrowth;
  const totalProfit = totalReturn - totalInvestment;
  const percentageReturn = ((totalReturn / totalInvestment) - 1) * 100;
  
  // Generate monthly projections with the real calculated rate (not hardcoded)
  const monthlyProjections = [];
  for (let month = 0; month <= duration; month++) {
    const projectedValue = totalInvestment * Math.pow(1 + (weightedAvgReturn / 100), month);
    monthlyProjections.push({
      month,
      value: Math.round(projectedValue),
      profit: Math.round(projectedValue - totalInvestment)
    });
  }
  
  // Determine risk level based on allocation
  let riskLevel: string, riskDescription: string;
  const highRiskAllocation = bsBuyAllocation + maxDistanceAllocation;
  
  if (highRiskAllocation > 70) {
    riskLevel = "High";
    riskDescription = "Aggressive portfolio with higher volatility";
  } else if (highRiskAllocation > 40) {
    riskLevel = "Moderate";
    riskDescription = "Balanced portfolio with moderate volatility";
  } else {
    riskLevel = "Low";
    riskDescription = "Conservative portfolio with lower volatility";
  }
  
  return {
    totalReturn: Math.round(totalReturn),
    totalProfit: Math.round(totalProfit),
    percentageReturn: percentageReturn.toFixed(2),
    avgMonthlyReturn: weightedAvgReturn.toFixed(2), // Use the actual calculated weighted average
    avgMonthlyProfit: Math.round(totalProfit / duration),
    riskLevel,
    riskDescription,
    strategies: {
      'Falcon': {
        allocation: falconAllocation / 100,
        investment: totalInvestment * (falconAllocation / 100),
        returnRate: strategyMonthlyReturns.falcon,
        pairCount: 5,
        pairs: [
          { name: "GBPUSD V1", contribution: 2.6 },
          { name: "GBPUSD V2", contribution: 3.5 },
          { name: "GBPUSD V3", contribution: 4.0 },
          { name: "GBPUSD V4", contribution: 3.3 },
          { name: "GBPUSD V5", contribution: 3.2 }
        ]
      },
      'BS Buy Sell': {
        allocation: bsBuyAllocation / 100,
        investment: totalInvestment * (bsBuyAllocation / 100),
        returnRate: strategyMonthlyReturns.bsBuySell,
        pairCount: 3,
        pairs: [
          { name: "EURUSD", contribution: 2.0 },
          { name: "NZDCAD", contribution: 1.0 },
          { name: "USDCAD", contribution: 1.1 }
        ]
      },
      'Max Distance + RSI': {
        allocation: maxDistanceAllocation / 100,
        investment: totalInvestment * (maxDistanceAllocation / 100),
        returnRate: strategyMonthlyReturns.maxDistance,
        pairCount: 10,
        pairs: [
          { name: "AUDUSD", contribution: 1.4 },
          { name: "EURGBP V1", contribution: 1.0 },
          { name: "EURGBP V2", contribution: 1.0 },
          { name: "EURUSD V1", contribution: 1.8 },
          { name: "EURUSD V2", contribution: 4.2 },
          { name: "NZDCAD", contribution: 8.5 },
          { name: "USDCAD", contribution: 1.2 },
          { name: "USDCHF", contribution: 2.0 },
          { name: "USDJPY V1", contribution: 1.3 },
          { name: "USDJPY V2", contribution: 1.3 }
        ]
      },
      'UBS WITH ATR': {
        allocation: ubsAllocation / 100,
        investment: totalInvestment * (ubsAllocation / 100),
        returnRate: strategyMonthlyReturns.ubs,
        pairCount: 4,
        pairs: [
          { name: "AUDUSD", contribution: 3.9 },
          { name: "EURUSD", contribution: 11.0 },
          { name: "NZDCAD", contribution: 7.5 },
          { name: "USDCAD", contribution: 3.9 }
        ]
      }
    },
    monthlyProjections,
  };
} 