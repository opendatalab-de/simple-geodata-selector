basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'src/lib/*.js',
  'src/js/app.js',
  'src/js/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
