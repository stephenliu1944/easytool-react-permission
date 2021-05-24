var pkg = require('../package.json');

const { servers } = pkg.devEnvironments;
const mock = servers.mock;
const port = mock.port || mock;
const proxy = mock.proxy;

module.exports = {
    port: port,
    proxy: proxy
};