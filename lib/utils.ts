import { PriceHistoryItem, Product } from "@/types";

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

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }

    return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }

    return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((total, current) => total + current.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;

    return averagePrice;
}

export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};