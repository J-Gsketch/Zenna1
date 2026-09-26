# Zenna Route A — Candidate Operations System

**Purpose:** Recruit, screen, onboard, and manage an **independent acquisition contractor** for the approved Route A New Zealand electrician pilot.

**Authority:** This document operationalises `OFFER-SOURCE-OF-TRUTH.md` for pilot recruitment, candidate screening, and controlled prospect-handoff operations. If there is any conflict, the offer source of truth wins. It does not alter customer terms or replace the separately reviewed contractor agreement.

**Pilot constraint:** Zenna is accepting only the **first five accepted New Zealand electrician/sparky businesses**. A contractor may source and qualify interest; **Zenna Operations alone** decides acceptance, sends the official offer and payment link, handles activation and support, and determines bounty eligibility.

---

## 1. Role charter and non-negotiable boundaries

### Role outcome

The contractor identifies suitable New Zealand electrician/sparky businesses, starts a respectful short conversation, qualifies fit, records the minimum necessary information and explicit consent, and hands the prospect to Zenna Operations.

> The contractor may **only prospect, qualify, record consent, maintain an accurate pipeline record, and arrange an Operations handoff.**

### Customer fit to qualify

A prospect is in scope only where the available facts indicate:

- a New Zealand electrician/sparky business;
- **1–3 vans**;
- a working business mobile number;
- genuine inbound enquiry calls; and
- no dedicated receptionist.

The strongest fit is an owner-operator frequently on the tools, driving, or unable to answer every new customer call.

### Out-of-scope needs

Do **not** qualify the service as a fit where the business requires a full phone-answering service, call centre, guaranteed booked jobs, CRM integration, quoting, dispatch, emergency coverage, or a custom telephony build. Record the stated need accurately and let Zenna Operations determine whether to decline or defer.

### Hard boundary table

| The contractor may | The contractor must never |
|---|---|
| Build lists from permitted public sources. | Take payment, issue refunds, access Stripe, or handle payment-card data. |
| Use the approved positioning and hold a short, respectful conversation. | Configure forwarding, give technical instructions/support, or answer carrier/handset/plan compatibility questions. |
| Capture the approved qualification facts and explicit consent to an Operations handoff. | Ask for or access passwords, account PINs, customer credentials, Twilio, source code, or private systems. |
| Keep accurate, minimum-data deal records and arrange a Zenna Operations handoff. | Alter or negotiate price, billing, scope, terms, cancellation terms, or refunds. |
| State that Zenna Operations confirms availability after its check and controlled test. | Promise a response time, recovered job, revenue/financial result, conversion rate, universal support, integrations, a live person, or any unapproved capability. |
| Escalate an unanswered question to Zenna Operations. | Represent themselves as the founder personally or as a customer's employee. |

### Required spoken positioning

Use this wording without adding claims:

> “Zenna is running a small missed-call text-back pilot for Kiwi electricians. If you are on a job and cannot answer, eligible calls can be conditionally forwarded to a Zenna number, which sends the caller a message asking for their name, suburb, and job details. It is not a receptionist or booking service, and availability is confirmed after a quick operations check and test. Would you be open to a short handoff with Zenna Operations to see whether it suits your current setup?”

If asked for a promise, technical step, price change, refund, carrier compatibility answer, or support beyond that statement, the contractor must say: **“I’ll record that for Zenna Operations; they will answer it directly.”** Record the question and hand it off. No improvisation.

---

## 2. Candidate pipeline

This pipeline evaluates people for the independent acquisition-contractor role, not prospective Zenna customers. Only collect information needed to make a hiring/onboarding decision and to communicate about the process.

