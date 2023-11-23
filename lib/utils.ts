export function extractPrice(...elements: any) {
    // Extract the price from the element
    for (const element of elements) {
        // Cheerio element
        const priceText = element.children().first().text();

        // Remove all non-numeric characters
        if (priceText) {
            const cleanPrice = priceText.replace(/[^\d.]/g, '');

            let firstPrice;

            if (cleanPrice) {
                firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
            }

            return firstPrice || cleanPrice;
        }
    }

    return '';
}

export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);
    return currencyText ? currencyText : "";
}