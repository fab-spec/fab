module.exports = {
  '*.{js,css,json,md,ts}': ['prettier --write', 'git add'],
  '*.ts': [
    // For some reason, some IDE's auto-import feature will import '@fab/core/src'
    // instead of '@fab/core'. This causes really weird TypeScript output.
    (files) =>
      `bash -c "${[
        "echo '=== Change @fab/{core,cli}/src to @fab/{core,cli} in the following files: ==='",
        `grep -l @fab/core/src ${files.join(' ')}; test $? -eq 1`,
        `grep -l @fab/cli/src ${files.join(' ')}; test $? -eq 1`,
      ].join(' && ')}"`,
  ],
}
