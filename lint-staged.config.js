module.exports = {
  '*.{js,css,json,md,ts}': ['prettier --write', 'git add'],
  '*.ts': [
    (files) => `bash -c "grep -l @fab/core/src ${files.join(' ')}; test $? -eq 1"`,
  ],
}
