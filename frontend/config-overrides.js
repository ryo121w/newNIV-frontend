module.exports = function override(webpackConfig) {
    webpackConfig.resolve.fallback = {
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer/')
    };
    return webpackConfig;
};
