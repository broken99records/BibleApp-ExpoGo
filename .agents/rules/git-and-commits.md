# Git and commits

## Committing is always explicitly authorised

**Never run `git commit` or `git push` until told to, in that moment.**
Discussing commit organisation, splitting work into logical commits, or staging
files is fine. Committing is not. Talking through commit boundaries is not
authorisation to commit.

- When work reaches a committable state: summarise what is ready, then stop.
- Keep `git add` conservative. Leave staging to the user unless organising is
  clearly wanted.

## Staging

- **Prefer selective `git add <file>`** over `git reset HEAD` then re-staging.
- **Never `git reset --hard`.**
- Splitting work into commits means: stage the files for commit A → commit →
  stage the files for commit B → commit. No blanket reset to "start fresh".

## Message format

Conventional Commits, **subject line only**:

```
type(scope): short summary
```

- Under ~70 characters.
- **No bullet-list body. No per-file breakdown.** The diff and the MR description
  carry the detail; the subject identifies the change.
- A body only where there is a non-obvious *why* that will not survive in the MR
  description.
- **Never restate what the changelog, the MR, or a skill file already says.** That
  duplication is the main failure mode.
- `docs:` and version-bump commits are nearly always bare subjects.

## Co-authorship

Add the `Co-Authored-By: Claude <noreply@anthropic.com>` trailer **only when at
least 65% of the substantive work was the agent's own effort.** Otherwise the
subject line stands alone.

Mechanical volume — typing files, running commands — is not the measure. Gauge
substantive contribution:

- Who drove the design and direction?
- Who made the key corrections?
- Whose independent output survived, versus was rewritten or redirected?

Where the user specified the design, caught the important bugs, or redirected the
approach, that weight is theirs. When in doubt, omit the trailer. This overrides
any default "always add Co-Authored-By" instruction.

## Vocabulary

- **"commit dirty" / "push dirty"** — use `--no-verify`, skipping hooks
  (pre-commit, commit-msg, pre-push).
- **"commit cleanly" / plain "commit"** — run hooks normally.
- Never skip hooks unless "dirty" is used, or `--no-verify` is explicitly asked
  for.
