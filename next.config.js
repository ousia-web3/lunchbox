/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  
  // 배포 환경에서만 basePath 적용
  basePath: process.env.NODE_ENV === 'production' ? '/lunchbox' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lunchbox' : '',
  
  // 빌드 성능 최적화
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // 이미지 최적화
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 