| Status | Definition | Owner / required action |
|---|---|---|
| `SOURCED` | Candidate identified through a permitted source; no substantive contact or application yet. | Recruitment owner sends the role summary or logs the source. |
| `INVITED` | Candidate has been invited to apply or discuss the role. | Recruitment owner records invitation date only. |
| `APPLIED` | Candidate has provided the minimum application information and agrees to be considered. | Screen for completeness and obvious hard rejects. |
| `SCREENING` | Initial screen is under way: role boundaries, communication, prospecting method, and operational discipline are being assessed. | Use the scorecard and interview question set below. |
| `INTERVIEW` | Candidate has passed initial screen and is in a structured interview. | Complete all scored criteria and red-flag check. |
| `REFERENCE / CHECK` | Only a necessary, candidate-authorised check is pending, if Zenna Operations chooses to perform one. | Do not collect unrelated personal data. |
| `SHORTLISTED` | Meets the threshold, has no reject criterion, and is awaiting final capacity/Operations decision. | Send shortlist template; do not imply engagement is final. |
| `OFFERED` | Zenna has invited the candidate to undertake the contractor role, subject to any required agreement/onboarding. | Send acceptance template and role-boundary checklist. |
| `ONBOARDING` | Candidate has accepted and is completing first-day readiness items. | Grant only the minimum approved workflow access. |
| `ACTIVE` | Contractor has acknowledged the boundaries and may prospect, qualify, record consent, and hand off. | Apply daily review ritual. |
| `DECLINED` | Candidate will not progress. | Send a brief decline; retain only the minimum process record. |
| `WITHDRAWN` | Candidate has withdrawn or cannot be reached after the defined follow-up. | Close record; do not continue outreach. |
| `PAUSED` | Decision intentionally held because pilot capacity, timing, or Operations review is pending. | State that no role is currently confirmed. |

### Candidate decision gates

1. **Initial screen:** Is the person able to prospect from permitted public sources and communicate respectfully with New Zealand trade businesses?
2. **Boundary screen:** Can they repeat, without coaching, that their role ends at prospecting, qualification, consent recording, and Operations handoff?
3. **Simulation:** Can they use the approved positioning and escalate unsupported questions rather than invent an answer?
4. **Scorecard decision:** Reach the threshold and have no critical reject criterion.
5. **Capacity decision:** Zenna Operations confirms there is a current need within the five-customer pilot. A strong candidate is not a promise of appointment.
6. **Onboarding release:** Candidate completes the first-day checklist before outreach begins.

---

## 3. Data-minimising CSV / Sheet schema

Use separate tabs or CSV exports. Do not collect passwords, account PINs, payment-card details, credentials, technical configuration details, or unnecessary personal data. Enter notes as concise business facts, not speculative or sensitive commentary.

### Tab A — `Contractor_Candidates`

| Field / CSV header | Required | Allowed value / purpose |
|---|---:|---|
| `candidate_id` | Yes | Internal unique ID; do not use government ID. |
| `status` | Yes | One candidate status from Section 2. |
| `first_name` | Yes | Candidate communication. |
| `last_name_or_initial` | Optional | Use only if necessary to distinguish candidates. |
| `email` | Yes | Process communication. |
| `mobile` | Optional | Only if the candidate volunteers it for scheduling. |
| `nz_region` | Yes | Broad operating area/time-zone suitability; no street address. |
| `source` | Yes | Permitted recruitment source or referral channel. |
| `prospecting_experience_summary` | Yes | Brief role-relevant summary only. |
| `public_source_method_confirmed` | Yes | `yes`, `no`, or `pending`; confirms permitted-source understanding. |
| `boundary_acknowledged` | Yes | `yes`, `no`, or `pending`; acknowledges no payment, technical setup, credentials, or support. |
| `score_total` | At decision | Integer 0–100. |
| `critical_reject` | At decision | `none` or controlled reject code from Section 4; avoid free-text personal judgments. |
| `decision_date` | At decision | Date. |
| `decision_owner` | At decision | Zenna Operations decision-maker. |
| `next_action` | Yes | Minimal operational action, e.g. `book interview`, `send decline`, `onboard`. |
| `next_action_due` | Optional | Date needed to prevent missed follow-up. |

### Tab B — `Candidate_Assessments`

One row per interview or simulation. Keep structured evidence short and role-relevant.

