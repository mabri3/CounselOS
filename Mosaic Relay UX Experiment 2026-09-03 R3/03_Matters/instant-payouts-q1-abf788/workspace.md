---
matter_id: MAT-20260904-abf788
snapshot:
  short_answer: 'I have enough context. Let me verify whether any external authority
    was retrieved across all research runs. All four research runs report `external_authority_retrieved:
    false`. The the internal record.md packet mentioned a "Supplied public legal research"
    source with low confidence (0.43) and 4 claims stripped — that was a supplied
    source, not retrieved authority, and it was explicitly flagged as low-confidence
    and not answering the question. Let me confirm that detail from the packet.

    I have sufficient information. Let me now provide the research-based analysis.
    The key finding: **no external authority was retrieved** in any research run for
    this matter. All packets are model-only analysis based on internal facts. I must
    state this honestly and not claim authority exists.

    ## Research: legal basis for "Collect CIP at onboarding"

    ### Research scope and support status

    I reviewed all four research packets in this matter (the state licensing, OFAC/AML,
    USDC, and $3,000-threshold runs). **No external authority was retrieved** in any
    of them — every run reports `external_authority_retrieved: false`, and the packets
    themselves state "No external authority retrieved." The one "supplied public legal
    research" source referenced in the licensing packet was flagged as low-confidence
    (0.43) with its claims stripped and explicitly did not answer the question; it
    is a supplied source, not retrieved or verified authority. So I cannot cite a
    retrieved statute, regulation, or case for the CIP-at-onboarding rule. That is
    a **research gap**, not proof that no such authority exists — the governing rules
    (31 U.S.C. § 5318(l) and 31 CFR §§ 1020.220 / 1022.210) are well-established but
    were not retrieved into this matter''s record.

    ### The applicable actor and rule

    **Actor:** Mosaic Relay, as the party initiating ACH payouts. Whether it is a
    covered financial institution (MSB/money transmitter) or an agent of a covered
    financial institution is the controlling unknown — it determines which CIP rule
    applies and whether the obligation falls on Mosaic Relay at all.

    **Rule (as analyzed, not retrieved):** Under 31 U.S.C. § 5318(l) and its implementing
    regulations, a covered financial institution must maintain a written Customer
    Identification Program that collects the customer''s name, date of birth (for
    individuals), address, and identification number **before or at the time of opening
    the account** — not after a transaction threshold is crossed. For money services
    businesses, the MSB CIP rule (31 CFR § 1022.210) applies; for banks, 31 CFR §
    1020.220. The "account" for a money transmitter is established when the customer
    first uses the service to send or receive funds, so the first payout to an unverified
    seller is the violation point.

    ### Supporting and contrary authority

    - **Supporting (analyzed, not retrieved):** The CIP-timing rule supports collecting
    identity at onboarding. The prior research packet on the $3,000 threshold (the
    internal record) reaches this conclusion, but it is **model-only** — it cites
    no retrieved authority and explicitly flags that the legal conclusions "should
    be verified against current FinCEN regulations and guidance."

    - **Contrary (analyzed, not retrieved):** The only candidate contrary position
    is that Mosaic Relay is a pure technology provider with no control over funds,
    in which case the CIP obligation may fall entirely on the bank partner. This is
    a **factual** alternative, not a legal exception, and it is unconfirmed. No retrieved
    authority supports either side.

    ### Distinguishing business risk reduction from legal permission

    This is the critical distinction. **Collecting CIP at onboarding is a risk-reduction
    measure, not a grant of legal permission.** It does not create a right to operate;
    it reduces the compliance exposure that arises from the current deferred-identity
    design. The legal question of *whether Mosaic Relay may initiate payouts at all*
    (its money transmission licensing posture) is separate and unresolved. Collecting
    CIP at onboarding reduces the CIP/AML violation but does not resolve the licensing,
    OFAC-timing, USDC, or beneficial-ownership issues. So the choice is best understood
    as: **it removes one identified violation, but it does not by itself make the
    product lawful to ship.**

    ### Material facts and exceptions

    **Known facts:** Sellers onboard with email + bank account only; identity deferred
    to $3,000; Mosaic Relay initiates ACH payouts; operates as agent under bank partner''s
    license; bank partner has seen the deck.

    **Unknown facts:** Whether Mosaic Relay is an MSB registered with FinCEN; whether
    it holds state money transmitter licenses; whether the bank partner has contractually
    accepted CIP; whether Mosaic Relay controls funds.

    **Exceptions:** None apply to CIP timing for money transmitters. The $3,000 Travel
    Rule recordkeeping threshold (31 CFR § 1020.410(a)) is a separate per-transaction
    obligation and creates no CIP exemption. Risk-based flexibility exists for *how*
    verification is completed, not for *whether* identity is collected before the
    relationship is established.

    ### Reassessment of the selected path and connected paths

    The research does not change the recommendation that **collecting CIP at onboarding
    is the compliant path** for the CIP-timing issue — but it sharpens the caveat
    that this rests on **unverified, model-only analysis** and on the **unconfirmed
    premise** that Mosaic Relay is a covered financial institution. The path is conditional
    on that premise. If Mosaic Relay is a pure technology provider, the obligation
    may shift to the bank (the "rely on bank CIP" path), and the two paths can coexist.
    The research also confirms the path does **not** resolve the connected licensing,
    OFAC-timing, USDC, and beneficial-ownership issues — those remain open regardless.

    **Bottom line:** The "Collect CIP at onboarding" choice is the right direction
    for the CIP-timing issue, but its legal basis is **not yet supported by retrieved
    authority** in this matter''s record. Before relying on it as the compliance foundation,
    counsel should obtain and verify the actual FinCEN CIP regulations and confirm
    Mosaic Relay''s MSB/licensing status. This is a research gap to close, not a confirmed
    legal conclusion.



    I did not record a decision or change any recorded choice — this is analysis only.
    The key open item for counsel: **no external authority has been retrieved** in
    this matter, so the CIP-at-onboarding rule rests on model-only analysis. Before
    treating it as the compliance foundation, obtain and verify the actual FinCEN
    CIP regulations and confirm Mosaic Relay''s MSB/licensing status.'
  answer_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260905-d1755b.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-ba3f28.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-ef1653.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-12a978.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-7654be.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-a89857.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-b6e16a.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-3f5f1a.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-eb4cc8.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-b2214b.md
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-d05240.md
  run_id: RUN-20260907-d05240
  generated_at: '2026-09-07T22:30:52+00:00'
  source_revisions:
    03_Matters/instant-payouts-q1-abf788/matter.md: 74220498599eb9d31eae30e3fbcf727a5d7500aef782d0106fa2fda809adddac
    03_Matters/instant-payouts-q1-abf788/dossier.md: e3721055dee79bbe9e1de1b7676e3a9a981b0f0c9978a1cc7f2458f836c038eb
    03_Matters/instant-payouts-q1-abf788/facts.md: 1b81abfafda5aed6dc1c38b75a6092d3979b13a41fa438fa2e4b5a4d9d3e84be
    03_Matters/instant-payouts-q1-abf788/issues.md: 0e2de4f434b1da6c865eb6c8d0860e62419e27c438b295d155dbf23f9163f2dc
    03_Matters/instant-payouts-q1-abf788/recommendations.md: c37d264b11cf31e038a7e0a47488e96a39af2ce77737b1fd2007942cedfebea9
    03_Matters/instant-payouts-q1-abf788/request.md: 06011e1d8afea8e311985dc60c92f5427cf1f04b2dc53c95c27ae3f75d7a868c
    business_question: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  claims: []
