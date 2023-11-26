'use server'

import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productURL: string) {

    if (!productURL) return;

    try {
        connectToDB();

        const scrapedProduct = await scrapeAmazonProduct(productURL);
        if (!scrapedProduct) return;

        // Save the product to the database
        let product = scrapedProduct;

        const existingProduct = await Product.findOne({ url: scrapedProduct.productURL });
        if (existingProduct) {
            // Update the existing product
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ];

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.productURL },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`);

    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product = await Product.findById(productId);
        if (!product) return null;

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts() {
    try {
        connectToDB();

        const products = await Product.find();
        if (!products) return null;

        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        connectToDB();

        const currentProduct = await Product.findById(productId);

        if (!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: { $ne: productId },
        }).limit(3);

        return similarProducts;
    } catch (error) {
        console.log(error);
    }
}