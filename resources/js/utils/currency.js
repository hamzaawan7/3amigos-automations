// Currency formatting utility

const currencySymbols = {
    'PKR': 'Rs',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
};

/**
 * Format currency with proper symbol
 * @param {string} currency - Currency code (PKR, USD, etc.)
 * @param {number|string} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (currency, amount) => {
    const symbol = currencySymbols[currency] || currency;
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Format with thousand separators
    const formattedAmount = numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return `${symbol} ${formattedAmount}`;
};

/**
 * Get currency symbol only
 * @param {string} currency - Currency code
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (currency) => {
    return currencySymbols[currency] || currency;
};

