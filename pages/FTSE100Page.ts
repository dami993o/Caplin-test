import { parsePercentage, parseMarketCap } from '../helpers/utils'; 
import { Page } from '@playwright/test';

export class LSEPage {
  constructor(private page: Page) {}

  // Navigate to the FTSE 100 constituents table
  async goto() {
    await this.page.goto('https://www.londonstockexchange.com/indices/ftse-100/constituents/table');
    const rejectButton = this.page.getByRole('button', { name: 'Reject all' });
    await rejectButton.waitFor({ state: 'visible', timeout: 10000 });

    if (await rejectButton.isVisible()) {
      await rejectButton.click();
    }
    await this.page.waitForSelector('table tbody tr');
  }

  // Get top N companies by % change
  async getTopMovers(count: number) {
    const data = await this.page.$$eval('table tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[1]?.textContent?.trim() || '',
          change: cells[6]?.textContent ? parseFloat(cells[6].textContent) : 0 // Will be replaced below
        };
      })
    );

    return data
      .map(item => ({ ...item, change: parsePercentage(item.change.toString()) })) // ✅ Use helper
      .filter(item => !isNaN(item.change))
      .sort((a, b) => b.change - a.change)
      .slice(0, count);
  }

  // Get bottom N companies by % change
  async getBottomMovers(count: number) {
    const data = await this.page.$$eval('table tbody tr', (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[1]?.textContent?.trim() || '',
          change: cells[6]?.textContent ? parseFloat(cells[6].textContent) : 0
        };
      })
    );

    return data
      .map(item => ({ ...item, change: parsePercentage(item.change.toString()) }))
      .filter(item => !isNaN(item.change))
      .sort((a, b) => a.change - b.change)
      .slice(0, count);
  }

  // Get companies with market cap above threshold across 5 pages
  async getCompaniesWithMarketCapOver(minCap: number): Promise<{ name: string; marketCap: number }[]> {
    const results: { name: string; marketCap: number }[] = [];

    for (let i = 1; i <= 5; i++) {
      await this.page.waitForSelector('table tbody tr');

      const pageData = await this.page.$$eval(
        'table tbody tr',
        (rows, minCap) =>
          rows
            .map((row) => {
              const cells = row.querySelectorAll('td');
              const name = cells[1]?.textContent?.trim() || '';
              const capText = cells[3]?.textContent || '0';
              const cap = parseFloat(capText.replace(/[^0-9.]/g, '')); 
              return { name, marketCap: cap };
            })
            .filter((item) => item.marketCap > minCap),
        minCap
      );

      const parsedData = pageData.map(item => ({
        name: item.name,
        marketCap: parseMarketCap(item.marketCap.toString()) 
      }));

      results.push(...parsedData);

      if (i < 5) {
        await this.page.getByRole('link', { name: `${i + 1}`, exact: true }).click();
        await this.page.waitForTimeout(1000);
      }
    }

    return results;
  }

  // Set chart filters to a specific year and monthly view
  async setYearAndPeriodicity(year) {
    const yearInput = this.page.locator('.cnt-year input').first();
    await yearInput.fill(year.toString());
    await yearInput.press('Enter');

    const periodicityButton = this.page.getByRole('button', { name: 'Weekly Periodicity' });
    await periodicityButton.click();
    await this.page.getByRole('menuitem', { name: 'Monthly' }).click();

    try {
      await this.page.locator('[aria-label$="October 2022"]').waitFor({
        state: 'visible',
        timeout: 10000
      });
    } catch (error) {
      throw new Error(`Chart data point not visible after 10 seconds. Year: ${year}. Original error: ${error.message}`);
    }
  }

  // Get chart data points from rendered chart
  async getChartDataPoints() {
    await this.page.waitForTimeout(1000);
    const dataPoints = await this.page.$$('[aria-label^="Price of base"]');
    if (!dataPoints.length) {
      throw new Error('No data points found in chart after waiting');
    }
    return dataPoints;
  }

  // Navigate to FTSE 100 overview page
  async goToOverview() {
    await this.page.goto('https://www.londonstockexchange.com/indices/ftse-100');

    const rejectButton = this.page.getByRole('button', { name: 'Reject all' });
    await rejectButton.waitFor({ state: 'visible', timeout: 10000 });
    await rejectButton.click();
  }
}