| Field / CSV header | Required | Allowed value / purpose |
|---|---:|---|
| `assessment_id` | Yes | Internal unique ID. |
| `candidate_id` | Yes | Link to `Contractor_Candidates`. |
| `assessment_date` | Yes | Date. |
| `assessor` | Yes | Assessment owner. |
| `approved_positioning_result` | Yes | `pass`, `needs_coaching`, or `fail`. |
| `boundary_simulation_result` | Yes | `pass`, `needs_coaching`, or `fail`. |
| `qualification_simulation_result` | Yes | `pass`, `needs_coaching`, or `fail`. |
| `score_compliance_accuracy` | Yes | 0–30. |
| `score_boundary_discipline` | Yes | 0–25. |
| `score_prospecting_respect` | Yes | 0–15. |
| `score_qualification_judgment` | Yes | 0–15. |
| `score_record_handoff_discipline` | Yes | 0–15. |
| `critical_reject_code` | Yes | `none` or a code in Section 4. |
| `evidence_note` | Yes | One factual sentence supporting the result; no irrelevant personal information. |
| `recommended_status` | Yes | Candidate status recommendation. |

### Tab C — `Route_A_Prospects`

This is the minimum customer-deal record the contractor must create after a prospect conversation. It operationalises the offer’s required facts. A unique `deal_id` is required for attribution, acceptance review, and any bounty decision.

| Field / CSV header | Required | Allowed value / purpose |
|---|---:|---|
| `deal_id` | Yes | Unique Zenna pipeline deal ID; never reuse for another business. |
| `contractor_id` | Yes | Attribution to the active contractor. |
| `created_at` | Yes | Record timestamp. |
| `business_name` | Yes | Required customer minimum. |
| `contact_name` | Yes | Required customer minimum. |
| `work_mobile` | Yes | Required customer minimum; business/work contact only. |
| `business_email` | Only if volunteered | Do not request it as a condition of interest. |
| `service_area` | Yes | Required customer minimum; suburb/region level only. |
| `business_type` | Yes | `electrician/sparky` or `not confirmed`; no inferred trade classification. |
| `van_count_band` | Yes | `1–3`, `outside 1–3`, or `not confirmed`; do not collect vehicle details. |
| `inbound_enquiry_calls` | Yes | `yes`, `no`, or `not confirmed`. |
| `dedicated_receptionist` | Yes | `yes`, `no`, or `not confirmed`. |
| `current_missed_call_process` | Yes | Brief factual description, as required by the offer. |
| `interest_status` | Yes | One prospect status below. |
| `operations_handoff_consent` | Yes | `yes`, `no`, or `pending`; explicit consent is required before handoff. |
| `consent_recorded_at` | When `yes` | Date/time and channel, e.g. `2026-09-27 phone`; no call recording or excess narrative. |
| `fit_note` | Yes | Concise, factual fit/risk note. |
| `question_for_operations` | Only if raised | Exact unresolved promise, technical, price, refund, carrier, or support question. |
| `handoff_requested_at` | When consented | Timestamp sent to Zenna Operations. |
| `operations_outcome` | Operations only | `pending`, `accepted`, `declined`, `deferred`, `official offer sent`, `payment cleared`, `test passed`, `live`, or `closed`. Contractor must not change payment/test/live fields. |
| `last_updated_at` | Yes | Timestamp of most recent permitted update. |

### Prospect status definitions

| Status | Definition and permitted contractor action |
|---|---|
| `IDENTIFIED` | Public-source list entry only. No claim of interest or consent. |
| `CONTACTED` | Outreach attempted or short conversation begun; do not store unnecessary conversation detail. |
| `QUALIFYING` | Contractor is confirming the minimum fit facts. |
| `NOT_A_FIT` | Known facts fall outside the pilot or reveal an out-of-scope need. Record only a concise business reason. |
| `INTERESTED_NO_CONSENT` | Prospect expressed interest but has not explicitly agreed to an Operations handoff. Do not hand off contact details as a consented lead. |
| `CONSENTED_FOR_HANDOFF` | Prospect has explicitly agreed to Zenna Operations contact and the record has the required facts. Submit handoff. |
| `HANDED_TO_OPERATIONS` | Consent and facts submitted to Zenna Operations. Contractor stops selling and does not handle payment, configuration, credentials, or support. |
| `OPERATIONS_REVIEW` | Zenna Operations is checking fit, territory, capacity, and readiness. Contractor does not promise acceptance or availability. |
| `CLOSED_NO_GO` | Prospect declined, withdrew consent, was unsuitable, duplicate, or Operations declined/deferred. Do not re-contact unless lawful and appropriate. |

