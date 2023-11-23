"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'

const isValidAmazonURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        if(
            hostname.includes('amazon.com') || 
            hostname.includes('amazon.') ||
            hostname.includes('amazon')
        ) {
            return true
        }
    } catch (error) {
        return false
    }
}

const Searchbar = () => {

    const [searchPromp, setSearchPromp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { 
        event.preventDefault();

        const isValidLink = isValidAmazonURL(searchPromp);

        if(!isValidLink) return alert('Please enter a valid Amazon Product URL')

        try {
            setIsLoading(true);

            // Scrape the product web
            const product = await scrapeAndStoreProduct(searchPromp);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>

            <input
                type="text"
                value={searchPromp}
                onChange={(e) => setSearchPromp(e.target.value)}
                placeholder='Enter product Link'
                className='searchbar-input'
            />

            <button type='submit' className='searchbar-btn' disabled={searchPromp === ''}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>

        </form >
    )
}

export default Searchbar