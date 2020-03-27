module.exports = {
  '*.{js,css,json,md,ts}': [
    'prettier --write',
    'git add',
    (files) => `grep -q foo ${files.join(' ')}; test $? -eq 1`,
  ],
}