interaction_receipts:
- receipt_id: RCP-fea44b855af1881b7603
  source_action_key: workspace:cd938be8-6a96-4f6a-908d-928bfc388d0d
  operation: save_inquiry_result
  target:
    matter_id: MAT-20260904-abf788
    business_question_id: BQ-7eb9a27f11971732
    business_question_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
    issue_id: null
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: dc742da0743db82a0502dba50486476edee655c2825b64430451372a71ba7814
  source_message_id: null
  run_id: RUN-20260905-d1755b
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260905-d1755b.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-05T14:45:27+00:00'
- receipt_id: RCP-16fffb514db01dfbfc50
  source_action_key: analyze-paths:93d85356-bc4a-48c1-a14d-48c6079eff39
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 74e63e6afeaf237b209a31206384561b2ebe1156f519065ee5a431e83f3a6c3f
  source_message_id: null
  run_id: RUN-20260906-ba3f28
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-ba3f28.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T14:57:26+00:00'
- receipt_id: RCP-a7b08dcf2438e7538281
  source_action_key: analyze-paths:b6a151d5-e35e-460d-9834-9ff99902ac46
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-704b6c4c5d335bfe
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 93e9ebbc77a6e89e7297e5987fd6f2538a343f70448dd8a2bfadca0e59e4f4e1
  source_message_id: null
  run_id: RUN-20260906-ef1653
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-ef1653.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T18:16:51+00:00'
- receipt_id: RCP-b9dadb4d9da65cdd8fdb
  source_action_key: analyze-paths:206879ff-3f31-45eb-8fcf-339ac5906309
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 7976c151c6373df0c5a2728be2e75c77b1aa8d691138d86e5c39e47856226fb1
  source_message_id: null
  run_id: RUN-20260906-12a978
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-12a978.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T19:26:27+00:00'
- receipt_id: RCP-a45d575fa51f35ffe230
  source_action_key: analyze-paths:4b221d14-03c2-4940-86fe-b953067b158c
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 7976c151c6373df0c5a2728be2e75c77b1aa8d691138d86e5c39e47856226fb1
  source_message_id: null
  run_id: RUN-20260906-7654be
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-7654be.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T23:21:02+00:00'
- receipt_id: RCP-0c5ad8fa8b54dddfd301
  source_action_key: analyze-paths:68fea6a3-3346-468b-acce-8d23953ff682
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 9c4d1ebbf19b49a668134a647857c129a47b55c4d3e6cda337edffd08b73a6a6
  source_message_id: null
  run_id: RUN-20260906-a89857
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-a89857.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-06T23:23:37+00:00'
- receipt_id: RCP-8947ad89d00f1dc7c889
  source_action_key: analyze-paths:a45f7b6a-875c-41a6-a452-b1b8305982d8
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 6adee0ff2aea47ecc233854f65287c8af7123f03df642d25ae858544dad4b4dd
  source_message_id: null
  run_id: RUN-20260907-b6e16a
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-b6e16a.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-07T00:35:00+00:00'
- receipt_id: RCP-5ba2c277233f92e82a6b
  source_action_key: analyze-paths:d760625b-b051-48d4-a918-811e4c52888e
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 6adee0ff2aea47ecc233854f65287c8af7123f03df642d25ae858544dad4b4dd
  source_message_id: null
  run_id: RUN-20260907-3f5f1a
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-3f5f1a.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-07T00:40:39+00:00'
- receipt_id: RCP-88aecc71f323b79a716e
  source_action_key: analyze-paths:16309364-c7d9-4653-af8d-38da7317c959
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-46f961836e842b02
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: f7af65f4be748965030ba853c337ec585521f991d00faf974c1490d35b0b55ab
  source_message_id: null
  run_id: RUN-20260907-eb4cc8
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-eb4cc8.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-07T01:17:25+00:00'
- receipt_id: RCP-a9dc5be20ce71e1df4ce
  source_action_key: analyze-paths:b86bbca1-980e-4597-81fb-8dbf0af5ff6a
  operation: save_inquiry_result
  target:
    analysis_id: null
    analysis_revision: null
    option_id: null
    option_revision: null
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: null
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: afa319f20e2936f2e80b2c649b3f60d31248b2a834b06dfb7ff488d79e1950f5
  source_message_id: null
  run_id: RUN-20260907-b2214b
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-b2214b.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-07T15:09:37+00:00'
- receipt_id: RCP-9a582760316f68c0789b
  source_action_key: chat:339b6858-0ce1-4886-81d6-4ae05143dcea
  operation: save_inquiry_result
  target:
    condition_id: null
    analysis_id: IAN-b4698b5f28f2f2b4a6d33e4b
    analysis_revision: df22964a8f46d9064a155ef72a28ed545bc831f8ec199597ec6b711cff098f37
    option_id: OPT-b55bc23b0d039af3ecf9
    option_revision: ad803824848026b197b90dcb7be24050bd7d6ba0bcc2a26ad26a539b6b2940c6
    matter_id: MAT-20260904-abf788
    business_question_id: null
    business_question_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
    issue_id: ISS-7eb9a27f11-8c1936ea2c58b600
    source_id: null
    scenario_id: null
    artifact_path: null
    artifact_revision: null
    artifact_review_revision: null
    selected_range: null
    local_draft_snapshot: null
  state: applied
  before_revision: legacy:46ba1a280b17d15379b24e91cd117b4a62fce8cf82019d3522c7a13659c86795
  after_revision: 80a644f07587abfd141f88ebce571b50ce102b397fde253b79f59f0b9f92751e
  source_message_id: null
  run_id: RUN-20260907-d05240
  changed_links:
  - 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-d05240.md
  completed_parts:
  - inquiry_output
  failure_detail: null
  created_at: '2026-09-07T22:30:52+00:00'
