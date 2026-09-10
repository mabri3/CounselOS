# Focused follow-up research log

Research date: September 10, 2026.

Scope: two search batches of four queries each, followed by targeted reads. The research tested the propositions in `followup-plan.md`. It did not perform a general topic sweep.

## Search batch 1

1. Query: `site:occ.treas.gov customer identification program acquired accounts merger acquisition existing customer FAQ CIP`
   - Result: No direct OCC result answering the acquired-account question. Search returned the interagency CIP FAQ through FinCEN and an OCC copy of the FAQ.
   - Substantive finding: The interagency FAQ confirms that CIP applies to a person who opens a new account, that a bank’s procedures must be risk based, and that formal reliance has specific conditions. It did not directly answer the acquisition exclusion on the opened page.
   - Source: [FinCEN interagency CIP FAQ](https://www.fincen.gov/resources/statutes-regulations/guidance/interagency-interpretive-guidance-customer-identification)

2. Query: `site:fincen.gov money services business customer identification program CIP AML program requirements money transmitter`
   - Result: Useful FinCEN MSB registration, MSB status, SAR, and AML materials. A direct targeted read of the current eCFR rule supplied the operative AML-program text.
   - Substantive finding: 31 C.F.R. § 1022.210 requires each MSB to maintain a written, effective AML program that is commensurate with its risks. Its controls must address customer-identification verification to the extent applicable. The rule states specific identity requirements for providers and sellers of prepaid access. It does not impose the bank CIP rule in § 1020.220 on all nonbank money transmitters.
   - Sources: [31 C.F.R. § 1022.210](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1022/subpart-B/section-1022.210); [FinCEN MSB registration](https://www.fincen.gov/resources/money-services-business-msb-registration); [FinCEN “Am I an MSB?”](https://www.fincen.gov/am-i-msb)

3. Query: `site:consumerfinance.gov regulations 1016.11 sale transfer reuse nonpublic personal information 1016.4 successor`
   - Result: Direct CFPB Regulation P result.
   - Substantive finding: Data received under the sale exception may be used or disclosed only under an applicable exception in the ordinary course to carry out the activity covered by the exception. The regulation gives an example that bars the recipient from using an exception-supplied customer list for its own marketing. A separate initial privacy notice is due when the buyer establishes a customer relationship, subject to delayed delivery where the relationship is established without the customer’s election.
   - Sources: [12 C.F.R. § 1016.11](https://www.consumerfinance.gov/rules-policy/regulations/1016/11/); [12 C.F.R. § 1016.4](https://www.consumerfinance.gov/rules-policy/regulations/1016/4/); [12 C.F.R. § 1016.8](https://www.consumerfinance.gov/rules-policy/regulations/1016/8/)

4. Query: `site:leginfo.legislature.ca.gov Financial Code money transmission license transfer assign acquisition control advertise license`
   - Result: Failed to locate the California Money Transmission Act provisions. Results concerned unrelated professional, lending, and other licenses.
   - Substantive finding: None. No California proposition is used in the revised answer.

## Search batch 2

1. Query: `site:ffiec.gov "accounts acquired" merger "CIP" customer identification program`
   - Result: Located an older FDIC BSA examination manual hosted by FFIEC.
   - Substantive finding: The manual states that accounts acquired through acquisition, merger, purchase of assets, or assumption of liabilities are excluded from CIP because the customer did not initiate them. Its footnote limits the purchase-of-assets example where an agency-in-place or exclusive-sale arrangement gives the bank final credit approval.
   - Source: [FDIC BSA examination manual hosted by FFIEC](https://bsaaml.ffiec.gov/docs/resources/FDIC_DOCs/BSA_Manual.pdf), pages 8–9. This is an older examination manual. The current eCFR definition below is the stronger source for the basic exclusion.

2. Query: `site:fincen.gov "accounts acquired" "new account" merger CIP`
   - Result: No direct FinCEN search result for the acquisition exclusion.
   - Followed reference: A targeted read of the current definition in 31 C.F.R. § 1020.100 gave the operative text.
   - Substantive finding: For bank CIP, “account” does not include an account the bank acquires through an acquisition, merger, purchase of assets, or assumption of liabilities. A “customer” is generally a person who opens a new account. This removes automatic CIP treatment when the buyer truly acquires the account. It does not cover a customer-initiated new account or remove other AML, sanctions, fraud, or state duties.
   - Source: [31 C.F.R. § 1020.100](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100)

3. Query: `site:leginfo.legislature.ca.gov Financial Code money transmission license transfer assign acquisition control advertise`
   - Result: Failed again to locate relevant California money-transmission provisions.
   - Substantive finding: None. California remains unresolved and is not used as an example.

4. Query: `site:statutes.capitol.texas.gov Finance Code money transmission license transfer assign change control advertise`
   - Result: Direct current Texas Finance Code Chapter 152 result.
   - Substantive findings:
     - Section 152.101 bars a person from conducting, advertising, soliciting, or holding itself out as conducting money transmission unless licensed or within a stated exception.
     - A license is not transferable or assignable.
     - An authorized delegate can act within authority conferred by a written contract with a licensee.
     - The licensee must conduct a risk-based background review and maintain policies for delegate compliance. The agreement must appoint the delegate to act on behalf of the licensee and address funds and records.
     - A delegate may not use a subdelegate. Activity beyond the contract is unlicensed activity. The statute places joint liability on a person that conducts transmission for an unlicensed or nonexempt principal.
   - Source: [Texas Finance Code Chapter 152](https://statutes.capitol.texas.gov/?artSec=&chapter=FI.152&code=FI&tab=1)

## Targeted primary-source reads

- [31 C.F.R. § 1020.100](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100): current bank CIP definitions and acquisition exclusion.
- [31 C.F.R. § 1022.210](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1022/subpart-B/section-1022.210): current MSB AML-program rule.
- [31 C.F.R. § 1022.380](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1022/subpart-C/section-1022.380): each MSB generally registers; agent-only exception; facts-and-circumstances test for agency; state-law control changes and transfers above 10% can require federal re-registration.
- [12 C.F.R. § 1016.3](https://www.consumerfinance.gov/rules-policy/regulations/1016/3/): a business that regularly wires money to or from consumers is a financial institution for the stated Regulation P definition; consumer and customer status differ; isolated wire transfers do not create a continuing customer relationship in the example.
- [12 C.F.R. § 1016.4](https://www.consumerfinance.gov/rules-policy/regulations/1016/4/): initial notice, customer-relationship timing, and delayed-delivery exception when an acquisition is not at the customer’s election.
- [12 C.F.R. § 1016.8](https://www.consumerfinance.gov/rules-policy/regulations/1016/8/): revised notice and opt-out steps before specified new nonaffiliated disclosures, unless another exception applies.
- [12 C.F.R. § 1016.11](https://www.consumerfinance.gov/rules-policy/regulations/1016/11/): redisclosure and reuse limits for information received under an exception.
- [12 C.F.R. § 1016.12](https://www.consumerfinance.gov/rules-policy/regulations/1016/12/): prohibition on sharing account or access numbers with nonaffiliates for telemarketing, direct mail, or email marketing, subject to narrow exceptions.
- [12 C.F.R. § 1016.17](https://www.consumerfinance.gov/rules-policy/regulations/1016/17/): Regulation P does not displace a state law that gives greater consumer protection.

## Remaining gaps

- No target states, license types, entities, products, or funds flows were supplied. Texas is an illustration, not a fifty-state conclusion.
- The search did not produce a primary California money-transmission source. No California conclusion is made.
- No primary state source was found that authorizes the exact proposed seller-to-buyer transition model. Texas shows one possible licensed-principal/authorized-delegate structure. Each target state and contract must be checked.
- The acquired-account exclusion answers federal bank CIP only. It does not determine whether the migration is an acquisition of the same account under the real documents, or a customer-initiated opening of a new account.
- The research did not determine the current sanctions, state privacy, electronic marketing, money-transmitter transaction-record, or customer-due-diligence duties for an unidentified buyer and product. The revised answer treats these as separate workstreams and does not imply that CIP exclusion resolves them.
