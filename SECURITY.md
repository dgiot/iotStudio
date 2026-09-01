# Security Policy / 安全策略

## English Summary / 英文概要

**Dependency vulnerability status (2026-08-31): 45 alerts → 8 moderate. Critical: 0, High: 0.**

- Fixed via `package.json` overrides (11 packages forced to patched versions) + `fabric` 6 → 7 upgrade.
- The 8 remaining moderate findings are pinned by `amis@6.13.0` internals (echarts 5.5.1 / froala-editor 3.1.1 / markdown-it 12.3.2). Upgrading them to fixed majors risks breaking amis low-code rendering; revisit after an amis major upgrade.
- `xlsx` is overridden to the official SheetJS CDN tarball (0.20.3) — the npm registry release stops at 0.18.5 (ReDoS advisory).
- Recheck command: `npm audit --registry=https://registry.npmjs.org` (the default npmmirror mirror does not support the audit endpoint).
- Note: GitHub's alert count (6) differs from `npm audit` (8) due to dependency-path evaluation differences — SECURITY.md reflects the `npm audit` result.

**Credential policy / 凭据纪律**: credentials never enter this repository. Local build artifacts (`data/`, logs) and internal tooling are gitignored.

---

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
