# Command: /audit

Comprehensive code audit với focus vào security và performance.

## Usage

```
/audit [file_path]
/audit @file.ts
/audit
```

## Examples

```bash
# Audit specific file
/audit @apps/server/src/modules/auth/auth.service.ts

# Audit current file
/audit

# Full security audit
/audit --security
```

## What it does

Deep dive audit focusing on:
- Security vulnerabilities (SQL Injection, XSS, IDOR, etc.)
- Performance bottlenecks (N+1 queries, memory leaks)
- Scalability concerns
- Best practices violations

## Difference from /review

- `/review`: General code review
- `/audit`: Deep security & performance audit
