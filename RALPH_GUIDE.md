# Ralph Setup & Usage Guide

## What is Ralph?

Ralph is an autonomous AI agent loop that works on one user story at a time until all PRD items are complete. Each iteration:
1. Reads `prd.json` to find incomplete stories (where `passes: false`)
2. Spawns a fresh AI instance to implement that story
3. Runs quality checks (typecheck, lint, tests)
4. Commits if checks pass
5. Updates `prd.json` to mark story as `passes: true`
6. Repeats until all stories are done

**Key:** Ralph learns from `progress.txt` and `AGENTS.md` between iterations.

---

## Files You Need

✅ **Already created for you:**

- `prd.json` - Task list with user stories
- `progress.txt` - Learning/context log
- `scripts/ralph/ralph.sh` - The main loop
- `scripts/ralph/prompt.md` - Amp prompt template

---

## How to Trigger Ralph

### Option 1: Quick Start (Recommended)

```bash
bun exec scripts/ralph/ralph.sh 5
```

This runs **5 iterations max**. Ralph will:
1. Create a feature branch (from `prd.json` branchName: `feature/room-gallery`)
2. Pick the first incomplete story (us-001: room gallery)
3. Implement it
4. Run quality checks
5. Commit and mark `passes: true`
6. Continue to next story
****
### Option 2: Run with more iterations

```bash
bun exec scripts/ralph/ralph.sh
sh exec scripts/ralph/ralph.sh
```

Run 10 iterations (allows for bigger features or more stories).

### Option 3: Use Claude Code instead of Amp

```bash
bun exec scripts/ralph/ralph.sh --tool claude 5
bash scripts/ralph/ralph.sh --tool claude
```

(Only if you have `@anthropic-ai/claude-code` installed globally)

---

## Monitoring Ralph

While Ralph runs, check progress:

```bash
# See which stories are done
cat prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from current iteration
tail -20 progress.txt

# Check git history
git log --oneline -10
```

---

## How Ralph Works (Step by Step)

### Iteration N

1. **Ralph reads** `prd.json` and finds first story where `passes: false`
   - Currently: `us-001` (Display room gallery)

2. **Ralph spawns Amp** with prompt:
   ```
   Implement user story: us-001 - Display room gallery
   - Requirements: [from acceptanceCriteria]
   - Context: [from progress.txt + AGENTS.md]
   - Success: Passes quality checks + PR is mergeable
   ```

3. **Amp writes code:**
   - Creates/updates pages, components, database schemas
   - Follows AGENTS.md conventions
   - Implements the entire story

4. **Ralph runs checks:**
   ```bash
   bun typecheck   # TypeScript validation
   bun lint        # ESLint rules
   bun db:push     # Prisma schema changes (dev only)
   ```

5. **If checks pass:**
   - Git commit: "✅ us-001: Display room gallery"
   - Update `prd.json`: set `passes: true` for us-001
   - Append learnings to `progress.txt`

6. **If checks fail:**
   - Amp tries to fix the issues
   - Commits are NOT made
   - Iteration continues or Ralph asks for human help

7. **Loop repeats** for next story

---

## Understanding Your PRD

Current `prd.json` has 6 user stories (priority order):

| ID | Story | Priority |
|---|---|---|
| us-001 | Room gallery page | 1 |
| us-002 | Room filters (price, type, dates) | 2 |
| us-003 | Booking form component | 3 |
| us-004 | Booking creation endpoint | 4 |
| us-005 | User dashboard - my bookings | 5 |
| us-006 | Admin dashboard - room management | 6 |

Each story has **acceptance criteria** that define "done". Ralph works through them in priority order.

---

## Customizing the PRD

Want to add more features? Edit `prd.json`:

```json
{
  "id": "us-007",
  "title": "Add email confirmation after booking",
  "description": "Send confirmation email when booking is created",
  "acceptanceCriteria": [
    "tRPC endpoint sends email via email service",
    "Email template includes: booking details, confirmation number",
    "User receives email within 1 minute of booking",
    "Verify email is sent (check logs or test mailbox)"
  ],
  "passes": false,
  "priority": 7
}
```

Then re-run Ralph. It will continue from where it left off.

---

## Troubleshooting

### Ralph stops with errors

Check `progress.txt` for what went wrong. Common issues:

```bash
# Check database schema
cat prisma/schema.prisma | grep model

# Check Amp output
tail -50 progress.txt

# Run checks manually
bun typecheck
bun lint
```

### Ralph says "COMPLETE"

All stories have `passes: true`! 🎉 Check git history:

```bash
git log --oneline -20
```

You'll see each story as a separate commit.

### Want to restart?

```bash
# Reset PRD
git checkout prd.json

# Start fresh
bun exec scripts/ralph/ralph.sh 10
```

---

## Important Notes

1. **Ralph = Fresh Context Each Iteration**
   - Each story gets a brand new AI instance
   - Memory only via: git history + `progress.txt` + `AGENTS.md`
   - Update `AGENTS.md` with patterns/gotchas discovered

2. **Small Stories = Better Code**
   - Each story should fit in one context window
   - Too big → poor code, context overflow
   - If a story seems too large, split it

3. **Keep AGENTS.md Updated**
   - Ralph reads it for project conventions
   - Add learnings after iterations: "Use cva() for button variants"
   - This helps next iteration and future humans

4. **Quality Checks Must Pass**
   - typecheck, lint, tests
   - Broken code in one iteration compounds in the next
   - Keep CI green!

5. **Git = Memory**
   - Every successful story is a commit
   - Ralph branches from `branchName` in PRD
   - Check `git log` to see what was done

---

## Next Steps

### Run Ralph now:

```bash
cd c:/Users/hacur/Documents/MyDocs/Uni/Web\ Friday/hotelmanage2
bun exec scripts/ralph/ralph.sh 5
```

Watch it implement the first story automatically! ✨

### Monitor progress:

```bash
tail -f progress.txt          # Watch live
cat prd.json | jq             # See status
git log --oneline -n 20       # See commits
```

---

## Example Output

When Ralph runs:

```
[Ralph] Starting iteration 1/5
[Ralph] Looking for incomplete stories...
[Ralph] Found: us-001 - Display room gallery
[Amp] Building room gallery page...
[Amp] Creating pages/(public)/rooms/page.tsx
[Amp] Running checks...
[Amp] ✅ typecheck passed
[Amp] ✅ lint passed
[Ralph] Committing: ✅ us-001: Display room gallery
[Ralph] Updating prd.json...
[Ralph] Iteration 1 complete ✨

[Ralph] Starting iteration 2/5
[Ralph] Found: us-002 - Add room filters
[Amp] Building filter component...
...
```

---

## Questions?

- Check `scripts/ralph/prompt.md` - this is what Ralph sends to Amp
- Read `progress.txt` - learnings from your project
- Check `AGENTS.md` - project conventions