**Consent standard:** Consent is explicit only when the named contact affirmatively agrees to a Zenna Operations handoff about this pilot. A business being publicly listed, taking a call, or expressing general curiosity is **not** handoff consent.

---

## 4. 100-point contractor scorecard

Score only demonstrated, job-relevant evidence. A candidate must score **75/100 or higher**, score at least **20/30** on Compliance Accuracy and **18/25** on Boundary Discipline, and have **no critical reject** to be shortlisted.

| Criterion | Points | What earns full credit |
|---|---:|---|
| **Compliance and offer accuracy** | 30 | States the service accurately as a concierge missed-call text-back pilot; uses the approved positioning; distinguishes it from receptionist, booking, quoting, CRM, and guaranteed-outcome services; never adds unsupported promises. |
| **Boundary discipline and escalation** | 25 | Clearly limits the role to prospecting, qualification, consent, recordkeeping, and handoff; promptly escalates technical, payment, pricing, refund, compatibility, and support questions to Zenna Operations. |
| **Respectful prospecting practice** | 15 | Uses permitted public sources, targets relevant NZ trade businesses, communicates briefly and respectfully, and can stop outreach when asked. |
| **Qualification judgement** | 15 | Correctly confirms electrician/sparky status, 1–3 vans, work mobile, genuine inbound calls, no dedicated receptionist, current missed-call process, and out-of-scope needs without over-collecting data. |
| **Recordkeeping, consent, and handoff discipline** | 15 | Captures the required minimum fields, distinguishes interest from explicit consent, assigns/uses a unique deal ID, writes factual notes, and hands off cleanly without continuing into Operations work. |
| **Total** | **100** | **Shortlist at 75+ only, subject to minimum category scores and no critical reject.** |

### Critical reject criteria

Mark as rejected regardless of point total if the candidate demonstrates, proposes, or refuses to rule out any of the following:

1. **Payment or credential boundary breach:** taking payment, issuing refunds, accessing Stripe, payment-card data, passwords, account PINs, customer credentials, Twilio, source code, or private systems.
2. **Technical/support boundary breach:** configuring forwarding, giving technical support/instructions, or claiming to verify carrier, handset, plan, forwarding, or call-type compatibility.
3. **Misrepresentation:** promising a response time, booked job, recovered-job rate, revenue/financial outcome, conversion outcome, universal support, integration, a live person, or an unapproved capability; changing the price, billing, scope, terms, or cancellation terms.
4. **Consent or record integrity breach:** handing off without explicit consent, knowingly falsifying qualification facts/notes, using duplicate deal IDs, or attempting to claim credit for another contractor’s lead.
5. **Identity/role misrepresentation:** presenting as the founder personally or as the customer’s employee.
6. **Unpermitted or disrespectful prospecting:** refusing to use permitted public sources and respectful outreach, or indicating willingness to use deceptive, coercive, or unlawful methods.
7. **Cannot perform the core boundary simulation:** after clarification, still cannot state that Operations—not the contractor—handles acceptance, official offer/payment, configuration, controlled testing, service, billing, and support.

**Decision codes:** `CR-PAYMENT-CREDENTIALS`, `CR-TECH-SUPPORT`, `CR-MISREPRESENTATION`, `CR-CONSENT-INTEGRITY`, `CR-ROLE-IDENTITY`, `CR-PROSPECTING-CONDUCT`, `CR-BOUNDARY-FAIL`.

---

## 5. Structured interview and simulation questions

Ask each active candidate the same core questions. Score the answer against the rubric; do not seek sensitive personal information.

