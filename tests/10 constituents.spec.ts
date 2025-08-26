import { test, expect } from '@playwright/test';
import { LSEPage, } from '../pages/FTSE100Page';

test('FTSE 100 - Top 10 movers by % change', async ({ page }) => {
  const ftsePage = new LSEPage(page);
  await ftsePage.goto();

  const top10 = await ftsePage.getTopMovers(10);

    // Assertions 
  expect(top10.length).toBeGreaterThan(0);
  top10.forEach(item => {
    expect(item.change).not.toBeNull();
    expect(typeof item.change).toBe('number');
  });
  
//  Output
  console.log('Top 10 biggest % changes:');
  console.table(top10);
});
 

test('FTSE 100 - Bottom 10 movers by % change', async ({ page }) => {
  const ftsePage = new LSEPage(page);
  await ftsePage.goto();

  const bottom10 = await ftsePage.getBottomMovers(10);

  // Assertions 
  expect(bottom10.length).toBeGreaterThan(0);
  bottom10.forEach(item => {
    expect(item.change).not.toBeNull();
    expect(typeof item.change).toBe('number');
  });

  //  Output
  console.log('Top 10 lowest % changes:');
  console.table(bottom10);
});

