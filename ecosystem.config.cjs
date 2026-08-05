module.exports = {
  apps: [
    {
      name: 'drpy',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'danmu-api',
      script: 'libs_drpy/danmu_api/danmu_api/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
    }
  ]
};
