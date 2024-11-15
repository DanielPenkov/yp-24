/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
    },
};

export default nextConfig;
