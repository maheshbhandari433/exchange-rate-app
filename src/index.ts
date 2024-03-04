interface Data {
    conversion_rates: Record<string, number>;
  }
  
  class FetchWrapper {
    baseURL: string;
  
    constructor(baseURL: string) {
      this.baseURL = baseURL;
    }
  
    get(endpoint: string): Promise<Data> {
      return fetch(this.baseURL + endpoint).then((response) => response.json());
    }
  
    put(endpoint: string, body: any): Promise<any> {
      return this._send('put', endpoint, body);
    }
  
    post(endpoint: string, body: any): Promise<any> {
      return this._send('post', endpoint, body);
    }
  
    delete(endpoint: string, body: any): Promise<any> {
      return this._send('delete', endpoint, body);
    }
  
    _send(method: string, endpoint: string, body: any): Promise<any> {
      return fetch(this.baseURL + endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    }
  }

// Global variables referencing HTML elements
const baseAmountInput = document.getElementById('base-amount') as HTMLInputElement;
const targetCurrencySelect = document.getElementById('target-currency') as HTMLSelectElement;
const baseCurrencySelect = document.getElementById('base-currency') as HTMLSelectElement;
const baseCurrencyLabel = document.getElementById('base-currency-label') as HTMLParagraphElement;
const targetCurrencyLabel = document.getElementById('target-currency-label') as HTMLParagraphElement;

// Instance of FetchWrapper class
const fetchWrapper = new FetchWrapper('https://v6.exchangerate-api.com/v6/'); // base URL of the API

// API key for authentication
const API_KEY = 'c449848c81c14b2d88aba03c';

// Function to get conversion rates and update UI
async function getConversionRate(baseAmount: number, baseCurrency: string, targetCurrency: string) {
  try {
    const response = await fetchWrapper.get(`${API_KEY}/latest/${baseCurrency}`);
    const rates = response.conversion_rates;

    // Find the conversion rate for the target currency
    const conversionRate = rates[targetCurrency];

    // Calculate the converted amount
    const convertedAmount = baseAmount * conversionRate;

    // Update the target currency label with the converted amount
    targetCurrencyLabel.textContent = convertedAmount.toFixed(2).toString() + ' ' + targetCurrency;
  } catch (error) {
    console.error('Error fetching conversion rates:', error);
  }
}

// Event listener for base amount input field
baseAmountInput.addEventListener('input', () => {
  const baseAmount = parseFloat(baseAmountInput.value);
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  getConversionRate(baseAmount, baseCurrency, targetCurrency);
});

// Event listener for base currency selection
baseCurrencySelect.addEventListener('change', () => {
    const baseAmount = parseFloat(baseAmountInput.value);
    const baseCurrency = baseCurrencySelect.value;
    baseCurrencyLabel.textContent = baseCurrency;
    const targetCurrency = targetCurrencySelect.value;
    getConversionRate(baseAmount, baseCurrency, targetCurrency);
  });
  
// Event listener for target currency selection
targetCurrencySelect.addEventListener('change', () => {
    const baseAmount = parseFloat(baseAmountInput.value);
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    getConversionRate(baseAmount, baseCurrency, targetCurrency);
  });

// Initial call to get conversion rate with default values
getConversionRate(0, 'USD', targetCurrencySelect.value);
