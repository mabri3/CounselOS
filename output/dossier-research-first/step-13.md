# Step 13 — bounded configured-model quality check

Date: September 11, 2026, America/Los_Angeles  
Step result: DONE  
Quality acceptance: FAILED

## Exercise

One configured-model exercise ran against an isolated synthetic matter. It used the saved workspace selections and normal source-choice records. It did not use the real Harbor matter or change the active-vault pointer.

- Fixture: `dossier-live-quality-20260912-01`
- Vault: `output/dossier-research-first/live-quality-vault`
- Matter: `MAT-20260912-f7ed8b`
- Parent: `DOR-20260912-f382af`
- Children: `RUN-7cc4ffbe990727e9`, `RUN-72ac3d54d92d026d`, `RUN-959dbc35258d60cb`
- Main: `opencode_go / deepseek-v4.1-flash / max`
- Collector: `opencode_go / deepseek-v4.1-flash / default`
- External attempt count: 1
- Cost: unavailable from the provider; not estimated.

The preflight record was saved before the external call in `live-quality-attempt.json`. It includes the fixture, matter, request identity, model selections, source choices, planned worker identities, three selected issues, two retained workstreams, and synthetic source paths.

## Commands and exits

| Command | Exit | Result |
|---|---:|---|
| `cd backend && .venv/bin/python ../output/dossier-research-first/run-live-quality.py prepare` | 1 | Local preflight stopped before model or network use because the evidence helper called a nonexistent `VaultService.write_text`. No external attempt was recorded. |
| `cd backend && .venv/bin/python ../output/dossier-research-first/run-live-quality.py prepare` | 0 | Isolated synthetic matter and preflight evidence saved after the helper was corrected to use `write_bytes`. |
| `cd backend && .venv/bin/python ../output/dossier-research-first/run-live-quality.py run` | 0 | The single configured-model exercise completed. The application result was partial. No rerun was made. |
| `shasum -a 256 .counsel-os/active-vault.json` | 0 | `7116f19dcdb721ad716f5e95e46f144b5ad55f4973e3bb8787fe809d1feadcd2` |
| `shasum -a 256 'Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier.md'` | 0 | `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2` |
| Port and process inspection with `lsof` and `ps` | 0 | Ports 8199 and 3199 clear; no execution-owned fixture/model process remained. |
| `git diff --check` | 0 | No whitespace errors. |

No application code changed in Step 13. The Step 12 full suite and build were not repeated. `graphify update .` was not needed.

## Measured result

- Preparation: 83.155 seconds.
- Subscription child: failed; 85 active seconds; 2 main calls; 4 sources retrieved; 3 saved read attempts, all `not_found`.
- Privacy child: failed; 162 active seconds; 1 main call; 10 sources retrieved; 0 passage reads.
- Vendor child: completed; 389 active seconds; 8 main calls; 12 sources retrieved; 9 saved read records, of which 7 contain passages; packet `RES-20260912-996d5f.md` saved.
- Full request: 472.208 seconds.
- Saved first-pass-ready metric: 471.473 seconds after external start.
- Actual useful dossier time: not achieved because no new dossier revision was published.
- Publication count: 1 attempted; 0 successful.

The detailed trace and quality review are in `live-quality-result.json` and `live-quality-assessment.md`.

## Outcome and defects

The vendor result correctly applied the synthetic contract's deep Section 6 exception, stated conditions and a concrete next step, preserved the other workstreams, and kept the event and administration dates separate. The preparation record kept reported facts separate from the inferred assumption.

The end-to-end quality acceptance failed:

- two workers stopped with `ValueError: Saved source snapshot hash changed.`;
- primary-law results were retrieved but did not become a saved privacy packet;
- a recommendation proposal was saved, but the dossier publication receipt failed;
- no new dossier revision was created;
- the console reported citation formatting `KeyError` during the run.

## Safety and cleanup

- The real Harbor dossier hash matches the saved baseline.
- The active pointer still selects the Mosaic Relay vault and its hash matches Step 12.
- No real Harbor or active-vault Markdown was written by Step 13.
- The first incomplete synthetic vault was moved to `/tmp/counsel-os-step13-incomplete-vault-20260912-01`; it was not deleted.
- The two active-vault SQLite temporary files from the Step 12 incident remain untouched because their safe ownership cannot be proved.
- No execution-owned process remains. Ports 8199 and 3199 are clear.

## Next action

Build deterministic reproductions for the shared-source snapshot mutation and the citation-formatting/publication failure. Repair them and run focused checks. Request separate authorization before any second configured-model exercise.
