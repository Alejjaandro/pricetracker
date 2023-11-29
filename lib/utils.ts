import { PriceHistoryItem, Product } from "@/types";

export function extractPrice(...elements: any) {
    // Extract the price from the element
    for (const element of elements) {
        // Cheerio element
        const priceText = element.children().first().text();

        // Remove all non-numeric characters except for the decimal point
        if (priceText && priceText !== ' ') {
            // We need to remove all non-numeric characters
            const cleanPrice = priceText.replace(/[^\d]/g, "");

            // We cout the number of characters in the price,
            // so we can add the decimal point in the second last position.
            // We extract the decimals from the price.
            let priceLength = cleanPrice.length;
            let decimals = cleanPrice.slice(priceLength - 2, priceLength);

            // We add a decimal point in the second last position and add the decimals.
            let firstPrice;
            if (cleanPrice) {
                firstPrice = cleanPrice.slice(0, priceLength - 2) + '.' + decimals;
            }
            
            console.log(priceText, cleanPrice, firstPrice);
            
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
    const averagePrice = sumOfPrices / priceList.length;

    return averagePrice;
}

export const formatNumber = (num: number = 0) => {
    return num.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const extractCategory = (element: any) => {

    const category = element.text().trim();
    const cleanCategory = category.replace(/\s\s+/g, ' -> ');

    // console.log(cleanCategory);

    return cleanCategory ? cleanCategory : "Category not found";
}