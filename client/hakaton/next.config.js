const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a/**',
            },
            {
                protocol: 'https',
                hostname: 'authjs.dev',
                port: '',
                pathname: '/img/providers/google.svg',
            },
            {
                protocol: 'https',
                hostname: 'avatars.yandex.net',
                port: '',
                pathname: '/get-yapic/**',
            },
        ],
    },
}

module.exports = nextConfig
