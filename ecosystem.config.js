module.exports = {
    apps: [
      {
        name: 'oracle-peet',
        script: 'node',
        args: 'dist/index.js',
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  