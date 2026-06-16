# KANHA - Contributing Guide

## Code of Conduct

KANHA is committed to fostering a welcoming, inclusive community. All contributors must:

- Be respectful and professional
- Welcome diverse perspectives
- Focus on constructive feedback
- Respect privacy and security

## Getting Started

1. Fork the repository
2. Clone locally: `git clone https://github.com/YOUR_USERNAME/KANHA.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Install deps: `npm install`
5. Start dev: `npm start`

## Commit Guidelines

```bash
# Format: <type>(<scope>): <message>
# Examples:
git commit -m "feat(voice): add wake-word detection"
git commit -m "fix(auth): correct fingerprint matching"
git commit -m "docs(readme): update installation steps"
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no logic change)
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Add/update tests
- `chore` - Maintenance

## Pull Request Process

1. Update README if needed
2. Add tests for new features
3. Run `npm run lint` and `npm run type-check`
4. Ensure all tests pass
5. Submit PR with clear description

## Coding Standards

### TypeScript

- Strict mode enabled
- No `any` types
- Comprehensive JSDoc comments

### React Components

- Functional components only
- React Hooks for state management
- Prop validation with TypeScript

### File Organization

```
components/
├── ComponentName.tsx     # Component file
├── ComponentName.test.tsx # Tests
└── types.ts              # TypeScript types
```

## Security

- Never commit API keys or secrets
- Always use `electron.safeStorage` for sensitive data
- Validate all IPC inputs
- Report security issues privately

## Testing

```bash
# (Tests coming soon)
npm run test
```

## Performance

- Avoid memory leaks in `useEffect`
- Use React.memo for expensive components
- Lazy load large modules
- Profile with DevTools

## Questions?

Open a GitHub Discussion or email kreetverse@gmail.com
