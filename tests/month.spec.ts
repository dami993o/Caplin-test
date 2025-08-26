import { test, expect } from '@playwright/test';
import { LSEPage, } from '../pages/FTSE100Page';
const fs = require('fs');


test('should find the month with lowest FTSE 100 index value average (last 3 years)', async ({ page }) => {
  test.slow();

  const ftsePage = new LSEPage(page); 
  await ftsePage.goToOverview();
  await ftsePage.setYearAndPeriodicity(2022);

  const dataPoints = await ftsePage.getChartDataPoints();
  console.log(`Found ${dataPoints.length} data points in the chart.`);

  // Extract index values grouped by month-year
  const monthlyData = {};

  for (const point of dataPoints) {
    const ariaLabel = await point.getAttribute('aria-label');
    const match = ariaLabel?.match(/Price of base ric is ([\d,.]+) (\d{1,2}) (\w+) (\d{4})/);

    if (match) {
      const [, valueStr, , month, year] = match;
      const value = parseFloat(valueStr.replace(/,/g, ''));
      const key = `${month} ${year}`;
      monthlyData[key] = monthlyData[key] || [];
      monthlyData[key].push(value);
    }
  }
  console.log(monthlyData)
  expect(Object.keys(monthlyData).length).toBeGreaterThan(0);

  // Calculate monthly averages and sort
  const monthlyAverages = Object.entries(monthlyData).map(([monthYear, values]) => {
  const numericValues = values as number[];
  return {
    monthYear,
    average: numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length,
    dataPoints: numericValues.length
  };
});


  // Log lowest 3 months
  console.log('\nMonthly FTSE 100 Analysis:');
  console.log('--------------------------');
  console.log(`Total months analyzed: ${monthlyAverages.length}`);
  console.log('\nLowest 3 months by average:');
  console.table(
    monthlyAverages.slice(0, 3).map(({ monthYear, average }) => ({
      'Month-Year': monthYear,
      'Average Index': average.toFixed(2)
    }))
  );

  // Final assertions on the lowest month
  const lowest = monthlyAverages[0];
  expect(lowest).toBeDefined();
  expect(lowest.average).toBeGreaterThan(0);
  expect(lowest.dataPoints).toBeGreaterThan(0);
  
});