| Question | What a strong answer demonstrates | Concern requiring follow-up or rejection |
|---|---|---|
| 1. “In one sentence, what is the Route A service?” | A missed-call text-back pilot for eligible unanswered inbound calls conditionally forwarded to an approved Zenna number; it asks caller for name, suburb, job details and alerts the trade business. | Calls it a receptionist, booking agent, call centre, lead guarantee, AI voice agent, or CRM. |
| 2. “Give the approved 30-second positioning to a Kiwi sparky.” | Accurate delivery of the required wording and an invitation to an Operations handoff. | Adds promises about speed, bookings, revenue, compatibility, or live answering. |
| 3. “Which facts must you qualify before a handoff?” | NZ electrician/sparky; 1–3 vans; working business mobile; genuine inbound enquiry calls; no dedicated receptionist; current missed-call process; interest and explicit handoff consent. | Omits consent or core fit facts; asks for credentials, payment details, or unnecessary personal information. |
| 4. “A prospect asks whether their carrier and handset will work. What do you do?” | Records the exact question and hands it to Zenna Operations; says availability is confirmed only after Operations checks and controlled test. | Guesses, promises support, requests account access, or offers to configure forwarding. |
| 5. “A prospect says, ‘Can you take the NZ$250 now and set it up?’ What do you say?” | Says Zenna Operations alone sends the official offer/payment link; billing begins only after acceptance and payment clearance; contractor does not take payment or set up. | Accepts payment, discusses collecting card details, or starts configuration. |
| 6. “What is the price and what must you not change?” | NZ$250/month plus GST only if legally applicable; monthly recurring through official link; contractor never changes price, billing, scope, terms, cancellation or refunds. | Negotiates, discounts, promises a refund, or changes payment cadence. |
| 7. “What is the difference between interest and consent?” | Interest is not consent; consent must be an affirmative agreement for Zenna Operations to contact/handoff, recorded with date/time and channel. | Treats public listing, a call, or general curiosity as consent. |
| 8. “Name two examples of an out-of-scope customer need.” | Any of receptionist/call-centre/guaranteed-booked-jobs/CRM/quoting/dispatch/emergency/custom telephony requirements. | Attempts to sell or promise any excluded capability. |
| 9. “Walk through your workflow after a prospect agrees to a handoff.” | Records required minimum facts and consent against unique deal ID; submits to Operations; Operations handles acceptance, offer/payment, configuration, testing, service, billing, and support. | Continues to close payment, arrange technical setup, handle credentials, or support the customer. |
| 10. “How would you build your prospect list and protect data?” | Permitted public sources; minimum business/contact data; accurate factual records; no passwords/PINs/card details/unnecessary personal data. | Scraping or sourcing practices they cannot explain, collection of sensitive information, or indiscriminate data storage. |

### Mandatory live simulations

1. **Positioning simulation:** Candidate delivers the approved positioning in under 30 seconds.
2. **Escalation simulation:** Interviewer asks a carrier/forwarding question. Candidate must record and refer it to Zenna Operations without answering technically.
3. **Consent simulation:** Candidate distinguishes “sounds interesting” from explicit approval for Operations to contact the business.
4. **Payment boundary simulation:** Interviewer offers payment/card details. Candidate must decline to collect them and route to the official Operations process.
5. **Pipeline simulation:** Candidate creates a minimal, accurate `CONSENTED_FOR_HANDOFF` record using only the specified prospect fields.

A critical error in any mandatory simulation is a critical reject unless it is an interviewer clarification issue rather than a candidate’s conduct or judgement.

---

## 6. Candidate signals

### Green flags

- Repeats the role boundary unprompted: **prospect, qualify, record consent, hand off**.
- Gives the approved positioning accurately and explicitly says it is **not** a receptionist or booking service.
- Treats Operations acceptance and controlled testing as prerequisites, not promises.
- Separates expressed interest from explicit consent and asks permission before handing off.
- Uses concise factual notes and asks why each data field is necessary.
- Will stop rather than guess when asked about price changes, refunds, technical details, carrier support, payment, or service support.
- Understands the pilot has limited capacity and does not imply every lead will be accepted.
- Is comfortable stating their independent role and does not claim to be the founder or customer’s employee.

### Red flags

