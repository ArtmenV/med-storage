const CssNano = require('cssnano');
const Autoprefixer = require('autoprefixer');

const isProduction = process.env.NODE_ENV === 'production';
const plugins = [];

if (isProduction) {
    plugins.push(Autoprefixer, CssNano);
}

module.exports = {
    plugins,
};
