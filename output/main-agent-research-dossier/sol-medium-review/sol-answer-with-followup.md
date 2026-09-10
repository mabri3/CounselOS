# Asset purchase of a US payments business: licenses and prior customer checks

## Recommendation

Do not treat the seller’s licenses or customer checks as a single package that moves with the assets.

The buyer can close before all accounts migrate if the documents and operations keep every regulated activity with a properly authorized entity. The buyer should use four separate gates:

| Phase | Default status | Release condition |
|---|---|---|
| Close | Conditional | The asset transfer does not make the buyer an unlicensed provider. Required filings, carve-outs, and transition authority are effective. |
| Migrate acquired accounts | Conditional by cohort | The receiving entity has authority. The transfer is classified correctly for federal bank CIP, and the buyer has accepted or supplemented the seller’s records under its own compliance program. |
| Enter a new market | Blocked | The exact buyer entity, state, product, customer type, and funds flow have a documented license, exemption, or authorized-principal model. |
| Promote services | Blocked for uncleared offers and states | The seller or buyer has authority to advertise, the claim accurately names the provider, and the campaign may lawfully use the customer data. |

The main follow-up finding is favorable but narrow: a bank does not have to apply federal Customer Identification Program (CIP) rules merely because it acquires an account through an acquisition, merger, asset purchase, or assumption of liabilities. The current definition expressly excludes such an acquired account. That does not excuse a customer-initiated opening of a new account. It also does not remove the buyer’s other anti-money-laundering (AML), sanctions, fraud, privacy, or state duties. [31 C.F.R. § 1020.100(a)](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100)

## 1. Closing

### Licenses

