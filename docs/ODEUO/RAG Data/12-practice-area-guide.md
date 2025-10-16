# Practice Area Customization Guide

## Overview

While ODEUO's AI Voice Receptionist provides strong baseline functionality for all law firms, each practice area has unique intake requirements, terminology, urgency protocols, and client communication needs. This guide details how ODEUO is customized for different legal specialties to maximize effectiveness.

**Universal Principle:** The AI is configured to understand your specific practice area's:
- Common case types and terminology
- Typical client concerns and questions
- Qualification criteria
- Urgency and deadline awareness
- Appropriate information gathering
- Ethical boundaries and sensitivities

---

## Personal Injury Law

### Practice Overview
Personal injury practices handle accident cases, medical malpractice, premises liability, product liability, and wrongful death. Key characteristics:
- High case values ($20K-$500K+)
- Time-sensitive (statute of limitations, evidence preservation)
- Competing firms aggressively pursue same leads
- Emotional clients dealing with trauma and injury
- Contingency fee model (no upfront payment)

### Custom AI Configuration

#### Greeting & Tone
**Standard Greeting:**
"Thank you for calling [Firm Name]. This is [AI Name]. I understand you may be going through a difficult time, and I'm here to help. How can I assist you today?"

**Tone Settings:**
- Empathetic and supportive
- Professional but warm
- Patient with emotional callers
- Urgent when situation warrants
- Reassuring about firm's ability to help

#### Qualification Questions

**Initial Assessment:**
1. "Can you briefly tell me what happened?"
2. "When did this incident occur?"
3. "Were you injured in this incident?"
4. "Have you seen a doctor or received medical treatment?"

**Injury Details:**
5. "What injuries did you sustain?"
6. "Are you still receiving medical treatment?"
7. "Did you miss work due to your injuries?"

**Liability & Documentation:**
8. "Who do you believe was at fault?"
9. "Was there a police report filed?"
10. "Do you have photos of the accident scene or your injuries?"
11. "Do you have insurance information for all parties involved?"

**Legal Status:**
12. "Have you spoken with any other attorneys about this case?"
13. "Have you signed anything with an insurance company?"
14. "Has there been any settlement offer?"

**Disqualifying Factors:**
- Statute of limitations expired (AI knows limitations by state and case type)
- No clear liable party
- Injuries too minor (configurable threshold)
- Already settled or released claims
- Conflicts of interest

#### Urgency Protocol

**Immediate Transfer to Attorney:**
- Statute of limitations deadline within 30 days
- Accident occurred today (evidence preservation critical)
- Insurance company pressuring for statement/settlement
- Caller being contacted by opposing attorney
- Serious/catastrophic injuries requiring immediate action

**Same-Day/Next-Day Consultation:**
- Recent accident (within 1-2 weeks)
- Ongoing medical treatment
- Lost wages mounting
- Insurance company involvement

**Standard Consultation (3-7 days):**
- Case evaluation for older incidents
- Exploring legal options
- Second opinion requests

#### Case Type Customization

**Motor Vehicle Accidents:**
- Car, truck, motorcycle, bicycle, pedestrian
- Questions about traffic violations, police report, witnesses
- Insurance information for all vehicles
- Whether caller was driver, passenger, or pedestrian

**Slip and Fall / Premises Liability:**
- Where incident occurred (store, restaurant, private property)
- What caused the fall (wet floor, uneven surface, poor lighting)
- Whether hazard was known or should have been known
- Whether incident was reported to property owner
- Photos of hazard and injuries

**Medical Malpractice:**
- Type of medical procedure or treatment
- Healthcare provider/facility name
- What went wrong / unexpected outcome
- Whether obtained medical records
- Timeline of treatment
- **Note:** Often requires more complex evaluation; typically transfer to attorney

**Product Liability:**
- Product type and brand
- How product malfunctioned or caused injury
- Whether product still available for inspection
- Whether reported to manufacturer
- Proof of purchase

**Wrongful Death:**
- **High sensitivity protocol activated**
- Relationship to deceased
- Cause of death
- Whether autopsy performed
- Other family members involved
- Immediate transfer or priority consultation scheduling

#### Information Collection

**Critical Data Points:**
- Full name and contact information
- Incident date, time, location
- Detailed incident description
- Injury type and severity
- Medical treatment received and ongoing
- Medical providers' names
- Police report number (if applicable)
- Insurance company names and claim numbers
- Photos/videos of scene or injuries
- Witness names and contact information
- Current employment status
- Lost wages to date
- Opposing party information
- Whether represented by counsel
- Any documents signed

