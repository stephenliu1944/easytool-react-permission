module.exports = {
    'extends': ['.eslintrc.js'],
    'rules': {
        'no-empty': 'error',
        'no-multiple-empty-lines': ['error', {'max': 1}],
        'no-console': ['error', {'allow': ['error']}],
        'no-debugger': 'error',
        'no-alert': 'error',
        'no-eval': 'error',
        'indent': ['error', 4, {'SwitchCase': 1, 'MemberExpression': 2, 'ignoredNodes': ['TemplateLiteral']}],
        'spaced-comment': 'error'
    }
}
