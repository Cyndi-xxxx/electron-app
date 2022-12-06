module.exports = {
  packagerConfig: {
    icon: './icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Cyndi-xxxx',
          name: 'electron-app',
        },
        authToken: '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',
        prerelease: true,
      },
    },
  ],
};
