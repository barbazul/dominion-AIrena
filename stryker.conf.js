module.exports = function(config) {
  config.set({
    mutate: [
      'src/**/*.js',
      '!**/__tests__/**/*.js'
    ],
    mutator: {
      name: 'javascript',
      excludedMutations: [
        'StringLiteral'
      ]
    },
    packageManager: 'yarn',
    reporters: ['html', 'progress', 'dashboard'],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off'
  });
};
