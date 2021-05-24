// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    globals: {
        NODE_ENV: 'test',
        __DEV__: true
    },
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // The directory where Jest should output its   files
    coverageDirectory: 'coverage',
    // The glob patterns Jest uses to detect test files
    testMatch: ['<rootDir>/test/**/*.(js|jsx)'],
    testPathIgnorePatterns: ['<rootDir>/test/app.js', 'node_modules'],
    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ['src', 'node_modules'],
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json'],
    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '^Constants(.*)$': '<rootDir>/src/constants$1',
        '^Utils(.*)$': '<rootDir>/src/utils$1'
    },
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.(js)$': 'babel-jest',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileTransformer.js'
    }
};