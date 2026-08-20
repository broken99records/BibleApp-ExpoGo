# Testing

## Real implementations, minimal mocks

Tests exercise real data and real implementations wherever possible. Mock only
true external boundaries.

- **Mock:** network, timers and `Date.now`, browser-only APIs the test
  environment genuinely lacks.
- **Do not mock:** stores, composables and hooks, routing, event buses, i18n,
  notification layers. Wire the real ones up with fixture data.
- Where mocking is unavoidable, justify it inline.

**Why:** heavy mocking pins down what the mocks return, not what the code does. A
refactor passes mocked tests while breaking real behaviour.

The same logic governs global test setup. Only native modules with no JS fallback
get mocked there. App utilities, custom hooks, and context providers load for
real, so a startup crash surfaces as a test failure instead of passing silently.

## Scope

- **Default to unit tests over pure functions** — plain inputs, plain outputs.
  Where logic is entangled with the framework, extract the testable part into a
  pure helper and test that.
- **Full-app-mount integration tests are slow and flaky.** Existing ones may be
  tolerated; don't add more without being asked.
- Where a test truly needs framework reactivity, mount a tiny host component
  rather than booting the whole application.

## Fixtures

- **Fixtures live in the repo.** Inline the minimum shape that satisfies the type
  contract, or commit a small file under `test/fixtures/` or a co-located
  `__fixtures__/`.
- **Never load fixtures from a build cache or generated directory.** Those are
  gitignored, absent in CI, and owned by a different layer.
- Tests that pass locally because of dev-server side effects fail in CI. Verify
  there before claiming green.

## Style

- **One statement per line**, including in arrange and setup blocks and in
  factories. Never `a(); b(); c();`.
- **Prefer separate test blocks over wide table-driven tuples**, even at the cost
  of mild duplication. Compressed tables read as noise.
