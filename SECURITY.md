# Security and Privacy

## Reporting a problem

Do not open a public issue containing a credential, private dataset, security exploit, or personal information. Send a minimal description to **davidedmondsc@gmail.com** with the subject `Portfolio security report`.

## Supported code

Security fixes are applied to the current default branch.

## Data handling

This is a public portfolio. It must not receive or store confidential datasets. The CSV quality checker reads a selected file locally in the visitor's browser and does not send it to a server.

Do not use the checker with classified, client-confidential, medical, banking, tax, identity, or otherwise sensitive data. Public, synthetic, or properly sanitized data only.

## Secrets

Secrets must be stored only in the approved deployment platform's secret manager. Never commit `.env` files, access tokens, credentials, private keys, or copied browser sessions.
