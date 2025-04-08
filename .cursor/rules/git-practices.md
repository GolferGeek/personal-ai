# Git Practices

## Commit Message Format

```
[type]: Short description (max 50 chars)

Longer description of why this change is being made. Provide context and
explain what problem is being solved. Wrap at 72 characters.

Closes #123
```

## Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Branch Naming

- `feat/short-feature-description`
- `fix/issue-being-fixed`
- `refactor/component-name`
- `docs/update-readme`

## Pull Request Guidelines

1. Keep PRs focused on a single concern
2. Include clear descriptions of changes
3. Reference issues that the PR addresses
4. Make sure all tests pass
5. Request reviews from appropriate team members

## Code Review Guidelines

1. Be respectful and constructive
2. Focus on the code, not the person
3. Explain reasoning behind suggestions
4. Use approval with suggestions for minor issues
5. Request changes only for significant problems

## Git Workflow

1. Always pull before starting work
2. Create a feature branch from main
3. Make small, focused commits
4. Push branches regularly
5. Create a PR when the feature is complete
6. Merge only after code review approval
7. Delete branches after merging 