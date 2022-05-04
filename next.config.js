/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = [
      // Don't watch _any_ files for changes
      /.*/,
    ];
    return config;
  },
  images: {
    domains: ['www.gravatar.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