- “I can close it by taking a deposit/card and we can sort the rest out.”
- “I’ll log into their account or guide them through forwarding while we are on the phone.”
- “It works on every carrier/phone,” “you will never miss a lead,” or any guarantee about results, speed, jobs, revenue, or conversion.
- Calls the offering a live answering service, booking system, CRM, call centre, or emergency service.
- Wants to negotiate the NZ$250 price, GST treatment, recurring billing, cancellation, or refunds.
- Records a lead as consented merely because the business is public, answered the call, or sounds generally interested.
- Uses vague, inflated, derogatory, sensitive, or speculative pipeline notes.
- Wants access to customer credentials, payment systems, Twilio, source code, or other private systems.
- Claims to speak as the founder or an employee of a prospect.
- Believes a paid or verbally positive lead is automatically activated; activation is only after Operations accepts, payment clears, and the controlled test passes.

---

## 7. First-day onboarding checklist

**Owner:** Zenna Operations. Do not mark the contractor `ACTIVE` until every applicable item is complete.

### Role, claims, and data

- [ ] Contractor confirms their scope in writing: prospect, qualify, record explicit consent, keep the approved pipeline record, and arrange Operations handoff only.
- [ ] Contractor acknowledges all prohibitions in Section 1, particularly no payment, refunds, Stripe, credentials, Twilio, source code, private systems, technical setup, or customer support.
- [ ] Contractor practises and passes the approved 30-second positioning.
- [ ] Contractor can state that the service is neither receptionist, booking, quoting, CRM, call centre, emergency coverage, nor custom telephony.
- [ ] Contractor confirms that availability is only confirmed after Zenna Operations’ check and controlled activation test.
- [ ] Contractor is briefed on the fixed pilot price: **NZ$250/month plus GST only if legally applicable**, recurring via official Zenna payment link; no contractor changes to price/billing/scope/terms/cancellation/refunds.
- [ ] Contractor completes the four boundary simulations in Section 5, including payment and technical escalation.
- [ ] Contractor receives the escalation statement and knows to record—not answer—unsupported questions.
- [ ] Contractor acknowledges minimum-data rules: never request passwords, PINs, card details, credentials, or unnecessary personal data.

### Workflow readiness

- [ ] Contractor is given the approved, minimum-access method for maintaining the required Zenna pilot record; access is limited to their assigned records and no customer/Zenna technical or payment systems.
- [ ] Contractor can create/use a unique `deal_id` and knows duplicates, unqualified, unaccepted, refunded, or misrepresented sales are not bounty-payable.
- [ ] Contractor can complete a record with business name, contact name, work mobile, service area, current missed-call process, interest status, explicit consent status, deal ID, and process milestones.
- [ ] Contractor knows a business email is recorded only if volunteered.
- [ ] Contractor can distinguish `INTERESTED_NO_CONSENT`, `CONSENTED_FOR_HANDOFF`, and `HANDED_TO_OPERATIONS`.
- [ ] Contractor knows that, after handoff, Zenna Operations owns acceptance, official offer/payment, consent-based configuration, controlled test, live status, and service/billing support.
- [ ] Contractor knows bounty milestones are Operations-controlled: NZ$125 when payment clears, account is accepted, controlled test passes, and no material sales misrepresentation is found; NZ$125 when the customer remains active for 30 days with no refund, chargeback, cancellation, or material onboarding misrepresentation.
- [ ] Zenna Operations assigns the first review time and marks the candidate `ACTIVE`.

---

## 8. Daily review ritual

### Contractor end-of-day update (5–10 minutes)

Before the agreed daily cutoff, the contractor reviews only their assigned records and submits:

1. **Activity:** number of permitted public-source prospects identified, contacts attempted, and conversations held.
2. **Pipeline movement:** each deal ID moved, its current prospect status, and its next action.
3. **Handoff readiness:** every `CONSENTED_FOR_HANDOFF` record with all required facts and explicit consent timestamp/channel.
4. **Escalations:** exact unanswered questions about promises, technical steps, price changes, refunds, carrier compatibility, or support—without attempting an answer.
5. **Data hygiene check:** confirmation that no credentials, PINs, card data, payment information, or unnecessary personal data were requested or entered.
6. **Boundary exceptions:** any prospect request for payment, setup, support, or guarantee; route immediately to Zenna Operations and record the routing.

### Zenna Operations review (10–15 minutes)

