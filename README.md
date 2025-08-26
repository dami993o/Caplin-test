# FTSE 100 Market Analysis Tests
Automated tests for analyzing FTSE 100 market data using Playwright.



## 📊 Features

- Top 10 FTSE 100 constituents by highest and lowest percentage change
- Extract constituents where Market Cap > 7 million
- Lowest average index value** month in last 3 years

## 🛠 Tech Stack

- Node.js
- Playwright
- JavaScript
- TypeScript


## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dami993o/Caplin-test.git

```

2. Install dependencies:
```bash
npm install
npx playwright install
```

3. Set up environment variables (.env):
```bash
cp env.example for reference
```

## 📝 Running Tests

Run all tests:
```bash
npm test 
or
npm run test 
```

Run specific test:
```bash
npx playwright test MarketCap.spec.js 
```


```

Run tests on Specific Browser:
```bash
npx playwright test --project=webkit  #chromium/firefox/webkit => Make sure projects are enabled in playwright.config.js before using them
```

## 🧪 Test Suites

### Top 10 Constituents
- Extract Top 10 constituents by Highest - Lowest percentage change
- Extract Top 10 constituents by Lowest - Highest percentage change
- Automating sorting and data validation

### Market Cap Analysis
- Extract companies with market cap > £7 million
- Sort by market cap (highest to lowest)
- Data collection across multiple pages

### Monthly Index Values
- Tracks FTSE 100 index values over time
- Calculates monthly averages
- Identifies lowest performing month in last 3 years


## Project Structure

```
Caplin-Test/
├── tests/                              # Test specifications
│   ├── marketCap.spec.ts               # Market cap analysis tests
│   ├── month.spec.ts                   # Monthly index tests
│   └── 10Constituents.spec.ts          # Performance tracking tests
├── pages/                              # Page Object Models
│   └── FTSE100Page.ts                  # FTSE 100 page interactions
├── helpers/                            # Utility functions
│   ├── utils.ts                        # Parsing utilities
├── config/                             # Configuration files
│   └── playwright.config.ts            # Playwright configuration
├── package.json                        # Project dependencies
├── env.example (.env)                  # Environment variables
└── README.md                           # Project documentation
```




## 🔔 Known Limitations & Observations

1. **Chart Loading Timeout**
   - The monthly Average chart needs longer time to load
   - Root cause: External dependency on chart rendering component
   - Current implementation:
     - 10-second timeout with explicit error messaging
     - Error handling with specific failure messages

2. **Potential Improvements**
   - Consider implementing:
     - longer timeout for the initial chart load
     - Add more Error Handling 

3. **Test Reliability**
   - High reliability with different timing variations
   
