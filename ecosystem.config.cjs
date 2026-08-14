module.exports = {
  apps: [
    {
      name: 'drpy',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
    }
  ]
};
