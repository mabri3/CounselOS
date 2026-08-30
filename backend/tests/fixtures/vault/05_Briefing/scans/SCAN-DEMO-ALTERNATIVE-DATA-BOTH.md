---
scan_id: SCAN-DEMO-ALTERNATIVE-DATA-BOTH
path: 05_Briefing/scans/SCAN-DEMO-ALTERNATIVE-DATA-BOTH.md
watch_id: alternative-data
mode: manual
status: success
watch_revision: 1
outbound_query:
  standing_question: What public legal developments change how alternative data may be used or explained in automated credit decisions?
  keywords:
  - alternative data
  - adverse action
  - automated underwriting
  topics:
  - fair lending
  - credit decisions
  jurisdictions:
  - United States
  regulators:
  - Consumer Financial Protection Bureau
  courts: []
  industries:
  - financial services
  date_window:
    start: '2026-07-01'
    end: '2026-08-29'
  public_source_urls:
  - https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
  public_entities: []
input_checkpoints: {}
output_checkpoints:
  native:
    provider_id: native
    cursor: demo-native-2026-08-29
    last_observed_at: '2026-08-29T15:00:00+00:00'
    state: {}
  polaris:
    provider_id: polaris
    cursor: demo-polaris-2026-08-29
    last_observed_at: '2026-08-29T15:00:01+00:00'
    state: {}
provider_results:
- provider_id: native
  status: success
  next_checkpoint:
    provider_id: native
    cursor: demo-native-2026-08-29
    last_observed_at: '2026-08-29T15:00:00+00:00'
    state: {}
  source_coverage:
  - source_id: SRC-CFPB-CIRCULAR-2022-03
    url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
    status: checked
    message: Retrieved the public page for the synthetic demo comparison.
  candidates:
  - title: Demo signal on explaining alternative-data credit decisions
    canonical_url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
    official_identifier: DEMO-ALTERNATIVE-DATA-2026
    content_hash: demo-alternative-data-v1
    summary: A synthetic demo signal asks counsel to compare public adverse-action guidance with current automated-decision data and explanation practices. It does not claim that the cited guidance changed in 2026.
    occurred_at: '2026-08-29T14:45:00+00:00'
    sources:
    - title: CFPB Circular 2022-03
      canonical_url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
      publisher: Consumer Financial Protection Bureau
      published_at: null
      effective_at: null
      locator: Public CFPB circular page
      excerpt: Demo fixture stores no quoted source text. Open the source before relying on a specific proposition.
      support_state: retrieved
      warning: Retrieved for this demo, but no stored claim-to-excerpt check was completed.
    provider_observation: Native mock scan retrieved the public CFPB page and created this synthetic comparison prompt. No claim-to-excerpt verification was performed.
  raw_answer_reference: null
  bounded_excerpt: Native mock result. Public page retrieved; no new 2026 legal change asserted.
  warnings:
  - Synthetic native provider result.
- provider_id: polaris
  status: success
  next_checkpoint:
    provider_id: polaris
    cursor: demo-polaris-2026-08-29
    last_observed_at: '2026-08-29T15:00:01+00:00'
    state: {}
  source_coverage:
  - source_id: null
    url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
    status: checked
    message: Citation supplied by the Polaris mock result. CounselOS did not verify the cited proposition.
  candidates: []
  raw_answer_reference: mock://polaris/SCAN-DEMO-ALTERNATIVE-DATA-BOTH
  bounded_excerpt: Polaris mock result suggested review of specific reasons for alternative-data decisions. Themis · Not reviewed.
  warnings:
  - Synthetic Polaris result. Supplied citations are not verified.
source_coverage:
- source_id: SRC-CFPB-CIRCULAR-2022-03
  url: https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/
  status: checked
  message: Both providers returned useful demo observations.
development_count: 1
briefing_item_count: 2
review_packet_count: 1
warnings:
- Synthetic demo scan. Provider observations are mock data.
created_paths:
- 05_Briefing/developments/DEV-DEMO-ALTERNATIVE-DATA.md
- 05_Briefing/items/ITEM-DEMO-ALTERNATIVE-DATA-BRIEFING.md
- 05_Briefing/items/ITEM-DEMO-ALTERNATIVE-DATA-DECISION.md
- 05_Briefing/review-packets/PKT-DEMO-ALTERNATIVE-DATA.md
started_at: '2026-08-29T14:59:58+00:00'
completed_at: '2026-08-29T15:00:02+00:00'
---
# Scan SCAN-DEMO-ALTERNATIVE-DATA-BOTH

This synthetic run shows a successful `both` scan and keeps provider support labels separate.
