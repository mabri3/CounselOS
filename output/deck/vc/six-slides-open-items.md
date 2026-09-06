# Themis six-slide deck — open items

Produced alongside `Themis-Six-Slides-September-2026.pptx`. Every item below is
also in the speaker notes of the slide it belongs to.

The copy went through five drafts, plus a sixth slide added in a further two rounds, against a simulated Y Combinator group partner.
The final verdict was a pass — *"I would take this meeting and I would forward it"* —
with one important qualification: **the deck is at the ceiling of what copy can do
for this company.** What is left is evidence, not sentences.

---

## Before this deck is sent to anyone

**1. Get the quotation approved.** Slide 2 uses one word — "half-baked" — attributed
to a general counsel by role. The interviews README forbids publishing participant
quotations without approval, and the underlying file is an AI meeting summary rather
than a verified transcript. Confirm the wording and get permission. Ask for two or
three more usable sentences in the same email; four interviews should yield more than
one adjective.

**2. Decide whether you built the prototype.** Slide 1 lists the M.S. in Computer
Science but never connects it to the working prototype. If you wrote the code, say so
in four words on that slide. The reviewer called this "the most persuasive fact
available to a sole founder" and its absence is currently read as an answer.

**3. Confirm the fintech legal team size.** Slide 1 defines the customer as a legal
team of one to three with no procurement process. A Deputy GC implies a GC above them
and therefore a layered department. Either the profile widens or that pilot is
unrepresentative — and you want to know which before you are asked.

**4. Be ready to defend 70%.** Slide 3 commits to a recorded-decision rate by
December 15. There is no basis for 70 rather than 50 yet. Have an answer.

**5. The two dates on slide 4 are now live liabilities.** October 15 for walkthroughs,
November 1 for start dates. If you pitch in November with neither held, the slide
convicts you. Honour them or update the slide before every send.

---

## The work that turns a meeting into conviction

Ranked. The first one matters more than the other four combined.

**A. Run the head-to-head. One afternoon.**
Take ten real intake requests. Run each through Themis and through raw Claude. Strip
the labels. Have two of your four interviewees grade them. Count how often Themis
surfaced a materially decision-changing question the general model missed.

This is the whole investment thesis and nobody has ever tested it. The record only
accumulates if lawyers run matters through Themis; they only do that if the first pass
beats the Claude tab already open on their desktop. The moat cannot bootstrap itself.
If the answer is seven of ten, that number belongs on slide 3 and outweighs every other
line in the deck. If it is two of ten, you have learned the most important thing about
your company before spending someone else's $1.5M finding out.

**B. Put one real instance under each pattern on slide 3.**
The four shapes of the missed question are real and already encoded in the intake
agent, but the only example shown anywhere in the deck is a fictional matter. You have
hundreds of real ones from Settle, Manifest and Affirm. Sanitise one per pattern.
*"A pattern without an instance is a category; a pattern with an instance is a secret."*
If you can only produce two, ship two patterns with two real instances rather than four
patterns with none — and supply the denominator: roughly how many requests these are
drawn from.

**C. Send the two pilot emails.** Whether your design partners have opened the product
is not an unknown about someone else — it is one email you have not sent. Hold the
walkthroughs, get start dates, then replace "the plan" on slide 4 with what happened.
Silence from a contact is also a result, and you need it now.

**D. Validate the meetings inference.** Slide 2's "our read" — that recurring meetings
exist because prior reasoning is not retrievable — is an inference stacked on one
person's estimate. Ask the next four in-house lawyers a single question: *how much of
your recurring meeting load is re-deriving reasoning from decisions already made?*
Three of four saying "most" turns a read into a finding, and it carries the slide.

**E. Name the first engineer before the round closes.** You are asking for $1.5M to
hire a person who does not yet exist by name. A ready, identified candidate materially
de-risks a sole-founder pre-seed, and this is the most common reason a deal like this
stalls between the first meeting and the second.

---

## About slide 4, the context slide

Added after the five-slide review. It is the deck's answer to the standing objection —
why the first pass beats the Claude tab already open — and the reviewer's read is that
it answers half of it honestly: *"a mechanism answer to a quality question... it
converts 'trust us, it's better' into 'here is the specific, checkable reason it should
be.'"* It does not close the objection. Only item A below does.

Everything asserted on it was verified in the codebase first: the fixed assembly order
in `backend/app/agents/context.py` and PRD §11.5, `company.md` being non-optional, the
standing vault folders, and `decision_maintenance` as one of the three watch purposes in
`backend/app/models/awareness.py`.

Two claims were cut during the rewrite, both worth knowing so they do not come back:

- **"Every blank Claude or ChatGPT tab starts from zero."** A strawman. Both products
  have memory and Projects, and a partner who uses Projects daily reads that headline as
  uninformed. The argument that survives is *who assembles the context, in what order,
  and whether it can be skipped* — not whether the competitor has any.
- **"Already knows which body of law is in play, before the lawyer types the first
  word."** False — the applicable law is derived from the request. It would die in a
  live demo.

The reviewer's note on what the slide is really doing, which is worth having in your head
when you present it: *"the record is not an archive, it is the input to the next first
pass. Record → context → sharper first pass → more use → more record."* That loop is the
strongest anti-wrapper argument in the deck and it is now the subhead.

---

## Two corrections made during the rewrite

**GC AI does serve the solo lawyer.** An earlier draft claimed Harvey and GC AI both
run department-level sales motions. That is false as to GC AI: their published
Individual plan is $500/month, monthly or yearly, one seat, self-serve by card without
a demo, with a 14-day trial. The single-lawyer segment is already served. Price is not
the wedge and the deck no longer claims it is — the argument is now land-and-expand
economics and the taxonomy.

**The Harvey per-seat price was cut.** An earlier draft cited $425 a seat from a single
anonymous buyer post. Quoting a named competitor's price from one anonymous source is
indefensible under questioning, and $425 against $400 makes Themis look six percent
cheaper rather than structurally different. The five-seat minimum and the twelve-month
term survive, attributed on their face; the price does not.

---

## The caveat the reviewer would forward with this deck

> "Sole founder, no engineer, zero users, and the whole thesis rests on whether his
> first pass actually beats raw Claude — which nobody has tested yet. Worth the meeting
> anyway: seventeen years in the exact seat he's selling to, a CS master's, and a deck
> that names its own holes before you can."
