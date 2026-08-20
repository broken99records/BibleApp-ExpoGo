# Working with me

Read this first. It is the entry point to every rule and skill in `.agents/`.

## The short version

If only five things survive:

1. **Act on explicit instruction, nothing more.** A question gets an answer. A
   design discussion is not a build order. Scope of action = scope of request.
2. **Verify before writing.** Confirm data shapes, helper signatures, and library
   APIs against source plus two or three real call sites. Never code on a guess,
   never guess a root cause.
3. **Smallest honest diff.** No speculative abstractions, no wrapper layers where
   a tweak works, no edits to files the request did not name.
4. **Explain the cause before changing anything**, then stop and wait.
5. **Don't verify, commit, or push unprompted.**

## Standing rules — always in force

These apply to every task, in every project, regardless of stack.

| Rule | Covers |
| --- | --- |
| [working-agreement.md](.agents/rules/working-agreement.md) | Authorisation, scope, diagnosis, verification, reporting, file tooling |
| [git-and-commits.md](.agents/rules/git-and-commits.md) | When to commit, staging, message format, co-authorship threshold |
| [writing-voice.md](.agents/rules/writing-voice.md) | Docs, dev notes, changelogs, MR descriptions |
| [delegation.md](.agents/rules/delegation.md) | What to hand off, what to keep, how to prompt a delegate |
| [testing.md](.agents/rules/testing.md) | Real implementations over mocks, fixture placement, test style |

## Skills — load by task

| Skill | Load when |
| --- | --- |
| [code-and-component-standards](.agents/skills/code-and-component-standards/SKILL.md) | Writing or reviewing any code; building UI components (Vue is the worked example) |
| [react-native-conventions](.agents/skills/react-native-conventions/SKILL.md) | Writing or reviewing React Native / Expo code |

## Project-level configuration

A project's own `AGENTS.md`, `CLAUDE.md`, and `.agents/` directory outrank this
file. Where a project documents a convention, follow it and flag the conflict
rather than silently applying the personal default.

Convention for project agent directories:

- **`.agents/rules/` and `.agents/skills/` are read-only.** Write only on an
  explicit request to create or change a rule or skill.
- **`.agents/project-notes/` is institutional memory.** Where a project's
  `AGENTS.md` mandates it, update `bugs.md` and `decisions.md` after resolving a
  notable bug or settling a convention, without waiting to be asked. A delegated
  agent writing there is following the same mandate — verify the content, don't
  revert the act.

<!-- project-specific: content below this line is preserved on reinstall -->

## Project notes

Stack, commands, and conventions specific to this repo go here.
