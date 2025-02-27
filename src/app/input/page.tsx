"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { 
  ArrowLeft, 
  HelpCircle, 
  ArrowRight, 
  DollarSign, 
  Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Form schema definition
const formSchema = z.object({
  totalInvestment: z
    .number()
    .min(1000, {
      message: "Minimum investment of $1,000 required",
    })
    .max(10000000, {
      message: "Maximum investment of $10,000,000",
    }),
  duration: z
    .number()
    .min(3, {
      message: "Minimum duration of 3 months required",
    })
    .max(60, {
      message: "Maximum duration of 60 months (5 years)",
    }),
  falconAllocation: z.number(),
  bsBuyAllocation: z.number(),
  maxDistanceAllocation: z.number(),
  ubsAllocation: z.number(),
});

// Define the strategy data
const strategies = [
  {
    id: "falconAllocation",
    name: "Falcon",
    description: "Conservative strategy with 5 GBPUSD pairs",
    color: "#CCE3DE",
    avgReturn: "3.32%"
  },
  {
    id: "bsBuyAllocation",
    name: "BS Buy Sell",
    description: "Balanced strategy with 3 currency pairs",
    color: "#261C15",
    avgReturn: "1.37%"
  },
  {
    id: "maxDistanceAllocation",
    name: "Max Distance + RSI",
    description: "Aggressive strategy with 10 diverse currency pairs",
    color: "#363636",
    avgReturn: "2.37%"
  },
  {
    id: "ubsAllocation",
    name: "UBS WITH ATR",
    description: "High return strategy with 4 carefully selected pairs",
    color: "#0B2027",
    avgReturn: "6.58%"
  },
];

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalInvestment: 25000,
      duration: 12,
      falconAllocation: 25,
      bsBuyAllocation: 25,
      maxDistanceAllocation: 25,
      ubsAllocation: 25,
    },
  });

  // Calculate total allocation
  const totalAllocation =
    form.watch("falconAllocation") +
    form.watch("bsBuyAllocation") +
    form.watch("maxDistanceAllocation") +
    form.watch("ubsAllocation");

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log("Form submitted with values:", values);
      
      // Save values to localStorage for retrieval on results page
      localStorage.setItem("investmentInputs", JSON.stringify(values));
      console.log("Saved inputs to localStorage");
      
      // Generate example results based on user inputs
      const exampleResults = generateExampleResults(values);
      localStorage.setItem("investmentResults", JSON.stringify(exampleResults));
      console.log("Saved results to localStorage");
      
      // Use router.push with { forceHard: true } to force a hard navigation
      router.push("/results");
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  // Add this function to generate example results
  function generateExampleResults(inputs: z.infer<typeof formSchema>): any {
    if (!inputs) return null;
    
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
    
    // Generate monthly projections with the real calculated rate
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
      avgMonthlyReturn: weightedAvgReturn.toFixed(2),
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

  return (
    <main className="flex min-h-screen flex-col bg-darkBg text-textPrimary">
      <div className="container px-4 py-16 mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-mint hover:text-neutral-300 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <header className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold font-montserrat bg-gradient-to-r from-mint via-emerald to-sage bg-clip-text text-transparent mb-3">
            Investment Parameters
          </h1>
          <p className="text-xl text-textSecondary">
            Configure your investment details and strategy allocation
          </p>
        </header>
        
        <div className="bg-emerald/10 rounded-xl border border-emerald/20 shadow-md p-6 animate-slide-up">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Total Investment */}
              <FormField
                control={form.control}
                name="totalInvestment"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-lg font-medium text-mint">Total Investment</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-textSecondary hover:text-mint"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-sage text-textPrimary border-emerald">
                            <p>Minimum investment of $1,000 required</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-textSecondary" />
                        <Input
                          type="number"
                          className="pl-10 bg-emerald/5 border-emerald/20 text-textPrimary focus-visible:ring-mint"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-textSecondary">
                      Enter the total amount you wish to invest
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-mint">Investment Duration (Months)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-textSecondary" />
                        <Input
                          type="number"
                          className="pl-10 bg-emerald/5 border-emerald/20 text-textPrimary focus-visible:ring-mint"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-textSecondary">
                      Enter the duration of your investment in months
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Strategy Allocation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-mint mb-1">Strategy Allocation</h3>
                  <p className="text-textSecondary text-sm mb-4">
                    Allocate your investment across different strategies (total must be 100%)
                  </p>
                </div>

                <div className="space-y-8">
                  {strategies.map((strategy) => (
                    <FormField
                      key={strategy.id}
                      control={form.control}
                      name={strategy.id as any}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: strategy.color }}
                              />
                              <FormLabel className="text-base font-medium text-mint">
                                {strategy.name}
                              </FormLabel>
                            </div>
                            <div className="flex items-center">
                              <span className="text-mint font-semibold mr-3">
                                {field.value}%
                              </span>
                              <span className="text-xs text-textSecondary">
                                Avg: {strategy.avgReturn}
                              </span>
                            </div>
                          </div>
                          <FormControl>
                            <Slider
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => {
                                field.onChange(vals[0]);
                              }}
                              className="py-2"
                            />
                          </FormControl>
                          <FormDescription className="text-textSecondary text-sm">
                            {strategy.description}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between py-2 px-4 bg-emerald/10 rounded-lg border border-emerald/20">
                  <span className="font-medium text-mint">Total Allocation</span>
                  <span
                    className={`font-semibold ${
                      totalAllocation === 100
                        ? "text-mint"
                        : "text-red-500"
                    }`}
                  >
                    {totalAllocation}%
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E82561] hover:bg-[#C01A4A] text-white font-medium py-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center relative overflow-hidden"
                disabled={loading || totalAllocation !== 100}
              >
                <span className="relative z-10 flex items-center">
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="mr-2 h-5 w-5 animate-pulse" />
                  )}
                  {loading ? "Processing..." : "Generate Projection"}
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#E82561] to-[#C01A4A] opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
} 