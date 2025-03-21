// components/borrow/RateCharts.tsx
import React, { useEffect, useRef } from 'react';
import { RateDataPoint } from '@/types/borrow';
import * as Highcharts from 'highcharts';

interface RateChartsProps {
  leverageValue: number;
  showLeverage: boolean;
  borrowAPR: number;
}

const RateCharts: React.FC<RateChartsProps> = ({ 
  leverageValue, 
  showLeverage,
  borrowAPR
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Generate mock data for historical rates
  const generateMockRateData = (): RateDataPoint[] => {
    const dates = ['Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20'];
    // Create slight variations around the current rate
    const baseRate = borrowAPR;
    
    return dates.map((date, index) => ({
      date,
      // Last point is current rate, others are historical with variations
      rate: index === dates.length - 1 
        ? baseRate 
        : baseRate * (0.95 + Math.random() * 0.1)
    }));
  };
  
  // Generate data once to maintain consistency
  const borrowRateData = useRef<RateDataPoint[]>(generateMockRateData()).current;
  
  // Generate leveraged data based on the borrow data
  const leverageRateData = borrowRateData.map(item => ({
    date: item.date,
    rate: item.rate * leverageValue
  }));
  
  // Create chart
  useEffect(() => {
    if (!chartRef.current) return;
    
    const borrowData = borrowRateData.map(item => item.rate);
    const leverageData = leverageRateData.map(item => item.rate);
    const categories = borrowRateData.map(item => item.date);
    
    // Setup series with proper types
    const borrowSeries: Highcharts.SeriesAreaOptions = {
      type: 'area',
      name: 'Borrow APR',
      data: borrowData,
      color: '#47A6E5',
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, 'rgba(71, 166, 229, 0.3)'],
          [1, 'rgba(71, 166, 229, 0)']
        ]
      },
      lineWidth: 2,
      lineColor: '#47A6E5',
      zIndex: 1
    };
    
    // Build the series array with proper typing
    const series: Array<Highcharts.SeriesOptionsType> = [borrowSeries];
    
    // Add leverage series if applicable
    if (showLeverage) {
      const leverageSeries: Highcharts.SeriesAreaOptions = {
        type: 'area',
        name: 'Leveraged APR',
        data: leverageData,
        color: '#F59E0B',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(245, 158, 11, 0.2)'],
            [1, 'rgba(245, 158, 11, 0)']
          ]
        },
        lineWidth: 2,
        lineColor: '#F59E0B',
        zIndex: 0
      };
      
      series.push(leverageSeries);
    }
    
    // Create options with proper typing
    const options: Highcharts.Options = {
      chart: {
        type: 'area',
        backgroundColor: '#0c1624',
        height: 160,
        style: {
          fontFamily: 'Inter, Arial, sans-serif'
        }
      },
      title: {
        text: undefined
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            color: '#9ca3af',
            fontSize: '10px'
          }
        },
        lineColor: '#1e2c3b',
        tickColor: '#1e2c3b',
        tickLength: 3
      },
      yAxis: {
        title: {
          text: undefined
        },
        labels: {
          style: {
            color: '#9ca3af',
            fontSize: '10px'
          },
          formatter: function() {
            return Highcharts.numberFormat(Number(this.value), 2) + '%';
          }
        },
        gridLineColor: '#1e2c3b'
      },
      legend: {
        enabled: showLeverage,
        itemStyle: {
          color: '#9ca3af'
        },
        itemHoverStyle: {
          color: '#ffffff'
        }
      },
      tooltip: {
        backgroundColor: '#0a1525',
        borderColor: '#1e2c3b',
        borderRadius: 8,
        style: {
          color: '#ffffff'
        },
        formatter: function() {
          return `<b>${this.x}</b>: ${Highcharts.numberFormat(this.y ?? 0, 2)}%`;
        }
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 3,
            states: {
              hover: {
                enabled: true
              }
            }
          },
          states: {
            hover: {
              lineWidth: 2
            }
          }
        }
      },
      series: series,
      credits: {
        enabled: false
      }
    };
    
    // Initialize chart using the correct string+options overload
    const chart = Highcharts.chart(chartRef.current, options);
    
    // Return a cleanup function
    return () => {
      chart.destroy();
    };
  }, [leverageValue, borrowRateData, borrowAPR, showLeverage, leverageRateData]);
  
  return (
    <div className="mx-6 mb-4">      
      {/* Chart container */}
      <div className="bg-[#0c1624] border border-[#1e2c3b] rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-white">
            Historical APR
          </div>
          <div className="flex items-center gap-3">
            {showLeverage && (
              <div className="text-xl font-bold text-[#F59E0B]">
                {(borrowAPR * leverageValue).toFixed(2)}%
                <span className="text-xs text-gray-400 ml-1">w/ Leverage</span>
              </div>
            )}
            <div className="text-xl font-bold text-[#47A6E5]">
              {borrowAPR.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div ref={chartRef} className="w-full" />
      </div>
    </div>
  );
};

export default RateCharts;