**Documents to Request:**
- Police report
- Medical records
- Photos of accident scene
- Photos of injuries
- Insurance correspondence
- Estimate for vehicle damage (if applicable)
- Pay stubs (for lost wages)

#### Competitive Awareness

Personal injury is highly competitive. AI is trained to:
- Move quickly to book consultations (often same-day or next-day)
- Emphasize firm's experience and success record
- Provide immediate value (answer questions, explain process)
- Create urgency: "We'd like to meet with you as soon as possible to protect your rights"
- Overcome hesitation: "There's no cost to meet with us, and we only get paid if we win your case"

#### Ethical Boundaries

**AI NEVER:**
- Promises specific dollar amounts or settlements
- Guarantees case outcomes
- Provides legal advice about case viability
- Encourages filing frivolous claims
- Solicits clients (only responds to inbound)
- Gives medical advice

**AI DOES:**
- Explain general process and timeline
- Discuss contingency fee structure in general terms
- Emphasize importance of timely consultation
- Provide information about statute of limitations

### Example Call Flow

**Caller:** "I was in a car accident last week and I'm hurt."

**AI:** "I'm very sorry to hear that. Let me get some information so we can help you. First, are you in a safe place to talk right now, and are you okay?"

**Caller:** "Yes, I'm home."

**AI:** "Good. When exactly did the accident happen?"

**Caller:** "Last Tuesday, October 8th."

**AI:** "And you mentioned you were hurt—have you seen a doctor?"

**Caller:** "Yes, I went to the ER that day. They said I have whiplash and back pain."

**AI:** "I see. Are you still experiencing pain, and are you continuing with any treatment?"

**Caller:** "Yes, I'm in a lot of pain. I have a follow-up appointment with an orthopedist next week."

**AI:** "I understand. Can you tell me briefly how the accident happened?"

**Caller:** "I was stopped at a red light and someone hit me from behind."

**AI:** "Was a police report filed?"

**Caller:** "Yes, the police came to the scene."

**AI:** "That's good. Do you have the police report number or the other driver's insurance information?"

**Caller:** "I have their insurance info, not sure about the report number."

**AI:** "That's fine. Have you been contacted by any insurance companies?"

**Caller:** "Yes, the other driver's insurance called me yesterday asking for a statement."

**AI:** "It's important that you speak with one of our attorneys before providing any statement to the insurance company. Let me get you scheduled for a consultation as soon as possible. Our consultations are free, and we work on a contingency basis—meaning you don't pay us anything unless we win your case. Would tomorrow work for you, or would later this week be better?"

**Caller:** "Tomorrow would be great."

**AI:** "Perfect. I have availability at 10am, 2pm, or 4pm tomorrow. Which works best?"

**Caller:** "2pm is good."

**AI:** "Excellent. I have you scheduled for tomorrow, October 16th at 2pm with [Attorney Name] at our office. You'll receive a confirmation email and text with the address and directions. In preparation for the meeting, please bring any documents you have—the police report, medical records, photos of the accident, and insurance information. Is there anything else I can help you with today?"

**Caller:** "No, that's great. Thank you."

**AI:** "You're very welcome. We're here to help you through this, and we'll see you tomorrow at 2pm. Take care."

---

## Family Law

### Practice Overview
Family law encompasses divorce, child custody, child support, spousal support/alimony, property division, prenuptial agreements, adoption, and domestic violence matters. Key characteristics:
- Highly emotional and personal situations
- Sensitive subject matter requiring discretion
- Children's welfare often at stake
- Financial complexities
- Time-sensitive matters (custody emergencies, protective orders)
- Diverse case values ($5K-$100K+)

### Custom AI Configuration

#### Greeting & Tone
**Standard Greeting:**
"Thank you for calling [Firm Name]. This is [AI Name]. I know family matters can be very difficult, and I want you to know you're in a safe, confidential space here. How may I help you today?"

**Tone Settings:**
- Compassionate and non-judgmental
- Calm and reassuring
- Patient and understanding
- Discrete and confidential
- Supportive but professional
- Trauma-informed for domestic violence situations

#### Qualification Questions

**Initial Assessment:**
1. "Can you tell me what brings you to us today?"
2. "What type of family law matter are you facing?" (divorce, custody, support, etc.)

