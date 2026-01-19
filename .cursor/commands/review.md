# Command: /review

Review code với Senior Architect perspective.

## Usage

```
/review [file_path]
/review @file.ts
/review
```

## Examples

```bash
# Review specific file
/review @apps/server/src/modules/auth/auth.service.ts

# Review current file
/review

# Review multiple files
/review @file1.ts @file2.ts
```

## What it does

Applies `code-review-rules.mdc` to review code for:
- Performance & Scalability issues
- Security vulnerabilities
- Design patterns & architecture
- Edge cases & error handling
- Code quality & maintainability

## Output Format

- 🔴 Critical issues
- 🟡 High priority issues
- 🟢 Medium priority issues
- 🔵 Low priority suggestions

Each issue includes:
- [Problem] -> [Solution] -> [Why]