1. Check every new record for a unique deal ID, minimum fields, factual notes, and explicit consent before accepting a handoff.
2. Return incomplete or consent-missing records to `QUALIFYING` or `INTERESTED_NO_CONSENT`; do not treat them as a handoff.
3. Review the exact escalation questions and respond directly to the prospect where appropriate.
4. Confirm no contractor has touched payment, configuration, credentials, technical support, or customer support.
5. Sample the day’s positioning/notes for unsupported claims, price/billing changes, or misrepresentation.
6. Update Operations-only outcomes. Do not ask the contractor to perform acceptance, official offer/payment, configuration, testing, live-status confirmation, billing, or support work.
7. For any suspected critical breach, pause new outreach, preserve the minimal factual record, investigate, and determine whether to move the contractor to `DECLINED`/inactive status.

### Immediate escalation triggers (do not wait for daily review)

- Prospect offers payment or provides payment-card information.
- Prospect offers credentials, PINs, account access, or asks the contractor to change forwarding.
- Prospect asks for a technical compatibility, refund, price change, guarantee, booking, support, or emergency-service answer.
- Prospect withdraws consent.
- Duplicate deal, suspected inaccurate record, or contractor claim about a bounty is identified.

The contractor’s immediate action is always: **record the factual issue, stop short of an answer or action outside scope, and hand it to Zenna Operations.**

---

## 9. Short candidate communication templates

Use these only for contractor recruitment. They do not change any service offer or create an employment relationship. Keep the candidate’s reply contact details to the minimum necessary.

### Shortlist

**Subject:** Zenna Route A contractor shortlist

Hi [First name],

Thank you for speaking with us. We have shortlisted you for the Route A independent acquisition-contractor role, subject to final pilot capacity and Operations review.

The role is strictly limited to prospecting from permitted public sources, qualifying suitable NZ electrician/sparky businesses, recording explicit consent, keeping the minimum pipeline record, and handing prospects to Zenna Operations. It does not include payment, technical setup, credentials, or customer support.

Please confirm you remain interested and available for the next step.

Regards,  
Zenna Operations

### Decline

**Subject:** Update on the Zenna Route A contractor process

Hi [First name],

Thank you for your time and interest in the Route A contractor role. We will not be progressing your application at this time.

This pilot requires a very specific, tightly bounded workflow: permitted-source prospecting, fit qualification, explicit-consent recording, accurate pipeline records, and Operations handoff only. We appreciate your interest and wish you well.

Regards,  
Zenna Operations

### Acceptance / onboarding invitation

**Subject:** Zenna Route A contractor onboarding

Hi [First name],

We are pleased to invite you to proceed with onboarding for the Route A independent acquisition-contractor role, subject to completion of the agreed onboarding requirements.

Before any outreach, you must acknowledge that your role is limited to prospecting, qualification, consent recording, accurate pipeline records, and handoff to Zenna Operations. You must not take payment, access payment systems or credentials, provide technical setup/support, or handle customer support. Zenna Operations alone handles acceptance, the official offer and payment link, configuration, controlled testing, billing, and support.

Please reply to confirm that you accept these boundaries. We will then send the first-day checklist and review time.

Regards,  
Zenna Operations

---

## 10. Operating quality checks

| Check | Frequency | Pass standard |
|---|---|---|
| Candidate scorecard audit | Every candidate decision | Arithmetic correct; ≥75 total; Compliance ≥20; Boundary Discipline ≥18; no critical reject. |
| Consent audit | Every proposed handoff | Explicit consent, date/time/channel, required prospect fields, and unique deal ID are present. |
| Claim audit | Daily sample and every escalation | No promise, scope expansion, price/billing alteration, technical answer, or representation breach. |
| Data-minimum audit | Daily | No passwords, PINs, payment/card data, credentials, or unnecessary personal data in records. |
| Contractor scope audit | Daily and on any exception | Contractor has not touched payment, configuration, credentials, technical support, customer support, or Operations-only statuses. |
| Bounty evidence audit | At each milestone | Unique deal ID and objective milestone evidence only; Operations decides eligibility. |

**Final operating rule:** A qualified, consented prospect is not an accepted customer. Zenna Operations may decline or defer for capacity, technical, compliance, or fit reasons. Billing begins only after account acceptance and payment clearance; a customer is live only after a successful, documented controlled test.