**For Divorce:**
3. "Are you and your spouse currently living together?"
4. "How long have you been married?"
5. "Do you have children together? If so, how many and what are their ages?"
6. "Has divorce been discussed between you and your spouse?"
7. "Do you know if your spouse has consulted with an attorney?"
8. "Are there significant assets to divide?" (house, retirement accounts, businesses, etc.)
9. "Is this expected to be contested or potentially amicable?"

**For Custody/Child Support:**
10. "What is your current custody arrangement?"
11. "Are you seeking to establish custody or modify existing custody?"
12. "What are your concerns about the current situation?"
13. "Are the children safe in their current situation?"
14. "Is there a current court order in place?"

**For Domestic Violence:**
**[EMERGENCY PROTOCOL ACTIVATED]**
15. "Are you in a safe location right now?"
16. "Are you or your children in immediate danger?"
17. "Do you need emergency assistance?" (If yes, immediate transfer or 911 guidance)
18. "Have there been previous incidents?"
19. "Has law enforcement been involved?"
20. "Do you need a protective order?"

#### Urgency Protocol

**Immediate Attorney Transfer:**
- Caller or children in immediate danger
- Active domestic violence situation
- Emergency custody needed (parent fleeing with child, etc.)
- Imminent court deadline (hearing tomorrow, etc.)
- Protective order expiring
- Child welfare services involved

**Same-Day Consultation:**
- Domestic violence (once safe)
- Emergency custody concerns
- Spouse has filed and deadline approaching
- Being locked out of home/accounts
- Child safety concerns

**Priority Consultation (1-3 days):**
- Spouse just announced divorce intent
- Received divorce papers
- Contemplating filing
- Child support enforcement needed

**Standard Consultation (3-7 days):**
- Exploring divorce options
- Modification of existing orders
- Prenuptial agreement
- Uncontested divorce

#### Case Type Customization

**Divorce:**
- Contested vs. uncontested
- Length of marriage (affects alimony)
- Asset complexity
- Children involved
- Domestic violence history
- Each party's employment/income

**Child Custody:**
- Physical custody vs. legal custody
- Sole vs. joint custody
- Parenting time schedule
- Child's age and needs
- Each parent's involvement history
- Safety concerns
- Geographic considerations
- School and stability

**Child Support:**
- Current support order status
- Income of both parents
- Number of children
- Custody arrangement
- Health insurance
- Childcare costs
- Enforcement issues (if not paying)

**Spousal Support/Alimony:**
- Length of marriage
- Income disparity
- Standard of living during marriage
- Employability of each spouse
- Age and health factors
- Temporary vs. permanent support

**Modifications:**
- What needs to be modified (custody, support, etc.)
- Reason for modification (substantial change in circumstances)
- Time since original order
- Documentation of changed circumstances

**Protective Orders:**
- Type of relationship with abuser
- History of abuse
- Recent incidents
- Evidence available
- Whether police involved
- Children's involvement

**Adoption:**
- Type (step-parent, private, international, foster)
- Age of child
- Birth parents' status/rights
- Home study status
- Timeline expectations

#### Information Collection

**Critical Data Points:**
- Full name and contact information (**privacy note:** may use alternate phone if safety concern)
- Spouse/other party name
- Marriage date and length
- Children (names, ages, current custody)
- Current living situation
- Employment and income (both parties)
- Significant assets (home, accounts, retirement, business)
- Whether either party has attorney
- Whether papers have been filed
- Upcoming court dates
- Prior court orders (divorce, custody, support, protective orders)
- History of domestic violence
- Concerns about children's welfare

**Sensitive Information Handling:**
- AI acknowledges sensitivity: "I know this is difficult to talk about"
- Gives permission to not answer: "You don't have to share anything you're not comfortable with now—we can discuss in detail during consultation"
- For domestic violence: Confirms safe location before continuing

**Documents to Request:**
- Marriage certificate
- Prior court orders
- Financial records (pay stubs, tax returns, bank statements)
- Property deeds/mortgage documents
- Retirement account statements
- Business records if applicable
- Police reports (if domestic violence)
- Child's school records
- Medical records (if relevant to custody)

#### Special Considerations

**Children's Welfare Priority:**
- AI always prioritizes children's safety
- Flags any mention of abuse, neglect, substance abuse
- Ensures appropriate urgency for child safety concerns

**Financial Transparency:**
- Discuss fees clearly and early
- Retainer amounts for different services
- Payment plans available
- Fees for uncontested vs. contested
- Legal aid referrals if financially unable

**Confidentiality Emphasis:**
- Reassure about privacy and discretion
- Confirm safe contact methods
- Offer to use alternate phone/email if needed
- Can schedule calls at specific safe times

