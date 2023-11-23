import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from '../utils';

export async function scrapeAmazonProduct(productURL: string) {
    
    if(!productURL) return;

    // BrightData proxy config
    const username = String(process.env.BRIGHTDATA_USERNAME);
    const password = String(process.env.BRIGHTDATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password
        },
        host: 'brd.superproxy.io',
        port: port,
        rejectUnauthorized: false
    }

    try {
        const response = await axios.get(productURL, options);
        // console.log(response.data);
        const $ = cheerio.load(response.data);

        // Extract the data we want. We can find the selector using the browser dev tools.
        const title = $('#productTitle').text().trim();

        const currentPrice = extractPrice(
            $('span.a-price')
        );

        const originalPrice = extractPrice(
            $('div.a-section.a-spacing-small.aok-align-center span.a-price.a-text-price'),
            $('td.a-span12.a-color-secondary.a-size-base span.a-price.a-text-price.a-size-base')
        );

        const discount = ( ( (originalPrice - currentPrice) / originalPrice) * 100).toPrecision(2);

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable.';
        
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || "{}";
        const imagesArray = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('span.a-price-symbol'));

        // Return the data as an object
        const data = {
            productURL,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            outOfStock,
            image: imagesArray[0],
            currency,
            discount: Number(discount) || 0,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(currentPrice) || Number(originalPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice)
        }
        
        // console.log(data);
        return data;
        
    } catch (error: any) {
        throw new Error(`Failed to scrape the product: ${error.message}`);
    }
}