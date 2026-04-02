const brevo = require('@getbrevo/brevo');
console.log('--- Brevo SDK Inspection ---');
console.log('Object Keys:', Object.keys(brevo));
console.log('TransactionalEmailsApi type:', typeof brevo.TransactionalEmailsApi);
if (typeof brevo.TransactionalEmailsApi === 'function') {
    try {
        const test = new brevo.TransactionalEmailsApi();
        console.log('Successfully created TransactionalEmailsApi instance');
    } catch (e) {
        console.log('Failed to create instance:', e.message);
    }
}