**Emotional Support:**
- Validate feelings: "This is a very difficult situation"
- Normalize emotions: "It's completely understandable to feel overwhelmed"
- Provide hope: "We've helped many families through this"
- Set realistic expectations: "The process takes time, but we'll guide you through every step"

#### Ethical Boundaries

**AI NEVER:**
- Takes sides or makes judgments about spouse/other party
- Provides legal advice about case strategy
- Discusses specific custody outcomes
- Comments on "who's right" in the dispute
- Makes predictions about judge's decisions
- Provides counseling or therapy (refers to professionals)
- Discusses specific financial settlement amounts

**AI DOES:**
- Explain general process and timeline
- Discuss types of custody and support
- Provide overview of what courts consider
- Discuss fee structure
- Schedule consultations
- Express empathy and support
- Ensure immediate safety if domestic violence

### Example Call Flow (Divorce)

**Caller:** "I need to talk to someone about getting a divorce."

**AI:** "I understand, and I'm here to help. I know this is a difficult time. Can I ask you a few questions so we can connect you with the right attorney?"

**Caller:** "Yes."

**AI:** "Thank you. First, how long have you been married?"

**Caller:** "Fifteen years."

**AI:** "And do you and your spouse have any children together?"

**Caller:** "Yes, two kids. They're 12 and 9."

**AI:** "I see. Are you and your spouse currently living in the same home?"

**Caller:** "Yes, but it's very tense. He doesn't know I'm calling."

**AI:** "I understand. Everything you share with me is confidential. Has there been any discussion of divorce between you two, or is this something you're exploring first?"

**Caller:** "We've talked about it, but he thinks we can work it out. I don't think so."

**AI:** "That makes sense. Do you know if your spouse has spoken with an attorney?"

**Caller:** "I don't think so."

**AI:** "Okay. Without getting into details right now, are there significant assets you'll need to divide, like a house or retirement accounts?"

**Caller:** "Yes, we own our home, and we both have retirement accounts."

**AI:** "Got it. And do you have concerns about custody or the children's living arrangements?"

**Caller:** "I want the kids to stay with me most of the time. He works a lot and travels."

**AI:** "I understand. One more important question: Is there any history of domestic violence or are you or the children in any unsafe situation?"

**Caller:** "No, nothing like that. He's not a bad father, we just can't stay married."

**AI:** "I appreciate you clarifying that. Based on what you've shared, I'd like to schedule you for a consultation with one of our family law attorneys. We'll be able to discuss your specific situation, your options, and the process in detail. Our consultations are [consultation fee if applicable, or free]. Does that work for you?"

**Caller:** "Yes, how soon can I come in?"

**AI:** "We can see you as early as [next available appointment]. Would [day] at [time] work for you?"

**Caller:** "Yes, that works."

**AI:** "Perfect. I have you scheduled for [day/time] with [Attorney Name]. Before we finish, I want to ask: is it safe for us to send a confirmation email and call this number to remind you of the appointment, or would you prefer we use different contact information?"

**Caller:** "This number is fine, but maybe just text instead of call?"

**AI:** "Absolutely. We'll send you a text confirmation with the appointment details. When you come in, please bring any financial documents you have—pay stubs, tax returns, bank statements, retirement account statements—and any prior court orders if applicable. Is there anything else I can help you with today?"

**Caller:** "No, thank you so much."

**AI:** "You're very welcome. We'll see you [day] at [time]. Take care."

### Example Call Flow (Custody Emergency)

**Caller:** "My ex-husband won't bring my kids back!"

**AI:** "I want to help you. First, are the children safe? Are they in danger?"

**Caller:** "I don't think he would hurt them, but he was supposed to bring them home yesterday and he won't answer my calls!"

**AI:** "I understand how scary this is. Is there a custody order in place?"

**Caller:** "Yes, we have a court order. He's supposed to have them every other weekend, and this was his weekend."

**AI:** "And he didn't return them at the designated time yesterday?"

**Caller:** "Right, I was supposed to pick them up at 5pm and he texted saying they're not coming back."

**AI:** "This is a serious situation. Do you know where he is with the children?"

**Caller:** "I think they're at his house."

**AI:** "Okay. Have you contacted the police?"

**Caller:** "Not yet. I didn't know if I should."

**AI:** "This situation requires immediate legal attention. I'm going to connect you with one of our attorneys right now. Can you hold for a moment while I transfer you?"

**Caller:** "Yes, please!"

