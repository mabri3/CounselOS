# Harborline Financial UX rerun setup

Business type: Fintech with consumer and business bank accounts through a banking partner and substantial payments work.
Fictional company: Harborline Financial, not affiliated with Chime.
Requester role: Senior product manager.
Attorney role: Senior product counsel focused on BSA/AML, banking regulation, and payments.
Iterations: 10.
Themes: onboarding, background checks, payments, deactivation, privacy, and marketing.
Application: http://localhost:3000
Requester: gpt-5.6-luna, medium reasoning.
Setup attorney: gpt-5.6-luna, medium reasoning.
Matter attorneys: gpt-5.6-luna, medium reasoning.
Synthesis: gpt-5.6-sol, high reasoning.
Public reference: Chime public pages, broad business model only.
Matter prefix: Harborline UX Rerun — NN —
Per-matter wall-clock cap: 35 minutes.
Final action: local fictional state changes are allowed; stop before real external contact or delivery.

## Isolation

- Experiment vault: `/private/tmp/counsel-os-harborline-live-experiment-20260901-h`
- Earlier active vault: `/private/tmp/counsel-os-harborline-final-verify-20260901-g`
- Purpose: disposable local Harborline UX experiment. Leave the experiment vault intact.
- Selected application model: NeuralWatt Kimi K3 Fast.
- Test-only vault confirmation handling: the local launcher disables the confirmation dialog for this run. This prevents expected vault-update dialogs from being counted as stalls.
- User-approved browser recovery: if an actor cannot see or control the in-app browser, the coordinator may operate it to help the actor. Record each such action as a method exception. Do not treat that user-approved help as a product success.
