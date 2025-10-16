# Troubleshooting Guide - AI Voice Receptionist

## Quick Reference

**Emergency Support:** If you have an urgent issue during business hours, call our support line at [support number] or use the emergency escalation in your dashboard.

**Response Times:**
- Critical (system down): 15 minutes
- High (major functionality impaired): 1 hour
- Medium (minor issues): 4 hours
- Low (questions/optimization): 24 hours

---

## Setup & Configuration Issues

### Call Forwarding Not Working

#### Symptom
Calls aren't reaching the AI receptionist; they ring at your office but never get answered by the AI.

#### Likely Causes
1. Call forwarding not properly configured
2. Wrong AI number entered
3. Conditional forwarding rules conflicting
4. Phone system settings blocking external forwards

#### Resolution Steps

**Step 1: Verify Call Forwarding Number**
- Check that you're forwarding to the correct AI number
- The number should be: [provided during setup]
- Look for typos (especially area code)

**Step 2: Test the Forward**
- From a different phone, call your main number
- Listen for the AI greeting
- If you hear your regular voicemail/receptionist, forward isn't active

**Step 3: Check Your Phone System**
- **For traditional phone systems:** 
  - Dial *72 followed by the AI number (or check your system's forward code)
  - Listen for confirmation tone
- **For VoIP systems:**
  - Log into your admin portal
  - Navigate to call forwarding settings
  - Verify the AI number is entered correctly
  - Ensure forwarding is set to "always" or your desired condition

**Step 4: Check Conditional Rules**
- If using "forward on busy" or "forward no answer":
  - Verify the conditions are set correctly
  - Test by making your receptionist busy (call from two phones)
- If using time-based forwarding:
  - Verify your business hours are configured correctly
  - Account for time zone settings

**Step 5: Verify No Blocking**
- Some phone systems block external forwards for security
- Contact your phone provider to whitelist the AI number
- Ask them to remove any "toll-free blocking" if applicable

**When to Escalate:** If forwarding still doesn't work after these steps, contact our support team with:
- Your phone system type/provider
- Screenshots of your forwarding settings
- Time you last attempted the forward

---

### Calendar Not Syncing

#### Symptom
AI is trying to book appointments but calendar shows no availability, or appointments aren't appearing in your calendar.

#### Likely Causes
1. Calendar permissions not granted
2. Calendar connection expired
3. Wrong calendar selected
4. Sync delays
5. Conflicting calendar rules

#### Resolution Steps

**Step 1: Check Connection Status**
- Log into your dashboard
- Navigate to Integrations → Calendar
- Check connection status (should show green "Connected")
- If disconnected, click "Reconnect"

**Step 2: Verify Permissions**
- When reconnecting, ensure you grant:
  - Read calendar events
  - Write calendar events
  - Access to free/busy information
- For Google: Check that you approved all requested permissions
- For Microsoft: Verify app permissions in Microsoft 365 admin

**Step 3: Confirm Correct Calendar**
- In dashboard, check which calendar is selected
- If you have multiple calendars, ensure the right one is active
- For shared calendars, verify you have edit permissions

**Step 4: Check Availability Settings**
- In dashboard → Calendar Settings:
  - Verify your business hours are correct
  - Check buffer times between appointments
  - Confirm appointment types and durations
  - Review any blackout dates

**Step 5: Test Sync**
- Create a test event manually in your calendar
- Wait 2-3 minutes
- Check if it appears as "busy" in the AI dashboard
- Try booking a test appointment through AI
- Verify it appears in your calendar within 5 minutes

**Step 6: Clear Cache**
- In dashboard, click "Force Refresh Calendar"
- Wait 2 minutes
- Retry booking

**Common Issues:**

*"Calendar shows available but I'm actually busy"*
- Check if you're using the correct calendar
- Verify private events are blocking time (set in calendar settings)
- Ensure "show as busy" is enabled for your events

*"Appointments booking at wrong times"*
- Verify time zone settings match in both calendar and AI dashboard
- Check if daylight saving time is configured correctly

*"Double-bookings happening"*
- Ensure only one calendar is connected
- Check buffer time settings
- Verify sync is working both directions

**When to Escalate:** If sync still fails after these steps, contact support with:
- Calendar type (Google, Microsoft, etc.)
- Screenshot of integration page
- Example of a booking attempt that failed
- Your time zone

---

### Practice Management System Not Connecting

#### Symptom
Integration with Clio, MyCase, or other practice management system shows as disconnected or data isn't flowing.

#### Likely Causes
1. API credentials expired
2. Permissions changed in PM system
3. PM system update caused compatibility issue
4. Rate limit exceeded
5. Account/subscription changes

#### Resolution Steps

**Step 1: Check Connection Status**
- Dashboard → Integrations → Practice Management
- Note the specific error message
- Click "Reconnect" to refresh connection

**Step 2: Verify PM System Access**
- Log into your practice management system
- Check that your account is active
- Verify API access is enabled (may require admin permissions)
- For Clio: Settings → Integrations → API Access
- For MyCase: Admin → Integrations → API Keys

**Step 3: Reauthorize Connection**
- In dashboard, click "Disconnect" then "Connect"
- Follow the authorization flow
- Grant all requested permissions
- Verify connection shows green

**Step 4: Check Data Mapping**
- In dashboard, review field mapping
- Ensure contact fields map to correct PM fields
- Verify practice area/matter type mappings are correct

**Step 5: Test Integration**
- Have AI take a test call with contact info
- Check if contact appears in PM system within 10 minutes
- Verify all fields populated correctly

**Common PM System Issues:**

**Clio:**
- *"Unauthorized error"* → API keys need regeneration in Clio
- *"Rate limit exceeded"* → Contact support; we'll request limit increase
- *"Missing fields"* → Check custom field mapping in dashboard

**MyCase:**
- *"Connection timeout"* → MyCase may be experiencing issues; check their status page
- *"Lead not creating"* → Verify lead automation is enabled in MyCase settings

**PracticePanther:**
- *"Invalid credentials"* → Regenerate API token in PracticePanther admin
- *"Permission denied"* → Ensure API user has contact creation permissions

**When to Escalate:** Contact support if:
- Error persists after reauthorization
- PM system says "connected" but data not flowing
- Specific error codes appear
- Integration worked previously but suddenly stopped

---

## Call Quality Issues

### Audio Quality Problems

#### Symptom
Callers report AI sounds robotic, garbled, choppy, or has echo/static.

#### Likely Causes
1. Internet bandwidth issues
2. Caller's phone connection poor
3. Background noise interference
4. VoIP codec incompatibility
5. Hardware issues on caller's end

#### Resolution Steps

**Step 1: Identify Pattern**
- Is this happening on all calls or specific calls?
- Specific time of day?
- Specific caller location or phone type?
- Check call recordings to hear the issue yourself

**Step 2: Test from Different Sources**
- Call from mobile phone
- Call from landline
- Call from different locations
- Compare audio quality

**Step 3: Check Your Internet**
- Run speed test: Need minimum 5 Mbps upload
- Check latency: Should be under 100ms
- Verify VoIP traffic isn't being throttled
- Ensure QoS settings prioritize voice traffic

**Step 4: Review Integration Method**
- If using SIP trunk: Verify codec settings (prefer G.711)
- If using call forwarding: Issue likely on carrier side
- Check for packet loss in VoIP system logs

**Step 5: Environmental Factors**
If issue is with specific callers:
- Callers on old phone systems may have compatibility issues
- Cell coverage in caller's area may be poor
- International calls may have added latency

**When to Escalate:** If audio quality issues persist across multiple callers and locations, contact support with:
- Call recordings demonstrating the issue
- Your internet speed test results
- Phone system type and provider
- Approximate percentage of calls affected

---

### Speech Recognition Errors

#### Symptom
AI frequently misunderstands callers, asks them to repeat, or makes incorrect transcriptions.

#### Likely Causes
1. Strong accents or dialects
2. Background noise
3. Caller speaking too quietly or quickly
4. Technical jargon or uncommon names
5. Phone audio quality issues

#### Resolution Steps

**Step 1: Identify Pattern**
- What types of words are being misunderstood?
- Names, legal terms, or general conversation?
- Specific callers or widespread issue?
- Review transcripts to see specific errors

**Step 2: Update Custom Vocabulary**
- In dashboard → Settings → Vocabulary:
  - Add commonly used legal terms
  - Add attorney names (with phonetic spelling)
  - Add city/location names you serve
  - Add practice area specific terminology
- Example: "Voir dire" → "vwahr-DEER"

**Step 3: Adjust Recognition Settings**
- In dashboard → Settings → Speech:
  - Increase confidence threshold if too many wrong recognitions
  - Decrease threshold if AI asks to repeat too often
  - Enable accent adaptation (learns over time)

**Step 4: Optimize for Environment**
- If background noise is common:
  - Enable noise suppression (advanced settings)
  - Adjust ambient noise filtering
- If multiple people talking:
  - Enable speaker separation
  - May need to ask caller to move to quieter location

**Step 5: Train on Your Practice**
- Upload common intake scripts/FAQs
- System learns your specific terminology
- Provide call examples that went well
- Flag problematic transcripts for learning

**Common Recognition Issues:**

*"Can't understand names properly"*
- Add attorney/staff names to custom vocabulary
- Include phonetic pronunciations
- Consider spelling confirmation: "Is that Smith, S-M-I-T-H?"

*"Legal terms being misheard"*
- Build comprehensive legal vocabulary list
- Include practice area specific terms
- Add common case types and procedures

*"Mishears numbers (phone, case numbers)"*
- Enable digit-by-digit confirmation for critical numbers
- Set system to repeat back numbers for verification
- Consider asking caller to speak numbers slowly

**When to Escalate:** If recognition issues persist after vocabulary updates, contact support with:
- Specific examples of misrecognitions
- Call recordings demonstrating the issue
- List of commonly misunderstood terms
- Practice area information

---

### AI Not Transferring When It Should

#### Symptom
AI continues conversation when it should have transferred to receptionist or attorney.

#### Likely Causes
1. Transfer rules not configured correctly
2. Keywords/triggers not recognized
3. Business hours settings incorrect
4. Transfer availability not detected
5. System delay in decision-making

#### Resolution Steps

**Step 1: Review Transfer Rules**
- Dashboard → Settings → Call Flow → Transfer Rules
- Check all configured transfer triggers:
  - Business hours transfers enabled?
  - Emergency keywords configured?
  - "Request human" trigger active?
  - Practice area specific transfers set?

**Step 2: Test Transfer Triggers**
- Call the AI yourself
- Say trigger phrases: "I need to speak with an attorney now"
- Try: "This is urgent" / "Emergency" / "Transfer me"
- Verify transfer happens within 3-5 seconds

**Step 3: Check Business Hours**
- Dashboard → Settings → Business Hours
- Verify hours match your actual operating times
- Check time zone is correct
- Confirm holiday schedule is updated
- Test during business hours vs. after-hours

**Step 4: Verify Transfer Availability**
- Check that receptionist/attorney phone numbers are correct
- Verify transfer numbers are reachable
- Test that transferred calls actually ring through
- Confirm no call blocking on transfer destinations

**Step 5: Review Call Recordings**
- Listen to calls where transfer should have occurred
- Note exact words caller used
- Check if AI acknowledged transfer request
- See if there was technical failure or logic failure

**Step 6: Adjust Sensitivity**
- In Transfer Settings:
  - Lower threshold for transfer triggers (more sensitive)
  - Add more keyword variations
  - Enable "ask if they want transfer" when uncertain
  - Set maximum conversation length before offering transfer

**Common Transfer Issues:**

*"Caller asks for attorney but AI keeps talking"*
- Add more variations: "attorney", "lawyer", "speak to someone", "real person"
- Enable immediate transfer on attorney request (no confirmation needed)
- Check that business hours are correctly set

*"Emergency not being recognized"*
- Update emergency keyword list
- Add practice-specific urgent terms
- Enable immediate escalation on emergency words
- Consider lowering emergency detection threshold

*"Transfer rings but no one answers"*
- Verify transfer ring timeout (should ring 20-30 seconds)
- Check if voicemail is picking up too quickly
- Test transfer numbers directly
- Set up backup transfer numbers

**When to Escalate:** Contact support if:
- Transfer rules configured correctly but not working
- Transfer attempts fail technically
- Inconsistent transfer behavior
- Need help with complex transfer logic

---

### AI Booking Appointments Incorrectly

#### Symptom
Appointments being scheduled at wrong times, double-booked, or for wrong attorneys/practice areas.

#### Likely Causes
1. Calendar availability not updating
2. Appointment type settings incorrect
3. Attorney assignment rules wrong
4. Time zone confusion
5. Buffer time issues

#### Resolution Steps

**Step 1: Check Calendar Sync**
- Verify calendar connection is active
- Force refresh calendar
- Confirm events showing as "busy" correctly
- Test booking a manual appointment

**Step 2: Review Appointment Settings**
- Dashboard → Appointments → Configuration:
  - Appointment types and durations
  - Buffer times before/after
  - Minimum notice required (e.g., "no same-day bookings")
  - Maximum advance booking window

**Step 3: Verify Attorney Assignment**
- Check practice area → attorney mapping
- Ensure all attorneys have connected calendars
- Review availability rules per attorney
- Test booking for each practice area

**Step 4: Time Zone Verification**
- Confirm your time zone in dashboard
- Check if caller time zone detection is enabled
- Review any appointments booked in wrong zones
- Test booking from different time zones

**Step 5: Buffer Time Issues**
- If double-bookings: Increase buffer time
- If too few slots available: Decrease buffer time
- If back-to-back bookings problematic: Add minimum gap
- Test with various buffer settings

**Common Booking Issues:**

*"Wrong practice area appointments"*
- Review how AI determines practice area
- Check intake questions sequence
- Add more qualifying questions
- Verify attorney specialties mapped correctly

*"Appointments at inconvenient times"*
- Set preferred appointment slots
- Block out lunch, meetings, court time
- Use recurring blocks for regular commitments
- Enable "offer preferred times first" setting

*"Caller time zone not detected"*
- Enable explicit time zone confirmation
- Have AI ask: "What time zone are you in?"
- Always confirm appointment time with caller
- Send confirmation with time zone specified

**When to Escalate:** Contact support if:
- Bookings fail despite correct settings
- Persistent double-booking issues
- Calendar integration issues
- Need custom booking logic

---

## Functional Issues

### AI Following Wrong Protocols

#### Symptom
AI not following your firm's specific protocols, collecting wrong information, or handling calls inconsistently.

#### Likely Causes
1. Protocols not clearly documented
2. Contradictory rules configured
3. Knowledge base out of date
4. Practice area confusion
5. Exception handling not defined

#### Resolution Steps

**Step 1: Review Your Protocol Documentation**
- Dashboard → Knowledge Base → Protocols
- Check all documented procedures
- Look for contradictions or ambiguities
- Verify practice area-specific protocols

**Step 2: Update and Clarify**
- Rewrite any unclear protocols in simple steps
- Use "If [condition], then [action]" format
- Provide specific examples
- Remove outdated information

**Step 3: Test Protocol Following**
- Call and walk through each protocol
- Verify AI follows each step correctly
- Note any deviations
- Record the call for review

**Step 4: Check Priority of Rules**
- If multiple rules conflict, which should take precedence?
- Set rule priority in dashboard
- Emergency protocols should override standard protocols
- Document exception handling clearly

**Step 5: Practice Area Configuration**
- Ensure each practice area has distinct protocols
- Verify AI can correctly identify practice area from caller
- Test cross-practice area scenarios
- Add disambiguation questions if needed

**Common Protocol Issues:**

*"AI collecting wrong information"*
- Review intake form/questions for that practice area
- Specify required vs. optional information
- Put questions in logical sequence
- Remove unnecessary questions

*"Inconsistent between calls"*
- AI may be learning from interactions
- Review recent call logs
- Look for pattern in inconsistencies
- May need to reset and retrain

*"Not handling exceptions well"*
- Document common exceptions explicitly
- Provide decision tree for edge cases
- Enable AI to escalate when uncertain
- Add "If unsure, transfer to human" fallback

**When to Escalate:** Contact support if:
- Protocols documented correctly but AI not following
- Need help optimizing call flow logic
- Complex decision trees needed
- Behavioral inconsistencies persist

---

### Missing or Incorrect Information in Messages

#### Symptom
Message notifications missing key details, incorrect contact information, or incomplete call summaries.

#### Likely Causes
1. Information not collected during call
2. Transcription errors
3. Field mapping incorrect
4. Message template issues
5. Integration data loss

#### Resolution Steps

**Step 1: Review Call Recording**
- Listen to the actual call
- Verify if information was collected
- Check if caller actually provided the data
- Note where communication broke down

**Step 2: Check Message Template**
- Dashboard → Settings → Notifications → Message Template
- Verify all required fields are included
- Check field labels match what you need
- Update template to capture missing information

**Step 3: Update Intake Questions**
- Dashboard → Knowledge Base → Intake Questions
- Add questions for any missing information
- Make critical fields required
- Set validation rules (e.g., phone format, email format)

**Step 4: Review Transcription**
- Check call transcript for accuracy
- Look for misheard information
- Add commonly misheard terms to vocabulary
- Consider asking AI to confirm critical info with caller

**Step 5: Test Information Flow**
- Make test call with complete information
- Check if all data appears in message
- Verify formatting is correct
- Confirm data flows to integrated systems

**Common Information Issues:**

*"Phone numbers missing or wrong"*
- Add explicit phone collection step
- Have AI read back phone number for confirmation
- Set format validation (must be 10 digits)
- Enable digit-by-digit collection if issues persist

*"Email addresses incorrect"*
- Add email confirmation step
- Have AI spell back email address
- Enable character-by-character for complex emails
- Offer to send confirmation to verify email

*"Missing practice area or case details"*
- Review practice area identification logic
- Add qualifying questions to clarify
- Require practice area before proceeding
- Enable disambiguation when uncertain

*"Message summaries too vague"*
- Update message template with specific prompts
- Add fields for key details
- Enable longer message length
- Include transcript link in message

**When to Escalate:** If information consistently missing after process updates, contact support.

---

## Access & Account Issues

### Dashboard Login Problems

#### Symptom
Cannot log into the dashboard, password not working, account locked.

#### Resolution Steps

**Step 1: Password Reset**
- Go to login page
- Click "Forgot Password"
- Check email for reset link (including spam folder)
- Create new strong password
- Try logging in

**Step 2: Check Account Status**
- Verify account is active (check billing status)
- Confirm no suspension notices via email
- Check if subscription expired

**Step 3: Browser Issues**
- Clear browser cache and cookies
- Try incognito/private mode
- Try different browser
- Disable browser extensions temporarily
- Check if JavaScript is enabled

**Step 4: Multi-Factor Authentication**
- If MFA enabled, verify you have access to MFA device
- Use backup codes if primary MFA unavailable
- Contact support to reset MFA if locked out

**Step 5: Account Lockout**
- After multiple failed login attempts, account locks for security
- Wait 15 minutes and try again
- Or contact support for immediate unlock

**When to Escalate:** If unable to access after these steps, contact support with:
- Email address used for account
- Last successful login date
- Error messages received
- Phone number on account for verification

---

### Permission or Role Issues

#### Symptom
Certain dashboard features unavailable, can't access specific settings, or getting "permission denied" errors.

#### Likely Causes
1. User role restrictions
2. Account type limitations
3. Feature not included in plan
4. Admin permissions needed

#### Resolution Steps

**Step 1: Check Your User Role**
- Dashboard → Account → Users
- View your assigned role
- Common roles: Owner, Admin, User, Viewer

**Step 2: Review Role Permissions**
- Owner: Full access to everything
- Admin: Can manage settings, users, integrations
- User: Can view reports, listen to calls
- Viewer: Read-only access

**Step 3: Request Permission Change**
- Contact your account owner/administrator
- Request appropriate role for your needs
- Have them update your permissions

**Step 4: Verify Plan Includes Feature**
- Some features only available on higher tiers
- Check your current plan in Account Settings
- Compare to feature availability matrix
- Upgrade plan if needed

**When to Escalate:** Contact support if you're the account owner and still seeing permission issues.

---

## System Status & Monitoring

### How to Check System Status

**System Status Page:** [status.odeuo.com] (check for known outages)

**In Dashboard:**
- Green indicator: All systems operational
- Yellow: Degraded performance
- Red: Service disruption

**Subscribe to Status Updates:**
- Get email/SMS notifications of issues
- Proactive alerts before you notice problems

---

### Performance Degradation

#### Symptom
AI responding slowly, delays in call answering, lag in dashboard.

#### Steps
1. Check system status page first
2. Verify your internet connection
3. Test during different times of day
4. Contact support if persistent during normal status

---

## Getting Additional Help

### Before Contacting Support, Have Ready:

1. **Account Information**
   - Your email address
   - Company/firm name
   - Account ID (from dashboard)

2. **Issue Details**
   - What you were trying to do
   - What happened instead
   - When it started
   - How often it occurs
   - Error messages (screenshots)

3. **Troubleshooting Already Done**
   - Steps you've already tried
   - Results of those attempts

4. **Supporting Information**
   - Call recordings demonstrating issue
   - Screenshots of error messages
   - Time stamps of when issue occurred
   - Phone numbers/systems involved

### Support Channels

**Dashboard:** Click "Help" icon → "Contact Support"
**Email:** support@odeuo.com
**Phone:** [support phone number] (business hours)
**Emergency:** [emergency phone number] (24/7 for critical issues)

### What Constitutes an Emergency

- System completely down (no calls being answered)
- All call transfers failing
- Data breach or security concern
- Multiple clients reporting same critical issue
- Loss of call recording functionality with legal deadline

### Support Response Times

- **Critical:** 15 minutes (system down)
- **High:** 1 hour (major functionality impaired)
- **Medium:** 4 hours (functionality degraded)
- **Low:** 24 hours (questions, optimization, feature requests)

---

## Preventive Maintenance

### Best Practices to Avoid Issues

**Weekly:**
- Review call logs for patterns
- Check calendar sync is working
- Verify integrations are connected
- Update any changed protocols

**Monthly:**
- Review and update FAQ/knowledge base
- Add new staff/attorney information
- Update practice area information
- Check for software updates
- Review analytics for anomalies

**Quarterly:**
- Audit call quality with spot checks
- Review and optimize protocols
- Update emergency contact procedures
- Training refresh for staff
- Performance review meeting with our team

**As Needed:**
- Update holiday schedule
- Add new integrations
- Modify business hours
- Update call handling rules for busy seasons

---

## Self-Service Resources

### Knowledge Base
Access at: Dashboard → Help → Knowledge Base
- Setup guides
- Feature tutorials
- Best practices
- FAQs
- Video walkthroughs

### Community Forum
- Connect with other law firm users
- Share tips and tricks
- Get peer advice
- See what others have configured

### Training Library
- Onboarding videos
- Advanced feature training
- Practice area specific guidance
- Integration tutorials

---

This troubleshooting guide covers the most common issues. If you encounter something not listed here, please contact our support team—we're here to help and will use your feedback to improve this guide!