**AI:** *[Transfers to attorney with message: "Emergency custody situation - father not returning children per court order. Mother on line, children believed safe but whereabouts confirmed. Police not yet contacted. Needs immediate guidance."]*

---

## Estate Planning

### Practice Overview
Estate planning includes wills, trusts, powers of attorney, healthcare directives, probate administration, estate administration, and asset protection. Key characteristics:
- Clients often older or health-concerned
- Sensitive family dynamics
- Complex financial situations
- Not usually urgent (unless health crisis)
- Educational approach needed
- Moderate case values ($2K-$25K typically)

### Custom AI Configuration

#### Greeting & Tone
**Standard Greeting:**
"Thank you for calling [Firm Name]. This is [AI Name]. Whether you're planning ahead or dealing with a loved one's estate, we're here to help guide you through the process. What brings you to us today?"

**Tone Settings:**
- Patient and educational
- Professional and trustworthy
- Respectful, especially with elderly clients
- Calm and reassuring
- Not pushy or sales-oriented
- Compassionate for probate situations

#### Qualification Questions

**Initial Assessment:**
1. "Are you calling about creating a plan for yourself, or are you dealing with a loved one's estate?"

**For Estate Planning (Creating Plan):**
2. "Have you done any estate planning before, or is this your first time?"
3. "Do you have a will currently?"
4. "Are you married? Do you have children?"
5. "Do you own real estate?"
6. "Do you have significant assets you're looking to protect or distribute?" (retirement accounts, investments, business, etc.)
7. "Are there any special circumstances we should know about?" (blended family, special needs child, business ownership, etc.)
8. "What prompted you to call today?" (age milestone, health concern, life event, etc.)

**For Trust Planning:**
9. "What type of trust are you interested in?" (revocable living trust, irrevocable trust, special needs trust, etc.)
10. "What goals are you hoping to accomplish?" (avoid probate, protect assets, minimize taxes, provide for family, etc.)

**For Probate/Estate Administration:**
11. "Who is the deceased?"
12. "When did they pass away?"
13. "Are you a family member or named in the will?"
14. "Was there a will?"
15. "Do you have the will or know where it is?"
16. "Are there disagreements among family members?"
17. "What assets are involved?" (property, accounts, business, etc.)
18. "Are there debts that need to be addressed?"

#### Urgency Protocol

**Immediate/Same-Day Consultation:**
- Hospitalized and needs immediate estate documents
- Terminal illness with limited time
- Emergency guardianship needed
- Court deadline for probate proceeding
- Assets at immediate risk

**Priority Consultation (1-3 days):**
- Serious health diagnosis
- Upcoming surgery
- Probate just opened
- Family dispute emerging

**Standard Consultation (1-2 weeks):**
- General estate planning
- Updating existing documents
- Trust planning
- Routine probate administration

**Educational Consultation (flexible):**
- Exploring options
- Learning about process
- Preliminary information gathering

#### Case Type Customization

**Simple Will:**
- Straightforward family situation
- Modest assets
- Clear beneficiary wishes
- No tax concerns
- No business interests

**Complex Will:**
- Blended family
- Significant assets
- Business ownership
- Tax planning needed
- Charitable giving
- Multiple properties

**Revocable Living Trust:**
- Avoid probate
- Incapacity planning
- Privacy concerns
- Out-of-state property
- Ongoing asset management

**Irrevocable Trust:**
- Asset protection
- Tax minimization
- Medicaid planning
- Special needs beneficiary

**Powers of Attorney:**
- Financial power of attorney
- Healthcare power of attorney
- When to activate
- Who to designate

**Advance Healthcare Directives:**
- Living will
- Healthcare proxy
- End-of-life wishes
- HIPAA authorization

**Probate Administration:**
- Testate (with will) vs. intestate (without will)
- Executor/personal representative appointment
- Asset inventory and appraisal
- Creditor claims
- Tax returns
- Distribution to beneficiaries

#### Information Collection

**For Estate Planning:**
- Full name, address, contact information
- Date of birth
- Marital status and spouse info
- Children (names, ages, relationships)
- Assets (real estate, accounts, investments, business, personal property)
- Existing estate documents (if any)
- Desired beneficiaries
- Healthcare and financial agents
- Concerns or special circumstances

**For Probate:**
- Deceased's full name and date of death
- Caller's relationship to deceased
- Whether there's a will
- Named executor (if known)
- Heirs/beneficiaries
- Asset overview
- Debts overview
- Whether estate opened
- Court jurisdiction

