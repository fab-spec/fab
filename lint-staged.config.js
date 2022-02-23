module.exports = {
  '*.{js,css,json,md,ts}': ['prettier --write', 'git add'],
  '*.ts': [
    // For some reason, some IDE's auto-import feature will import '@dev-spendesk/core/src'
    // instead of '@dev-spendesk/core'. This causes really weird TypeScript output.
    (files) =>
      `bash -c "${[
        "echo '=== Change @dev-spendesk/core/src to @dev-spendesk/core in the following files: ==='",
        `grep -l @dev-spendesk/core/src ${files.join(' ')}; test $? -eq 1`,
      ].join(' && ')}"`,
  ],
}
