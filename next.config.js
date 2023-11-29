/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ['mongoose']
    },
    images: {
      domains: ['m.media-amazon.com', 'images-cn.ssl-images-amazon.cn']
    }
  }
  
  module.exports = nextConfig