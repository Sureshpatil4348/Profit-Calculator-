import { NextRequest, NextResponse } from 'next/server';
import historicalData from '@/lib/data/historical_data.json';

// Types for the historical data structure
interface CurrencyPair {
  avg_monthly_return: number;
  allocation_ratio: number;
}

interface Strategy {
  description: string;
  pairs: Record<string, CurrencyPair>;
}

interface HistoricalData {
  strategies: Record<string, Strategy>;
}

// Types for the strategy calculation
interface PairCalculation {
  allocation: number;
  investment: number;
  monthlyReturn: number;
  projectedReturn: number;
}

interface StrategyCalculation {
  allocation: number;
  investment: number;
  pairs: Record<string, PairCalculation>;
  returnRate: number;
  projectedReturn: number;
}

export async function POST(request: NextRequest) {
  try {
    // Get input data from request
    const body = await request.json();
    const { totalInvestment, duration, falconAllocation, bsBuyAllocation, maxDistanceAllocation, ubsAllocation } = body;

    // Validate inputs
    if (!totalInvestment || totalInvestment < 100000) {
      return NextResponse.json({ message: 'Total investment must be at least $100,000' }, { status: 400 });
    }

    if (!duration || duration < 1 || duration > 60) {
      return NextResponse.json({ message: 'Duration must be between 1 and 60 months' }, { status: 400 });
    }

    const sum = falconAllocation + bsBuyAllocation + maxDistanceAllocation + ubsAllocation;
    if (sum !== 100) {
      return NextResponse.json({ message: 'Strategy allocations must sum to 100%' }, { status: 400 });
    }

    // Calculate strategy allocations
    const strategies: Record<string, StrategyCalculation> = {
      'Falcon': {
        allocation: falconAllocation / 100,
        investment: totalInvestment * (falconAllocation / 100),
        pairs: {},
        returnRate: 0,
        projectedReturn: 0
      },
      'BS Buy Sell': {
        allocation: bsBuyAllocation / 100,
        investment: totalInvestment * (bsBuyAllocation / 100),
        pairs: {},
        returnRate: 0,
        projectedReturn: 0
      },
      'Max Distance + RSI': {
        allocation: maxDistanceAllocation / 100,
        investment: totalInvestment * (maxDistanceAllocation / 100),
        pairs: {},
        returnRate: 0,
        projectedReturn: 0
      },
      'UBS WITH ATR': {
        allocation: ubsAllocation / 100,
        investment: totalInvestment * (ubsAllocation / 100),
        pairs: {},
        returnRate: 0,
        projectedReturn: 0
      }
    };

    // Calculate allocation for each currency pair in each strategy
    const typedHistoricalData = historicalData as unknown as HistoricalData;
    
    for (const [strategyName, strategy] of Object.entries(strategies)) {
      if (strategy.allocation === 0) continue;

      const strategyData = typedHistoricalData.strategies[strategyName];
      if (!strategyData) continue;

      // Calculate weighted average monthly return for the strategy
      let totalAllocationRatio = 0;
      let weightedReturnRate = 0;

      for (const [pairName, pairData] of Object.entries(strategyData.pairs)) {
        const allocationRatio = pairData.allocation_ratio;
        const pairInvestment = strategy.investment * allocationRatio;
        const monthlyReturn = pairData.avg_monthly_return;

        // Store pair data
        strategy.pairs[pairName] = {
          allocation: allocationRatio,
          investment: pairInvestment,
          monthlyReturn: monthlyReturn,
          projectedReturn: pairInvestment * Math.pow(1 + (monthlyReturn / 100), duration)
        };

        totalAllocationRatio += allocationRatio;
        weightedReturnRate += monthlyReturn * allocationRatio;
      }

      // Calculate average monthly return for the strategy
      strategy.returnRate = weightedReturnRate / totalAllocationRatio;
      
      // Calculate projected return for the strategy
      strategy.projectedReturn = strategy.investment * Math.pow(1 + (strategy.returnRate / 100), duration);
    }

    // Calculate overall weighted average return rate
    const totalWeightedReturn = 
      (strategies['Falcon'].returnRate * strategies['Falcon'].allocation) +
      (strategies['BS Buy Sell'].returnRate * strategies['BS Buy Sell'].allocation) +
      (strategies['Max Distance + RSI'].returnRate * strategies['Max Distance + RSI'].allocation) +
      (strategies['UBS WITH ATR'].returnRate * strategies['UBS WITH ATR'].allocation);

    // Calculate final projection
    const totalReturn = totalInvestment * Math.pow(1 + (totalWeightedReturn / 100), duration);
    const totalProfit = totalReturn - totalInvestment;
    const percentageReturn = ((totalReturn / totalInvestment) - 1) * 100;

    // Determine risk level based on allocation
    const highRiskAllocation = bsBuyAllocation + maxDistanceAllocation;
    let riskLevel: string, riskDescription: string;
    
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

    // Prepare monthly projections
    const monthlyProjections = [];
    for (let month = 0; month <= duration; month++) {
      const projectedValue = totalInvestment * Math.pow(1 + (totalWeightedReturn / 100), month);
      monthlyProjections.push({
        month,
        value: Math.round(projectedValue),
        profit: Math.round(projectedValue - totalInvestment)
      });
    }

    // Prepare response
    const results = {
      totalReturn: Math.round(totalReturn),
      totalProfit: Math.round(totalProfit),
      percentageReturn: percentageReturn.toFixed(2),
      avgMonthlyReturn: totalWeightedReturn.toFixed(2),
      avgMonthlyProfit: Math.round((totalProfit / duration)),
      riskLevel,
      riskDescription,
      strategies,
      monthlyProjections,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error calculating investment projections:', error);
    return NextResponse.json({ message: 'Failed to calculate investment projections' }, { status: 500 });
  }
} 