---
request_id: REQ-20260908-2fb107
matter_id: MAT-20260908-7f900b
original_text_preserved: true
immutable: true
received_at: '2026-09-08T01:02:06+00:00'
requester: Product
business_objective: 'From: Marcus, PM — Risk Platform

  Subject: Velocity rules didn''t survive the migration — plan attached


  Bad one. When we cut over to the new rules engine on March 14, three of our nine
  monitoring rules didn''t get ported. '
requested_launch_date: '2026-09-09'
urgency: high
---
# Original Request

From: Marcus, PM — Risk Platform
Subject: Velocity rules didn't survive the migration — plan attached

Bad one. When we cut over to the new rules engine on March 14, three of our nine monitoring rules didn't get ported. Nobody caught it until a seller escalation last week. Gap ran March 14 → Sept 2, ~5.5 months.

The three that went dark: structuring-pattern detection, rapid movement of funds (in-and-out within 24h), and dormant-account reactivation. In scope: ~2.1M transactions, ~48k accounts.

My plan:

Ship the fix tonight — already in review.
Backfill the three rules across the gap period this weekend, then auto-close anything our fraud model already scored as low risk. Otherwise we're looking at tens of thousands of alerts and ops is 6 people.
Hold off telling the bank partner until we have clean numbers — call it 3 weeks.
FYI I wrote up a full postmortem in the engineering Confluence space and posted the timeline in #eng-general so the team learns from it.
I want to email affected sellers apologizing for "a delay in reviewing some transactions."
CFO is asking — Series C diligence opens in 6 weeks. Does this go in the data room?
