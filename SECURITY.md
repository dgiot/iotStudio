# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| master (latest) | ✅ |
| Older releases | ❌ — upgrade to latest |

## Reporting a Vulnerability

We take security seriously. **Do not** open a public issue for vulnerabilities.

Report via one of:

- **GitHub Security Advisories** (preferred): https://github.com/dgiot/iotStudio/security/advisories
- **Email**: security mailbox published once the DGIOT LLC mailbox is live — until then, use the Advisories flow above
- **GitHub Issues** for non-sensitive questions only

### Response SLA

| Severity | Initial response |
|----------|------------------|
| Critical / High | within 48 hours |
| Medium / Low | within 5 business days |

Include in your report: affected version(s), repro steps, impact, and (if possible) a minimal PoC.

## Security Notes

### Dependency hardening (2026-08-31): dependabot 45 → 8

`frontend-vue` dependency audit reduced **45 alerts → 8 moderate** (0 critical / 0 high).

Fixed via `package.json` overrides (forcible safe versions):

| Package | Version | Severity | Via |
|---------|---------|----------|-----|
| tar | 7.5.22 | critical | fabric → canvas → node-pre-gyp |
| brace-expansion | 1.1.18 / 2.1.4 | high | exceljs → archiver → glob |
| postcss | 8.5.26 | high | vite |
| nanoid | 3.3.18 | high | postcss |
| ip-address | 10.7.0 | high | mqtt → socks |
| linkify-it | 5.0.2 | high | amis-ui → markdown-it |
| path-to-regexp | 6.3.0 | high | amis-core |
| tinymce | 7.9.3 | high | amis-ui rich text |
| qs | 6.16.0 | moderate | amis-core |
| uuid | 11.1.1 | moderate | exceljs |
| xlsx | 0.20.3 (SheetJS official CDN tarball) | high | amis (npm line stopped at 0.18.5) |

Also: `fabric` `^6.9.1` → `^7.4.0` (major upgrade, build-verified).

Remaining 8 moderate are locked inside amis 6.13.0 (echarts 5.5.1 / froala 3.1.1 / markdown-it 12.3.2) — revisit after an amis major upgrade.

### Hardening practices

- Credentials are **never** hard-coded: read from environment variables (`PARSE_APP_ID`, `PARSE_MASTER_KEY`, …) or `config.yaml` (gitignored).
- `config.yaml` / `config.project.yaml` / `.env*` are excluded from version control.
- Run `npm audit --registry=https://registry.npmjs.org` before adding dependencies (the default npmmirror registry does not support audit).
