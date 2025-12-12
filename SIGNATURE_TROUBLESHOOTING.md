# Send for Signature Troubleshooting Checklist

Use this checklist to diagnose why "Send for Signature" isn't working.

## Quick Diagnostic Steps

### ✅ Step 1: Check if Button Appears

**Question**: Do you see the "Send for Signature" button?

- [ ] **Yes** → Go to Step 2
- [ ] **No** → The button only appears when:
  - You have a saved draft (document has been generated)
  - You're viewing an existing draft
  - **Fix**: Generate the document first, then try again

### ✅ Step 2: Check Browser Console

**Action**: Open browser DevTools (F12) → Console tab

**Look for**:
- [ ] Red error messages when clicking "Send for Signature"
- [ ] Network errors (check Network tab)
- [ ] JavaScript errors

**Common errors**:
- `401 Unauthorized` → Not logged in
- `404 Not Found` → API route missing
- `500 Internal Server Error` → Server-side error

### ✅ Step 3: Check Server Logs

**Action**: Look at terminal where `npm run dev` is running

**Look for**:
- [ ] Error messages when clicking "Send for Signature"
- [ ] Database connection errors
- [ ] Prisma errors
- [ ] API route errors

### ✅ Step 4: Verify Environment Variables

**Action**: Check your `.env` file exists and has:

```env
# REQUIRED - Base URL for signing links
NEXTAUTH_URL=http://localhost:3000

# OPTIONAL - For email sending
RESEND_API_KEY=re_xxxxx
# OR
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

**Check**:
- [ ] `.env` file exists in project root
- [ ] `NEXTAUTH_URL` is set (required!)
- [ ] No typos in variable names
- [ ] Server restarted after adding variables

**Fix**: 
1. Create `.env` file if missing
2. Add `NEXTAUTH_URL=http://localhost:3000`
3. Restart server: `npm run dev`

### ✅ Step 5: Test API Route Directly

**Action**: Test the API endpoint manually

**Option A: Using curl** (in terminal):
```bash
# Replace YOUR_SESSION_COOKIE with actual cookie from browser
# Replace DRAFT_ID with actual draft ID
curl -X POST http://localhost:3000/api/signature-invites \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  -d '{
    "draftId": "DRAFT_ID",
    "recipientName": "Test User",
    "recipientEmail": "test@example.com"
  }'
```

**Option B: Using browser console**:
```javascript
fetch('/api/signature-invites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    draftId: 'YOUR_DRAFT_ID',
    recipientName: 'Test User',
    recipientEmail: 'test@example.com'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected response**:
```json
{
  "invite": { ... },
  "signingUrl": "http://localhost:3000/sign/abc123...",
  "emailSent": true/false,
  "emailError": null or "EMAIL_NOT_CONFIGURED"
}
```

**Check**:
- [ ] API returns 201 (success) or error message
- [ ] If 401 → Not authenticated (login issue)
- [ ] If 404 → Route not found (check file exists)
- [ ] If 500 → Server error (check server logs)

### ✅ Step 6: Check Database

**Action**: Verify database tables exist

```bash
# Open Prisma Studio
npx prisma studio
```

**Check**:
- [ ] `SignatureInvite` table exists
- [ ] `Signature` table exists
- [ ] `Draft` table exists
- [ ] Can see your drafts in Draft table

**If tables missing**:
```bash
# Run migrations
npx prisma migrate dev
```

### ✅ Step 7: Check Authentication

**Question**: Are you logged in?

- [ ] **Yes** → Go to Step 8
- [ ] **No** → Login first, then try again

**Check**:
- Session exists in browser
- User ID in session matches database
- API routes can access `session.user.id`

### ✅ Step 8: Check Draft ID

**Question**: Does the draft exist?

**Action**: In browser console:
```javascript
// Check if currentDraftId is set
console.log('Draft ID:', window.location.pathname)
```

**Check**:
- [ ] Draft ID is not null/undefined
- [ ] Draft exists in database
- [ ] You own the draft (userId matches)

### ✅ Step 9: Test Signing Flow

**If invite was created successfully**:

1. **Get the signing URL** from the modal or API response
2. **Open in new browser/incognito** (to test as recipient)
3. **Check**:
   - [ ] Page loads (`/sign/[token]`)
   - [ ] Document preview shows
   - [ ] Can enter name/email
   - [ ] Can create signature
   - [ ] Signature submits successfully

**If signing page shows error**:
- Check token format (should be 64-char hex string)
- Check invite exists in database
- Check API route `/api/signature-invites/[token]` works

## Common Issues & Solutions

### Issue: "Button doesn't do anything"

**Possible causes**:
1. JavaScript error preventing click handler
2. Modal component not imported
3. State not updating

**Solution**:
- Check browser console for errors
- Verify `SendForSignatureModal` is imported
- Check if `currentDraftId` is set

### Issue: "Modal opens but form doesn't submit"

**Possible causes**:
1. API route error
2. Network issue
3. Validation error

**Solution**:
- Check Network tab in DevTools
- Look for failed POST request
- Check server logs for error
- Verify recipient email format is valid

### Issue: "Email not sent" warning

**This is normal if email isn't configured!**

**The system still works**:
- Invite is created
- Signing URL is generated
- You can copy/share URL manually

**To enable email**:
- See `QUICK_EMAIL_SETUP.md`
- Add `RESEND_API_KEY` or SMTP config
- Restart server

### Issue: "Invite not found" when signing

**Possible causes**:
1. Token invalid/expired
2. Database issue
3. Wrong URL

**Solution**:
- Check token in URL matches database
- Verify invite exists: `npx prisma studio`
- Check token format (64-char hex)

### Issue: "Unauthorized" error

**Possible causes**:
1. Not logged in
2. Session expired
3. Don't own the draft

**Solution**:
- Login again
- Check session in browser
- Verify you created the draft

## Still Not Working?

### Get More Information

1. **Enable verbose logging**:
   - Check browser console
   - Check server terminal
   - Look for specific error messages

2. **Test each component**:
   - Can you create a draft? ✅
   - Can you see the button? ✅
   - Can you open the modal? ✅
   - Can you submit the form? ✅
   - Does API return success? ✅
   - Does signing URL work? ✅

3. **Check file structure**:
   ```bash
   # Verify these files exist:
   ls src/components/send-for-signature-modal.tsx
   ls src/app/api/signature-invites/route.ts
   ls src/app/api/signature-invites/[token]/route.ts
   ls src/app/sign/[token]/page.tsx
   ```

4. **Verify dependencies**:
   ```bash
   npm install
   npx prisma generate
   ```

5. **Check Prisma schema**:
   - Verify `SignatureInvite` model exists
   - Verify `Signature` model exists
   - Verify relations are correct

## Quick Test Script

Run this in browser console on a page with a draft:

```javascript
// Test 1: Check if draft ID exists
const draftId = prompt('Enter draft ID:')

// Test 2: Try creating invite
fetch('/api/signature-invites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    draftId: draftId,
    recipientName: 'Test User',
    recipientEmail: 'test@example.com'
  })
})
.then(async r => {
  const data = await r.json()
  console.log('Status:', r.status)
  console.log('Response:', data)
  if (data.signingUrl) {
    console.log('✅ Success! Signing URL:', data.signingUrl)
    alert('Success! Check console for signing URL')
  } else {
    console.error('❌ Error:', data.error)
    alert('Error: ' + (data.error || 'Unknown error'))
  }
})
.catch(err => {
  console.error('❌ Request failed:', err)
  alert('Request failed: ' + err.message)
})
```

This will help identify exactly where the issue is.