**Documents to Request (Estate Planning):**
- Prior wills or trusts
- Deeds to real estate
- Account statements
- Business ownership documents
- Life insurance policies
- Beneficiary designations

**Documents to Request (Probate):**
- Death certificate
- Will (original if available)
- Asset documentation
- Debt documentation
- Letters testamentary (if appointed)

#### Educational Approach

Estate planning clients often need education. AI is configured to:
- Explain difference between will and trust
- Describe probate process and why people avoid it
- Clarify what powers of attorney do
- Explain healthcare directives
- Describe benefits of planning ahead
- Address common misconceptions

**Example Education:**
"A will says what happens to your assets after you pass away, but those assets still go through probate—a court process. A revocable living trust, on the other hand, allows your assets to pass to your beneficiaries without going through probate, which can save time and money and keep things private. During your consultation, the attorney can explain which approach makes the most sense for your situation."

#### Sensitive Topics

**Talking About Death:**
- Matter-of-fact but respectful
- Normalize the conversation: "Planning ahead is a gift to your loved ones"
- For elderly callers: Patient and clear, repeat if needed
- For probate: Condolences and empathy

**Family Dynamics:**
- Non-judgmental about complex family situations
- Emphasize attorney's role in helping navigate difficult dynamics
- Confidentiality about family disagreements

**Financial Information:**
- Assure confidentiality
- Explain why asset information is needed
- No need for exact amounts during initial call—general overview fine
- Never judgmental about amount of assets

#### Ethical Boundaries

**AI NEVER:**
- Provides legal advice about estate planning strategies
- Recommends specific trust structures
- Advises on tax planning
- Tells caller what should be in their will
- Offers opinions on family decisions
- Guarantees outcomes (tax savings, avoiding probate challenges, etc.)

**AI DOES:**
- Explain general differences between planning tools
- Describe typical process and timeline
- Discuss fee structures
- Schedule consultations
- Provide reassurance about complexity
- Acknowledge emotional nature of topic

### Example Call Flow (Estate Planning)

**Caller:** "I'd like to set up a will."

**AI:** "Absolutely, we can help with that. Creating a will is an important step. Have you done any estate planning before?"

**Caller:** "No, this is my first time. I'm 55 and I figure I should finally get this done."

**AI:** "That's great that you're thinking ahead. Many people wait much longer than they should. Do you have family—are you married, do you have children?"

**Caller:** "Yes, I'm married and I have three kids, ages 25, 22, and 19."

**AI:** "Okay. And do you and your spouse own your home?"

**Caller:** "Yes, we do."

**AI:** "And you mentioned wanting a will—have you thought about whether you might want a trust, or are you mainly focused on a will at this point?"

**Caller:** "I'm not really sure what the difference is."

**AI:** "That's a great question, and the attorney will explain this in detail during your consultation. But briefly: a will says what happens to your assets after you pass away, and those assets go through a court process called probate. A trust can allow your assets to pass to your family without going through probate, which can be faster and more private. The attorney will help you determine what makes the most sense for your situation based on your assets and goals."

**Caller:** "Oh, that's helpful. I think I want to learn more about both options."

**AI:** "Perfect. The consultation is a great opportunity to explore what's right for you. Our initial consultations for estate planning are [fee structure]. Does that work for you?"

**Caller:** "Yes, that's fine."

**AI:** "Great. Let me get you scheduled. I have availability next week—would Tuesday afternoon or Thursday morning work better for you?"

**Caller:** "Thursday morning works."

**AI:** "Excellent. I have you scheduled for Thursday, October 24th at 10am with [Attorney Name]. You'll receive a confirmation email. Before the meeting, if you and your spouse could think about who you'd want to name as guardians for your youngest child if something happened to both of you, and who you'd trust to handle your estate, that would be helpful. Also, a general idea of your assets—the house, retirement accounts, any other significant property. You don't need exact values, just a general picture. Sound good?"

**Caller:** "Yes, that sounds very helpful."

**AI:** "Wonderful. We'll see you Thursday at 10am. Is there anything else I can help with today?"

**Caller:** "No, thank you very much."

**AI:** "You're very welcome. We're glad you're taking this important step. See you Thursday!"

---

## Criminal Defense

### Practice Overview
Criminal defense covers misdemeanors, felonies, DUI/DWI, drug charges, assault, theft, sex crimes, white collar crimes, and appeals. Key characteristics:
- Extremely time-sensitive (arraignments, bail hearings, deadlines)
- High-stakes (liberty, record, future at risk)
- Clients often scared, confused, or in crisis
- May be calling from jail
- Need immediate attorney contact
- Sensitive and confidential
- Diverse case values ($2K-$100K+)

