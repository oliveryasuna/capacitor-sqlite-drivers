import type {RcConfig} from 'syncpack/dist/config/types';

export default ({
  indent: '  ',
  lintFormatting: false,
  semverGroups: [
    {
      dependencyTypes: [
        'prod',
        'dev'
      ],
      range: '',
      dependencies: ['**'],
      packages: ['**']
    },
    {
      dependencyTypes: ['peer'],
      range: '^',
      dependencies: ['^**'],
      packages: ['**']
    }
  ],
  versionGroups: [
    {
      dependencies: ['$LOCAL'],
      dependencyTypes: [
        'prod',
        'dev'
      ],
      packages: ['**'],
      pinVersion: 'workspace:*'
    }
  ]
} satisfies Partial<RcConfig>);
