# Jest for Expo / React Native

The universal testing rules — real implementations, minimal mocks, in-repo
fixtures, one statement per line — live in
[`.agents/rules/testing.md`](../../../rules/testing.md). This file covers the
Expo-specific mechanics that repeatedly cost time.

## Setup

- **Use the `jest-expo` preset.** It handles Expo/RN transforms, the
  AsyncStorage mock, and environment setup. Don't use `preset: "react-native"`
  directly.
- **`transformIgnorePatterns` entries are ANDed, not ORed.** ESM packages needing
  a transform go in a **single joined pattern**:

  ```js
  transformIgnorePatterns: [
    "node_modules/(?!(package-a|package-b)/)",
  ]
  ```

  Split across multiple entries, everything gets ignored.
- `transformIgnorePatterns` controls what Jest transforms; `moduleNameMapper`
  controls module resolution. They are not interchangeable.
- **Jest does not auto-load `.env` the way Metro does.** Load it explicitly in
  the setup file:

  ```ts
  require("dotenv").config({ path: ".env.local" });
  ```

## What to mock globally

Only native modules with **no JS fallback**:

- Async storage — use the package's own official Jest mock.
- Vendor SDK native modules — pure native, mock individually as needed.
- Secure-store / keychain bindings — no JS alternative exists.

## What not to mock globally

- App utilities — logger, flash messages, configs. Let them load for real so a
  startup crash surfaces as a failure instead of passing silently.
- Custom hooks and context providers — mock per test, only when needed.
- Services and data fetching — per test, or a request-mocking layer.

Router and auth mocks belong per test too: each test may need different routes,
and a global auth mock hides real auth issues.

## Screen tests

Wrap in the providers the screen actually needs — the store provider, plus any
secure-value or theme provider it reads from.

```tsx
render(
  <Provider store={store}>
    <SecureValueProvider>
      <LoginScreen />
    </SecureValueProvider>
  </Provider>,
);
```

**Use `waitFor` around assertions, not `act` around `render`.** Wrapping
`render()` in `act` produces "Can't access .root on unmounted test renderer".

```tsx
render(<Component />);
await waitFor(() => expect(screen.getByText("Loaded")).toBeOnTheScreen());
```

## SVGs

SVGs **must** go through `transform`, not `moduleNameMapper`. Mapped, they
resolve to the transform file as an object and component rendering breaks.

```js
transform: {
  "\\.(svg)$": "<rootDir>/jest.svg-transform.js",
}
```

## ESM dependencies

**Prefer removing an ESM-only dependency over fighting the transform config.**
When a new one is unavoidable:

1. Check `package.json` `exports` for a CJS fallback.
2. If CJS exists, add the package to the joined `transformIgnorePatterns`.
3. If not, consider an alternative or inline the small piece of logic needed.