### Custom AI Configuration

#### Greeting & Tone
**Standard Greeting:**
"Thank you for calling [Firm Name]. This is [AI Name]. I understand you may be dealing with a serious legal matter, and I'm here to help. Everything you share with me is confidential. How can I assist you today?"

**Tone Settings:**
- Calm and reassuring
- Professional and serious
- Non-judgmental
- Urgent when situation requires
- Supportive and understanding
- Clear and direct (no legal jargon)
- Respectful of stress caller is under

#### Qualification Questions

**Initial Assessment:**
1. "Can you tell me about the charges you're facing?"
2. "When were you charged or arrested?"
3. "Have you been to court yet?"
4. "Do you have an upcoming court date?"
5. "Are you currently in jail, or have you been released?"

**Charge Details:**
6. "What specifically are you charged with?" (be specific: DUI, possession, assault, etc.)
7. "Is this a misdemeanor or felony?" (AI can often determine based on charge)
8. "Is this your first offense?"
9. "What jurisdiction?" (county/state where charged)

**Legal Status:**
10. "Have you been assigned a public defender?"
11. "Have you spoken with any other private attorneys?"
12. "Did you make any statements to police?"
13. "Were you read your Miranda rights?"

**Case Specifics:**
14. "Was anyone injured?"
15. "Was there property damage?"
16. "Were you tested?" (for DUI: blood, breath, field sobriety)
17. "Do you have any evidence or witnesses that could help your case?"

**Immediate Concerns:**
18. "Are there any immediate deadlines we need to be aware of?"
19. "Is your license suspended?" (for DUI)
20. "Are there any protective orders or conditions of release?"

#### Urgency Protocol

**Immediate Attorney Transfer:**
- Currently in jail needing bail hearing
- Arraignment tomorrow or within 24-48 hours
- Deadline to file motion expiring imminently
- Wants to turn themselves in
- Arrest warrant issued
- Police want to question them
- Violation of probation with warrant

**Same-Day Consultation:**
- Recent arrest (within 1-2 days)
- Court date within one week
- Serious felony charges
- Multiple charges
- Prior record with aggravating factors

**Priority Consultation (1-3 days):**
- Misdemeanor charges
- Court date 1-2 weeks out
- Investigation ongoing but not yet charged
- Wants to explore defense options

**Standard Consultation (3-7 days):**
- Exploring options before charges filed
- Minor misdemeanor
- Appeal consideration
- Expungement inquiry

#### Case Type Customization

**DUI/DWI:**
- BAC level if tested
- Field sobriety test results
- Whether refused testing
- Prior DUI history
- License suspension status
- Impact on employment (CDL, professional license)
- Administrative hearing deadline (often very short—10-14 days)

**Drug Charges:**
- Type of drug
- Amount/weight
- Possession vs. intent to distribute
- Where found (person, vehicle, residence)
- How discovered (search warrant, traffic stop, etc.)
- Prior drug offenses
- Whether treatment program might apply

**Assault/Violent Crimes:**
- Circumstances of incident
- Injuries to alleged victim
- Self-defense claim
- Witnesses
- Prior violent offenses
- Protective orders issued
- Weapon involved

**Theft/Property Crimes:**
- Value of property
- How occurred (shoplifting, burglary, embezzlement, etc.)
- Restitution required
- Prior theft offenses
- Employment consequences

**Sex Crimes:**
- **Highest sensitivity protocol**
- Nature of allegations
- Accuser relationship
- Evidence discussed by prosecution
- Prior offenses
- Sex offender registration implications
- Often immediate attorney transfer due to complexity

**White Collar Crimes:**
- Type (fraud, embezzlement, tax evasion, etc.)
- Federal vs. state charges
- Investigation stage
- Amounts involved
- Professional license at risk
- Business implications

**Probation Violations:**
- Nature of violation
- Original underlying charge
- Probation terms
- Whether arrested or summons
- Prior violations
- Hearing date

#### Information Collection

**Critical Data Points:**
- Full name and contact information
- Date of birth
- Charges (specific statutes if known)
- Arrest date and location
- Jurisdiction (county, state, federal)
- Case number (if assigned)
- Court dates
- Bail/bond status
- Jail location if currently incarcerated
- Prior criminal history
- Current attorney status
- Employment/military status
- Any immediate deadlines