issue_analyses:
  ISS-7eb9a27f11-8c1936ea2c58b600:
    analysis_id: IAN-9ed507dfda4fce14c373f847
    analysis_revision: 0a51e008b32df3162e6b4706b7b831a8d1287fe4d1f0cb32d39cf45dee492e85
    source_path: 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-d05240.md
    output_revision: 80a644f07587abfd141f88ebce571b50ce102b397fde253b79f59f0b9f92751e
    run_id: RUN-20260907-d05240
    captured_at: '2026-09-07T20:45:59.820435+00:00'
  ISS-7eb9a27f11-704b6c4c5d335bfe:
    analysis_id: IAN-a60247921c1f6ff3ab7faaf3
    analysis_revision: 422fc69b1f94253e25f9e59feb011a11e89281fa9b676821861064c7e2a91541
    source_path: 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260906-ef1653.md
    output_revision: 93e9ebbc77a6e89e7297e5987fd6f2538a343f70448dd8a2bfadca0e59e4f4e1
    run_id: RUN-20260906-ef1653
    captured_at: '2026-09-06T18:16:31.074299+00:00'
  ISS-7eb9a27f11-46f961836e842b02:
    analysis_id: IAN-cc910348e3a6188887446ca9
    analysis_revision: a094615f50e9c61ceeccbf4d4d69a786d14de93445fd39db87a51aa81f271fa1
    source_path: 03_Matters/instant-payouts-q1-abf788/conversations/inquiries/RUN-20260907-eb4cc8.md
    output_revision: f7af65f4be748965030ba853c337ec585521f991d00faf974c1490d35b0b55ab
    run_id: RUN-20260907-eb4cc8
    captured_at: '2026-09-07T01:16:50.868752+00:00'
---
