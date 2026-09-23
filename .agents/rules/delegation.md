# Delegation

Delegation keeps bulk content out of the main context — only answers come back.
The tool names below are examples; map them to whatever delegate the host
environment provides (a bridge MCP, a subagent, a cheaper model tier).

## Delegate

- **Any file over ~200 lines** that would otherwise be read in full.
- **More than three files** in one analysis or comparison.
- **Repo-wide searches** — git log, diff, blame, broad greps.
- **`node_modules` and type-definition digs.** The moment an investigation
  becomes "trace this type or behaviour across several package files", hand it
  off. Inline greps are for one- or two-file confirmations.
- **Web and documentation lookups.**
- **Plan critique and code review** — always. A second model family catches what
  the first misses.
- **Multi-file edits and refactors.** Let delegates write changes across files,
  rather than limiting them to reads and audits.
- **Bulk data seeding** — fixtures, mock records, placeholder copy, sample
  datasets. High-volume, low-judgement pattern-filling against a shape that is
  already decided. Route it to the lowest-ranking model available. Deciding the
  shape and validating the result stay local; only the generation is delegated.
- **Non-English translation strings.** A native-quality delegate beats
  self-authored copy. Always update every locale file — never leave translations
  half-done.

## Do not delegate

- Small single-file edits.
- Questions answerable from context already loaded.
- Tasks needing tools only the main agent has.
- Anything after "do X and report back" — that means execute inline.

## Prompt style

**State intent and hard constraints. Nothing else.** The delegate is capable and
reads the repo itself.

- Give the goal, the grouping or outcome intent, and the non-negotiables — "don't
  push", "subject-only commit messages", "leave X untracked".
- Let it discover file lists, exact wording, and mechanics.
- Don't enumerate verbatim steps, per-file paths, or exact messages.
  Over-specified prompts waste tokens and under-use the delegate's judgement.
- Reserve verbatim detail for the specific thing a prior delegation got wrong.
- **Reference local rules and reference material explicitly.** Without this,
  delegates resort to web searches and write stale patterns.
- **State scope as explicit prohibitions, not just as a goal.** Name what must
  not appear — no extra screens, no features beyond the listed ones, no
  simulated success states. A delegate's own harness usually pushes it toward
  impressive output, and a positively-phrased scope loses that contest. "A
  catalogue and a cart" reads as a floor; "a catalogue and a cart, and nothing
  else" reads as a ceiling.

## Follow-ups

Use the delegate's session or continuation handle. Never resend the context.

## Verification and resilience

- **Verify disk changes directly.** Inspect files or run a diff rather than
  trusting the delegate's confirmation. Stale sessions can echo output without
  writing to disk.
- **A delegate's claim to have run a check is not evidence that it ran.** Asked
  afterwards, a delegate that reported completing a checklist gate confirmed it
  had read the checklist once at the start, "relied on a mental check" while
  writing, and reported done from a high-level review. Nothing in its report
  distinguished that from having run the gate.
- **Make the gate produce an artifact.** Where a delegated task has a checklist,
  require the checklist back in the report, line by line, each marked with the
  evidence — the grep that was run, the file and line inspected. A gate whose
  output is a sentence is a gate that gets skipped; a gate that has to be filled
  in gets run, and a skipped one becomes visible instead of reportable. Audit the
  filled-in list against the code, not against itself.
- **Demand four verdicts, not two: pass, fail, not checked, not applicable.**
  Without a not-applicable verdict, every item the task never touched comes back
  as a pass — "no migration files exist" reported against "changes are migration
  files" — and a checklist answered mostly by vacuity reads as full compliance.
  Require a reason on each not-applicable, then count the applicable items and
  judge the result against that number. Watch for the item answered by restating
  itself: a claim that repeats the rule's own words instead of naming a file,
  line, or command output is a not-checked wearing a pass.
- **Audit all numbers and metrics.** Verify figures independently against source,
  command output, or logs. Delegates can fabricate counts.
- **Fall back to lower-tier subagents on failure.** Where a delegate errors or
  times out, try a cheaper model in a new context instead of absorbing the bulk
  work inline.

## Known failure mode

Delegates that authenticate through an interactive CLI may need a TTY. Short
calls can succeed on a cached token while longer runs trip a re-auth that fails
in a headless session. On an auth timeout, ask for a manual refresh in a real
terminal rather than retrying blindly — and fall back to a low-tier subagent.
