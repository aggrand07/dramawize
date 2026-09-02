/**
 * Dramawize Trial Registration — Google Apps Script
 *
 * This script does TWO things every time the registration form is submitted:
 *   1. Appends a row to the Google Sheet (this script's parent sheet)
 *   2. Sends an email to manasi@dramawize.com with the submission details
 *
 * Setup guide: see dramawize-form-setup-guide.docx in your folder.
 * One-time setup, then every form submission flows in automatically.
 */

const NOTIFICATION_EMAIL = 'manasi@dramawize.com';   // every new booking lands here
const SHEET_NAME         = 'Trial Bookings';

// =================================================================
// MAIN HANDLER — runs every time the form posts here
// =================================================================
function doPost(e) {
  try {
    // Read form data from either e.parameter (standard) OR
    // e.postData.contents (fallback for no-cors browser requests
    // that strip the Content-Type header).
    let data = (e && e.parameter) ? e.parameter : {};
    if (Object.keys(data).length === 0 && e && e.postData && e.postData.contents) {
      const raw = e.postData.contents;
      // Try parsing as JSON first
      try {
        data = JSON.parse(raw);
      } catch (jsonErr) {
        // Otherwise parse as URL-encoded
        const parsed = {};
        raw.split('&').forEach(function(pair) {
          const idx = pair.indexOf('=');
          if (idx >= 0) {
            const key = decodeURIComponent(pair.slice(0, idx).replace(/\+/g, ' '));
            const val = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '));
            parsed[key] = val;
          }
        });
        data = parsed;
      }
    }

    // 1. Append to Google Sheet ----------------------------------
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Parent Name',
        'Child Name',
        'Child Age Bracket',
        'Formal Drama Education',
        'Institute Name',
        'Parent Phone',
        'Parent Email',
        'Preferred Day',
        'Heard About Us',
        'Photo Consent',
        'Status'
      ]);
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1A2421');
      headerRange.setFontColor('#FFFDF6');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.parentName || '',
      data.childName || '',
      data.childAge || '',
      data.dramaEducation || '',
      data.instituteName || '—',
      data.parentPhone || '',
      data.parentEmail || '',
      data.preferredDay || '',
      data.source || '—',
      data.photoConsent || 'No',
      'New'
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 12);

    // 2. Send email notification ---------------------------------
    const subject = 'New Trial Booking — Dramawize · ' + (data.childName || 'Unknown child');

    const htmlBody =
      '<div style="font-family:Arial,sans-serif;max-width:560px;color:#1A2421;">' +
        '<div style="background:linear-gradient(135deg,#E97A5C,#D9A93A);padding:24px 28px;border-radius:14px 14px 0 0;">' +
          '<h2 style="margin:0;color:#FFFDF6;font-size:20px;">New Trial Booking</h2>' +
          '<p style="margin:6px 0 0;color:#FFFDF6;font-size:13px;opacity:.92;">via dramawize.com</p>' +
        '</div>' +
        '<div style="background:#FFFDF6;border:1px solid #E9DEC5;border-top:none;padding:24px 28px;border-radius:0 0 14px 14px;">' +
          '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
            row('Parent Name',       data.parentName) +
            row('Child Name',        data.childName) +
            row('Child Age Bracket', data.childAge) +
            row('Drama Education',   data.dramaEducation) +
            row('Institute',         data.instituteName || '—') +
            row('Phone',             data.parentPhone) +
            row('Email',             data.parentEmail) +
            row('Preferred Day',     data.preferredDay) +
            row('Heard About Us',    data.source || '—') +
            row('Photo Consent',     data.photoConsent || 'No') +
          '</table>' +
          '<p style="margin-top:20px;font-size:12px;color:#46524F;">Logged to your <em>Trial Bookings</em> sheet automatically.</p>' +
        '</div>' +
      '</div>';

    const plainBody =
      'New Trial Booking — Dramawize\n\n' +
      'Parent Name:       ' + (data.parentName || '') + '\n' +
      'Child Name:        ' + (data.childName || '') + '\n' +
      'Child Age Bracket: ' + (data.childAge || '') + '\n' +
      'Drama Education:   ' + (data.dramaEducation || '') + '\n' +
      'Institute:         ' + (data.instituteName || '—') + '\n' +
      'Phone:             ' + (data.parentPhone || '') + '\n' +
      'Email:             ' + (data.parentEmail || '') + '\n' +
      'Preferred Day:     ' + (data.preferredDay || '') + '\n' +
      'Heard About Us:    ' + (data.source || '—') + '\n' +
      'Photo Consent:     ' + (data.photoConsent || 'No') + '\n';

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      replyTo: data.parentEmail || NOTIFICATION_EMAIL
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper for HTML email rows
function row(label, value) {
  return '<tr>' +
    '<td style="padding:8px 12px 8px 0;border-bottom:1px solid #E9DEC5;font-weight:600;color:#46524F;width:36%;">' + label + '</td>' +
    '<td style="padding:8px 0;border-bottom:1px solid #E9DEC5;color:#1A2421;">' + (value || '—') + '</td>' +
  '</tr>';
}

// Optional — useful for testing the script directly in the editor
function doGet() {
  return ContentService.createTextOutput('Dramawize form handler is live.');
}
