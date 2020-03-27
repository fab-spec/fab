module.exports = {
  '*.{js,css,json,md,ts}': ['prettier --write', 'git add'],
  '*.ts': [
    () => [
      `bash -c "grep -lr @fab/core/src packages --exclude-dir node_modules --exclude-dir lib --exclude-dir esm; test $? -eq 1"`,
    ],
  ],
}