**Documents to Request:**
- Charging documents
- Complaint/information/indictment
- Police report
- Arrest report
- Court notices
- Bail documents
- Probation terms (if applicable)
- Prior conviction records

**What NOT to Collect Over Phone:**
- Detailed statement of facts (save for attorney)
- Admission of guilt
- Incriminating details beyond basic charges

#### Special Protocols

**If Caller is in Jail:**
- Get jail name and location
- Booking number
- Bail amount set
- Bail hearing scheduled
- Whether they need immediate bail assistance
- Limited time on call—get essential info quickly
- Immediate attorney call-back or visit arranged

**If Police Want to Question:**
- Immediate advice: "Don't speak to police without an attorney present"
- Immediate attorney transfer or emergency consultation
- Emphasize rights: "You have the right to remain silent and the right to an attorney"

**If Warrant Issued:**
- Immediate attorney contact
- Options for turning self in with attorney present
- Avoid surprises/unsafe arrest situations

**Constitutional Rights:**
AI is trained to:
- Emphasize right to remain silent
- Explain right to attorney
- Advise not to speak to police without attorney
- Never advise waiving rights

#### Ethical Boundaries

**AI NEVER:**
- Provides legal advice about defense strategy
- Assesses likelihood of conviction
- Recommends plea vs. trial
- Makes promises about case outcomes
- Asks detailed questions about guilt/innocence
- Encourages false statements
- Advises on what to say to police (beyond "invoke your rights")

**AI DOES:**
- Explain general criminal process
- Discuss types of charges (felony vs. misdemeanor)
- Explain importance of legal representation
- Emphasize constitutional rights
- Schedule urgent consultations
- Coordinate jail visits if needed
- Provide reassurance firm can help

### Example Call Flow (DUI)

**Caller:** "I got arrested for DUI last night."

**AI:** "I understand, and we can help. First, are you out of jail now or are you calling from jail?"

**Caller:** "I'm out. They let me go this morning."

**AI:** "Okay, good. When you were arrested, did they give you any paperwork with a court date?"

**Caller:** "Yes, I have to go to court in three weeks."

**AI:** "Alright, I want to make sure we get you help as soon as possible. Did they test you—breath, blood, or field sobriety tests?"

**Caller:** "They did a breathalyzer. I think I blew a .12."

**AI:** "I see. And is this your first DUI, or have you had prior DUI charges?"

**Caller:** "First one. I can't believe this happened."

**AI:** "I understand this is stressful. The good news is you called us and we can help you navigate this. One important question: did they suspend your license on the spot?"

**Caller:** "Yes, they took my license and gave me a temporary paper one."

**AI:** "That's important. In this state, you typically have only 10 days from your arrest to request an administrative hearing to challenge the license suspension. Since you were arrested last night, that means you have about 9 days left. We need to get you in to see an attorney quickly to make sure we don't miss that deadline. Can you come in today or tomorrow?"

**Caller:** "I can come in today if you have time."

**AI:** "Let me see what we have available. I can get you in this afternoon at 3pm with [Attorney Name], who focuses on DUI defense. Does that work?"

**Caller:** "Yes, that works. What should I bring?"

**AI:** "Bring any paperwork they gave you when you were released—the ticket, the temporary license, any court notices. If you remember details about the stop and the tests, that's helpful too, but the attorney will walk through everything with you. The consultation fee is [$X], or if you retain the attorney, that's applied toward your case. Sound good?"

**Caller:** "Yes, thank you so much."

**AI:** "You're welcome. One more thing: don't discuss the details of your case with anyone else—not friends, not family, not on social media—until you've spoken with the attorney. And definitely don't speak to the police or prosecutor without your attorney present. Okay?"

**Caller:** "Okay, I understand."

**AI:** "Perfect. We'll see you today at 3pm. We've handled many DUI cases and we'll do everything we can to help you get the best possible outcome."

---

## Immigration Law

### Practice Overview
Immigration law covers visas, green cards, citizenship, deportation defense, asylum, work permits, family-based petitions, and business immigration. Key characteristics:
- Complex federal regulations
- Time-sensitive deadlines
- High emotional stakes (family separation, deportation risk)
- Often non-English speaking clients
- Diverse case complexity and values
- Fear and uncertainty common

*[Continued in next section due to length]*

**[Note: This document continues with sections for Immigration Law, Business Law, Real Estate Law, and other practice areas following the same detailed format. Would you like me to continue with the remaining practice areas?]**