The working rule is that the buyer cannot operate under a license held by the seller’s legal entity. The supplied Goodwin practice article says state financial-services licenses cannot be transferred or acquired in an asset purchase. It also explains that state control and filing rules vary. Depending on the state, a transaction can require prior approval, advance notice, notice with regulator discretion to require approval, or a post-close filing. This is useful secondary support. The operative rule must still be confirmed for each license. [Goodwin, “The Fintech Deal Long Pole: License Change of Controls”](https://www.goodwinlaw.com/en/insights/publications/2023/08/insights-finance-ftec-the-fintech-deal-long-pole)

Texas shows why a state-specific check matters. Its current money-transmission law bars a person from conducting, advertising, soliciting, or holding itself out as conducting money transmission unless the person is licensed or within an exception. It also states that a license is not transferable or assignable. An authorized delegate can act within a written appointment from a licensee. Activity outside that appointment is unlicensed activity. This is a Texas example. It is not a fifty-state rule. [Texas Finance Code § 152.101 and Chapter 152](https://statutes.capitol.texas.gov/?artSec=&chapter=FI.152&code=FI&tab=1)

Federal MSB registration is separate from state authority. With limited exceptions, each money services business must register with FinCEN. A person acting solely as an agent of another MSB is excepted from registration, and agency status depends on all facts and circumstances. A state-law control change and a transfer above 10 percent of voting power or equity can trigger federal re-registration. Registration does not transfer state licenses or supply a state exemption. [31 C.F.R. § 1022.380](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1022/subpart-C/section-1022.380)

### Closing design

Closing can precede account migration if the buyer does not become the regulated operator for the unmigrated book. The agreement should identify, for each state and cohort:

- the legal entity that contracts with the customer;
- the entity that accepts instructions, receives money, controls the funds flow, and owes the transmission obligation;
- the license, exemption, bank authority, or authorized-delegate appointment supporting that activity;
- which assets and customer relationships transfer at close and which remain with the seller; and
- the event that ends transition service.

A transition services agreement is not authority by itself. It can work only where the governing state permits the actual model. Under the Texas example, the buyer could act as an authorized delegate only within a written appointment and on behalf of the licensed principal. The licensed principal must oversee compliance, the contract must address funds and records, and the delegate cannot use a subdelegate. The seller must remain the real licensed provider. A contract that calls the seller the provider while the buyer controls the service creates material risk.

**Close fallback:** Delay closing; exclude affected states, contracts, or customer liabilities; leave those customers with the seller; or use a valid licensed-principal model. If a low-volume state cannot be supported, block activity there or follow its surrender and run-off process. A revenue-based “critical mass” condition is useful only when uncleared states are technically and contractually excluded.

## 2. Migration and reuse of prior checks

The answer depends first on the receiving entity and second on whether the customer initiates a new account.

### A bank acquires the same accounts

For federal bank CIP, “account” excludes an account acquired through an acquisition, merger, purchase of assets, or assumption of liabilities. Therefore, a true transfer of the existing accounts does not itself require the receiving bank to run CIP again. [31 C.F.R. § 1020.100(a)(2)(ii)](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1020/subpart-A/section-1020.100)

The old FDIC examination manual found in follow-up research states the same point. It adds a useful limit: a purchase may fall outside the example where an agency-in-place or exclusive-sale arrangement gives the bank final approval before the account is created. The current regulation is the controlling support for the exclusion; the older manual helps explain the line between an acquired account and the buyer opening accounts through an agent. [FDIC BSA examination manual hosted by FFIEC, pages 8–9](https://bsaaml.ffiec.gov/docs/resources/FDIC_DOCs/BSA_Manual.pdf)

The acquisition exclusion should be documented from the account agreements and migration mechanics. It is strongest when the customer does nothing to initiate a new account and the buyer legally acquires the existing account or liability. It is weaker where the customer must apply, opt in, accept a new product, or establish a new relationship with a different account structure.

The exclusion answers only CIP. The interagency CIP guidance states that CIP is one part of a bank’s BSA/AML program and does not satisfy suspicious-activity or sanctions duties. The buyer should still screen current risk, investigate unresolved alerts, preserve required records, and apply its ongoing AML program. [FinCEN interagency CIP FAQ](https://www.fincen.gov/resources/statutes-regulations/guidance/interagency-interpretive-guidance-customer-identification)

### A bank opens a new account

If migration is legally a new account opened by the customer, the bank CIP rule applies. The receiving bank must use its written, risk-based procedures to form a reasonable belief that it knows the customer’s true identity.

The bank can use seller data as an input. Formal reliance on another financial institution is available only if:

1. reliance is reasonable under the circumstances;
2. the other institution is subject to a BSA AML-program rule and regulated by a federal functional regulator;
3. the institutions share the customer; and
4. a signed contract requires the other institution to certify annually that it has an AML program and will perform the specified parts of the bank’s CIP.

Even with reliance, the bank retains the CIP duties that were not assigned. Ordinary file access or an asset-purchase covenant is not formal reliance. [31 C.F.R. § 1020.220(a)(6)](https://www.law.cornell.edu/cfr/text/31/1020.220); [FinCEN interagency CIP FAQ](https://www.fincen.gov/resources/statutes-regulations/guidance/interagency-interpretive-guidance-customer-identification)

### The buyer is a nonbank money transmitter

The bank CIP rule does not govern a nonbank money transmitter as a bank. The current MSB rule instead requires the MSB to maintain a written, effective AML program that fits the location, size, nature, and volume of its business. Its controls must address customer-identification verification to the extent applicable. The rule gives specific identity requirements for providers and sellers of prepaid access. It does not create a general bank-style CIP safe harbor for every money transmitter. [31 C.F.R. § 1022.210](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1022/subpart-B/section-1022.210)

The receiving nonbank should compare the seller’s records with its own AML program, product rules, transaction-record duties, state requirements, and risk profile. Seller checks can be accepted as evidence when the buyer’s program and applicable rules allow it. The buyer remains responsible for its own program.

### Customer-check age and alerts

There is no general expiration period for identity verification in the researched federal bank CIP text. Age alone does not decide reuse. The migration owner should run a field-level gap review for:

- missing identity or entity data;
- weak or undocumented verification;
- expired identity documents where current policy requires a valid document;
- unresolved discrepancies, sanctions matches, fraud signals, or AML alerts;
- changed beneficial owners, controllers, address, product, geography, or expected activity; and
- seller records that cannot lawfully or reliably be transferred.

**Migration fallback:** Recollect or reverify the missing or higher-risk elements. Restrict the account while an issue is reviewed if the receiving entity’s program permits that result. Keep the customer with the seller where lawful, or do not migrate the account if the buyer cannot meet its standard. Do not repeat all checks only because the file is old, and do not accept all checks only because the seller completed them once.

## 3. New-market expansion

The buyer must run a fresh state and activity analysis before it takes a new customer or transaction. A seller license, a pending application, federal MSB registration, an acquired-account CIP exclusion, or a transition arrangement for the purchased book does not authorize new buyer business.

The regulatory owner should approve a written result for the exact:

- buyer legal entity;
- customer location rule;
- payment product and customer type;
- path and control of funds;
- role of each bank, processor, MSB, and delegate; and
- license, exemption, or written delegated authority.

Texas again gives a concrete example. New transmission and solicitation are barred unless the person is licensed or within a stated exception. Its authorized-delegate exception applies only within the scope of the written authority from the licensee. Other states may define the activity, exemptions, and agency differently.

**Expansion fallback:** Geofence the state. Block onboarding and transactions. Launch through a separately reviewed licensed principal if the state permits the model. A pending license should be treated as no authority unless the operative state rule expressly allows activity during the application.

## 4. Promotion and customer data

Promotion has two independent gates: authority to advertise the regulated service and authority to use the customer data.

First, some state laws reach promotion before the first transaction. Texas § 152.101, for example, covers advertising, solicitation, and holding out. Campaign controls should therefore use the same state, entity, and product matrix as transaction controls. Product claims must name the actual provider and must not suggest that the buyer is licensed where it is not.

Second, Regulation P permits disclosure of nonpublic personal information in connection with a proposed or actual sale, merger, transfer, or exchange of all or part of a business if the data concerns only consumers of that business or unit. That exception supports due diligence and transaction transfer. [12 C.F.R. § 1016.15(a)(6)](https://www.consumerfinance.gov/rules-policy/regulations/1016/15/)

The follow-up research defines the limit. Information received under that exception may be used or disclosed under an applicable exception in the ordinary course to carry out the activity covered by the exception. The regulation’s account-processing example says the recipient cannot use an exception-supplied customer list for its own marketing. Thus, the buyer should not use the sale exception alone for pre-migration cross-selling. [12 C.F.R. § 1016.11(a)](https://www.consumerfinance.gov/rules-policy/regulations/1016/11/)

A business that regularly wires money to or from consumers is a Regulation P “financial institution” under the stated definition. The rule distinguishes a consumer from a customer and treats isolated wire transfers differently from a continuing relationship. The actual product and relationship therefore matter. [12 C.F.R. § 1016.3](https://www.consumerfinance.gov/rules-policy/regulations/1016/3/)

When the buyer establishes a customer relationship, it generally must give its initial privacy notice no later than that time. If the buyer acquires the relationship without the customer’s election, it may deliver the notice within a reasonable time afterward. New nonaffiliated disclosures outside an exception can require a revised notice, a new opt-out notice, a reasonable opt-out period, and no opt-out by the consumer. [12 C.F.R. § 1016.4](https://www.consumerfinance.gov/rules-policy/regulations/1016/4/); [12 C.F.R. § 1016.8](https://www.consumerfinance.gov/rules-policy/regulations/1016/8/)

Regulation P also generally bars disclosure of account or access numbers to a nonaffiliate for telemarketing, direct-mail marketing, or email marketing, subject to narrow exceptions. More protective state privacy law can still apply. [12 C.F.R. § 1016.12](https://www.consumerfinance.gov/rules-policy/regulations/1016/12/); [12 C.F.R. § 1016.17](https://www.consumerfinance.gov/rules-policy/regulations/1016/17/)

**Promotion fallback:** Send only an accurate transaction or service notice. Suppress uncleared states and cohorts from offers. Do not give marketing teams account-level data received only under the sale exception. Apply the buyer’s privacy notice and any required consent or opt-out process before broader use. Channel-specific email, text, and telephone rules require a separate review because they were not resolved in this research.

## Owners and evidence

| Owner | Required decision | Evidence |
|---|---|---|
| Regulatory counsel | Authority for each close, transition, migration, expansion, and promotion state | Current statutes, regulations, regulator guidance, license conditions, exemptions, and correspondence |
| Deal counsel | What transfers and when | Asset and liability schedules, assignment rights and consents, customer terms, closing conditions, excluded-state mechanics, and transition rights |
| Compliance/BSA officer for each operating entity | Treatment of prior checks and alerts | Buyer program; seller procedure comparison; sample files; open-alert list; field-level gap report; formal reliance contract and certification if used |
| Privacy owner | Data transfer, notice, reuse, and campaign permissions | Data map; sale-exception purpose limit; seller and buyer notices; consumer/customer classification; opt-outs; state-law analysis |
| Product and operations | Technical enforcement of phase gates | Funds-flow diagram; provider labels; geofencing; state and cohort blocks; account restrictions; migration runbook |
| Seller/licensee | Continued licensed service and filings | License status; delegate appointment where allowed; regulator filings; bonds; permissible investments; reports; complaint and AML operations |
| Executive deal owner | Residual timing and scope choice | Signed matrix showing cleared, delayed, excluded, and stopped cohorts |

## Material assumptions and remaining decisions

This answer assumes a US asset purchase of a payments business that may conduct money transmission. It does not assume that the buyer is a bank, that the seller and buyer share a regulator, that an account legally transfers, or that a bank-partner or agent model applies.

The following facts can change the result and should be resolved before the relevant phase:

1. Which legal entity holds each license and which entity performs each regulated act after close?
2. Which states, customer types, products, and funds flows are in scope?
3. Does each customer’s existing legal account transfer without customer action, or does the buyer open a new account?
4. Is the buyer a bank, a nonbank MSB, an agent, a service provider, or more than one of these for different functions?
5. Are the seller’s checks complete, documented, current enough for the risk, and transferable under contract and privacy law?
6. Which alerts, discrepancies, sanctions issues, and customer changes remain open?
7. Will the buyer use transferred data only for diligence and continuity, or also for its own promotion?

Until the matrix answers these questions, the strongest practical position is: close only with enforceable carve-outs and a lawful operating model; classify migration cohort by cohort; block new-market entry; and limit promotion to accurate service communications for cleared customers.

## Source limits

The license conclusion uses one supplied secondary national overview and one current primary state example. It is not a completed fifty-state survey. The acquired-account CIP conclusion is supported by the current federal definition. The MSB conclusion is supported by the current federal MSB rules. The privacy conclusions are supported by current CFPB Regulation P pages. State privacy, sanctions, contract assignment, electronic marketing, and each state’s money-transmission rules remain separate checks because the facts needed to apply them are not known.
