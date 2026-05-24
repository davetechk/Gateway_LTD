/* ============================================================
   GATEWAY ACADEMY — PAYMENT MODULE
   assets/js/payment.js

   Requires:  assets/js/config.js (loaded before this file)
              Paystack inline.js from CDN

   SECURITY RULES:
   - NEVER use your Paystack secret key here under any circumstances.
     Only PAYSTACK_PUBLIC_KEY (from config.js) is used here.
   - Never handle or log full card details — Paystack handles all
     card data on their servers.
   ============================================================ */

const GatewayPayment = (() => {

  /* ----------------------------------------------------------
     INITIATE PAYMENT
     options = {
       email        : string  — pre-filled from Supabase session
       amount       : number  — amount in NAIRA (converted to kobo internally)
       fullName     : string  — for the Paystack modal display
       metadata     : object  — any extra metadata to attach to the transaction
       onSuccess    : fn(reference) — called when payment is verified by Paystack
       onClose      : fn()          — called when the user closes the modal
     }
  ---------------------------------------------------------- */
  function initiatePayment({ email, amount, fullName, metadata = {}, onSuccess, onClose }) {
    if (!email || !amount) {
      console.error('GatewayPayment: email and amount are required.');
      return;
    }

    // Generate a unique transaction reference
    const reference = 'GTW_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const handler = PaystackPop.setup({
      key:       PAYSTACK_PUBLIC_KEY,
      email:     email,
      amount:    Math.round(amount * 100), // convert Naira → kobo
      currency:  'NGN',
      ref:       reference,
      firstname: fullName ? fullName.split(' ')[0] : '',
      lastname:  fullName ? fullName.split(' ').slice(1).join(' ') : '',
      metadata: {
        custom_fields: [
          { display_name: 'Full Name', variable_name: 'full_name', value: fullName || '' }
        ],
        ...metadata
      },
      callback: function(response) {
        // response.reference is the Paystack transaction reference
        if (onSuccess) onSuccess(response.reference);
      },
      onClose: function() {
        if (onClose) onClose();
      }
    });

    handler.openIframe();
  }

  return { initiatePayment };
})();
