import { test, expect } from '@playwright/test';
import { LSEPage } from '../pages/FTSE100Page';


test('FTSE 100 - Companies with Market Cap > 7m', async ({ page }) => {
  const ftsePage = new LSEPage(page);
  await ftsePage.goto();

  const results = await ftsePage.getCompaniesWithMarketCapOver(7);

  //  assertions 
  expect(results.length).toBeGreaterThan(0);
  results.forEach(item => {
    expect(item.marketCap).toBeGreaterThan(7);
    expect(typeof item.name).toBe('string');
    expect(typeof item.marketCap).toBe('number');
  });

  //  Output
  console.log('\nFTSE 100 companies with Market Cap > 7 million:\n');
  console.table(results.map(item => ({
    name: item.name,
    marketCap: item.marketCap
  })));
});
