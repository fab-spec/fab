module.exports = {
  '*.{js,css,json,md,ts}': ['prettier --write', 'git add'],
  '*.ts': [
    // For some reason, some IDE's auto-import feature will import '@dev-spendesk/fab-core/src'
    // instead of '@dev-spendesk/fab-core'. This causes really weird TypeScript output.
    (files) =>
      `bash -c "${[
        "echo '=== Change @dev-spendesk/fab-core/src to @dev-spendesk/fab-core in the following files: ==='",
        `grep -l @dev-spendesk/fab-core/src ${files.join(' ')}; test $? -eq 1`,
      ].join(' && ')}"`,
  ],
}
