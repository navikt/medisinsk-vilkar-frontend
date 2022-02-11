module.exports = {
    server: {
        // How you build your bundle. If you use Rollup, add the plugin rollup-plugin-serve with the configuration serve({ contentBase: ‘dist’, port: 10002 })
        command: `npm run start:e2e`,
        port: 8081,
        // if default or tcp, the test starts right await whereas the dev server is not available on http
        protocol: 'http',
        // in ms
        launchTimeout: 30000,
        debug: true,
    },
    launch: {
        dumpio: true,
        headless: process.env.HEADLESS !== 'false',
        args: ['--disable-infobars', '--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 120000,
    },
};
