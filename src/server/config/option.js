module.exports = {
  cdn: process.env.TAURUS_MANAGER_CDN || true,
  port: process.env.PORT || process.env.TAURUS_MANAGER_PORT || '8001',
};