# Payments, cancellations and refunds

## Current scope
Cashfree is the chosen gateway. The hosted checkout and verified-payment hooks already exist. This update adds the payment dashboard, customer service requests and admin review workflow. Refund submission and refund webhooks are **not connected**. Approved refunds remain `providerStatus: not_submitted`. No admin or customer button can mark a refund completed or transfer money.

Local demo orders never collect money and cannot generate a monetary refund. Live checkout stays disabled without configured Cashfree credentials. Firebase still handles authentication; MySQL stores profiles, orders and embedded service requests locally. This work does not remove Firebase authentication or migrate live data.

## Enforced rules
- Only authenticated customers may order or view their own orders. Only verified admin roles may review requests. Other customers receive 404 for private order operations.
- Server prices, tax, delivery and stock determine the payable amount in INR. A client total is never trusted. Checkout uses a stable idempotency key and transactions for inventory reservation.
- Cashfree credentials are server-only. Card details, CVV and UPI PIN are entered only in hosted Cashfree checkout, never stored by this app.
- Redirects and browser success messages do not mark orders paid. The server verifies provider order ID, currency and amount before confirming payment. Raw-body signatures are checked for payment webhooks.
- A pending or failed payment must not be shipped. Customers can retry/check pending payments when the gateway is enabled. Demo mode is limited to local emulator mode.
- Cancellation requests are accepted only before shipment (`pending_payment`, `confirmed`, `processing`) and require a reason. An active request blocks fulfillment until reviewed.
- Pending Cashfree orders cannot have cancellation approved until provider reconciliation is implemented/completed. Do not release reserved stock based on an unverified browser failure: late payment may occur.
- An approved cancellation changes the order to cancelled and restores stock in the same transaction, once only. Paid cancellations automatically queue a full refund for processing. Payment remains paid until a future verified refund confirmation.
- Refund requests require a paid delivered/cancelled order. Demo orders cannot be refunded. Requests are subject to merchant review and the published returns policy; the UI makes no automatic eligibility or timing promises.
- Delivered-order refund approval requires the reviewer to confirm the return has been received or waived. Return approval does not automatically restock a used/damaged item.
- Admin review requires a note, reviewer UID and timestamp. Approval and rejection are final for that request. Repeating the same decision is idempotent. A customer may submit a new request after rejection, up to ten requests per order.
- One active request per type is allowed. Duplicate submissions return the existing request. Only full-order refunds are represented in this phase, capped at the server order total; partial refunds are not implemented.
- Refund approval is distinct from provider submission and completion. The dashboard explicitly shows when no money has been refunded. Manual-order payment entries are bookkeeping records, not proof of a Cashfree transaction.

## Stored request model
`order.serviceRequests[]`: `id`, `type` (cancellation/refund), `reason`, `status` (requested/approved/rejected), `requestedAt`, optional `amountPaise`, `reviewedAt`, `reviewedBy`, `note`, `returnConfirmed`, and `providerStatus`.

## Internal API
- `POST /api/orders/:id/requests`: `{type, reason}` — customer ownership enforced.
- `POST /api/admin/orders/:id/requests/:requestId`: `{decision, note, returnConfirmed}` — admin only.
- Existing checkout: `POST /api/orders`, `POST /api/orders/:id/payment`, `POST /api/orders/:id/verify`.
- Existing payment webhook: `POST /api/payments/cashfree/webhook`.

## Before activating real payments/refunds
1. Configure server-only `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, `CASHFREE_MODE=sandbox`, and public HTTPS `PUBLIC_STORE_URL`; verify the merchant domain and permitted payment methods in Cashfree.
2. Complete sandbox payment, retry, duplicate webhook, late payment and reconciliation tests. Change to production credentials/mode only after verification.
3. Implement server-side refund submission using a persisted unique refund ID. Persist intent before the provider call; retry using the same ID and reconcile unknown network outcomes before sending another request.
4. Implement signed refund callbacks and periodic reconciliation. Check provider order/refund IDs, currency and amount; prevent duplicate/over-refunds and never allow a browser or plain admin field to set `refunded`.
5. Implement unpaid-order expiry with provider reconciliation before releasing stock. The current system conservatively keeps pending reservations.
6. Add a provider attempt ledger and reconciliation worker for successful, pending, failed, user-dropped and late-authorized attempts. Do not downgrade a verified paid order because a different attempt failed.
7. Publish the merchant-approved return window, excluded products, inspection rules, shipping deductions, timelines and support details before accepting real orders. No return deadline or refund completion SLA is invented by this implementation.

Reference: https://www.cashfree.com/devstudio/preview/pg/web/checkout
