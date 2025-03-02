module.exports = {
  overrides: [
    {
      files: ['*.cjs'],
      env: {
        node: true,
        commonjs: true
      },
      globals: {
        module: 'writable'
      }
    }
  ]
}; 