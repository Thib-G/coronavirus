module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/coronavirus/'
    : '/',
  transpileDependencies: [
    'bootstrap-vue',
    'd3-axis',
    'd3-fetch',
    'd3-scale',
    'd3-scale-chromatic',
    'd3-selection',
    'd3-shape',
    'd3-transition',
  ],
};
