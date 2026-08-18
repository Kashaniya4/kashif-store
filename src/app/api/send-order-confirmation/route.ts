import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Order } from '@/types/store';

interface RequestBody {
  order: Order;
}

const PAYMENT_LABELS: Record<string, string> = {
  jazzcash: 'JazzCash',
  easypaisa: 'EasyPaisa',
  sadapay: 'SadaPay',
  nayapay: 'NayaPay',
  cod: 'Cash on Delivery',
  bank_transfer: 'Bank Transfer (IBAN)',
  card: 'Visa / Mastercard',
};

const STATUS_LABELS: Record<string, string> = {
  paid: 'PAID',
  unpaid: 'PAY ON DELIVERY',
  pending_verification: 'PENDING VERIFICATION',
};

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

function buildEmailHtml(order: Order): string {
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #1f2937;color:#e5e7eb;font-size:14px;">
            ${item.product.name}
            <div style="color:#94a3b8;font-size:12px;margin-top:2px;">Qty: ${item.quantity} × ${formatCurrency(item.product.price)}</div>
          </td>
          <td style="padding:12px;border-bottom:1px solid #1f2937;color:#10b981;font-weight:700;text-align:right;font-size:14px;">
            ${formatCurrency(item.product.price * item.quantity)}
          </td>
        </tr>`
    )
    .join('');

  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod;
  const statusLabel = STATUS_LABELS[order.paymentStatus] || order.paymentStatus.toUpperCase();
  const placedAt = new Date(order.createdAt).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e5e7eb;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#020617;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#0d9488);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#020617;font-size:24px;font-weight:900;letter-spacing:-0.5px;">sastamaal.net</h1>
              <p style="margin:8px 0 0 0;color:#022c22;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 24px 16px 24px;">
              <h2 style="margin:0 0 8px 0;color:#fff;font-size:20px;font-weight:700;">Thank you, ${order.customer.fullName}!</h2>
              <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">
                Your order has been placed successfully. Here are the details for your reference. Our team will dispatch your items within 24 hours.
              </p>
            </td>
          </tr>

          <!-- Order summary box -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;background:#020617;border:1px solid #1e293b;border-radius:12px;">
                <tr>
                  <td style="padding:16px;">
                    <div style="margin-bottom:10px;">
                      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Order Number</div>
                      <div style="color:#10b981;font-size:18px;font-weight:800;font-family:monospace;margin-top:2px;">${order.orderNumber}</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                      <span style="color:#64748b;font-size:13px;">Placed On</span>
                      <span style="color:#fff;font-size:13px;font-weight:600;">${placedAt}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                      <span style="color:#64748b;font-size:13px;">Payment Method</span>
                      <span style="color:#fff;font-size:13px;font-weight:600;">${paymentLabel}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span style="color:#64748b;font-size:13px;">Payment Status</span>
                      <span style="color:${order.paymentStatus === 'paid' ? '#10b981' : '#fbbf24'};font-size:13px;font-weight:700;">${statusLabel}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items table -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <h3 style="margin:0 0 12px 0;color:#fff;font-size:15px;font-weight:700;">Order Items</h3>
              <table role="presentation" style="width:100%;border-collapse:collapse;background:#020617;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
                <tr style="background:#0f172a;">
                  <td style="padding:10px 12px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;border-bottom:1px solid #1e293b;">Product</td>
                  <td style="padding:10px 12px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;border-bottom:1px solid #1e293b;text-align:right;">Amount</td>
                </tr>
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;color:#94a3b8;font-size:13px;">Subtotal</td>
                  <td style="padding:6px 0;color:#fff;font-size:13px;text-align:right;">${formatCurrency(order.subtotal)}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `<tr>
                  <td style="padding:6px 0;color:#10b981;font-size:13px;font-weight:600;">Discount ${order.promoCodeApplied ? `(${order.promoCodeApplied})` : ''}</td>
                  <td style="padding:6px 0;color:#10b981;font-size:13px;text-align:right;font-weight:600;">- ${formatCurrency(order.discount)}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding:6px 0;color:#94a3b8;font-size:13px;">Shipping</td>
                  <td style="padding:6px 0;color:#fff;font-size:13px;text-align:right;">${order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0 0;border-top:1px solid #1e293b;color:#fff;font-size:14px;font-weight:800;">Total</td>
                  <td style="padding:14px 0 0 0;border-top:1px solid #1e293b;color:#10b981;font-size:18px;text-align:right;font-weight:900;">${formatCurrency(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery info -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <h3 style="margin:0 0 12px 0;color:#fff;font-size:15px;font-weight:700;">Delivery Details</h3>
              <table role="presentation" style="width:100%;border-collapse:collapse;background:#020617;border:1px solid #1e293b;border-radius:12px;">
                <tr>
                  <td style="padding:16px;">
                    <div style="margin-bottom:8px;color:#fff;font-size:13px;font-weight:700;">${order.customer.fullName}</div>
                    <div style="margin-bottom:4px;color:#94a3b8;font-size:13px;">${order.customer.phone}</div>
                    ${order.customer.email ? `<div style="margin-bottom:8px;color:#94a3b8;font-size:13px;">${order.customer.email}</div>` : ''}
                    <div style="color:#94a3b8;font-size:13px;line-height:1.5;">${order.customer.address}, ${order.customer.city}</div>
                    ${
                      order.courier
                        ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #1e293b;color:#10b981;font-size:12px;font-weight:600;">🚚 ${order.courier}${order.trackingNumber ? ` · Tracking: ${order.trackingNumber}` : ''}</div>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 24px 24px 24px;text-align:center;">
              <a href="https://sastamaal.net" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#10b981,#0d9488);color:#020617;text-decoration:none;border-radius:12px;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Track Your Order</a>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding:0 24px 24px 24px;text-align:center;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">Need help? Contact our Pakistani support team</p>
              <p style="margin:0;color:#10b981;font-size:13px;font-weight:700;">📞 0339-7100515 · ✉ blasterbeaty@gmail.com</p>
              <p style="margin:8px 0 0 0;color:#64748b;font-size:11px;">Al-Hamd telecom, Main Sir Sayyad Road, Block 8, Khanewal</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#020617;padding:20px 24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#64748b;font-size:11px;">© ${new Date().getFullYear()} sastamaal.net · Pakistan's trusted mobile accessories store</p>
              <p style="margin:6px 0 0 0;color:#475569;font-size:10px;">This is an automated confirmation. Please keep this email for your records.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { order } = body;

    if (!order || !order.customer || !order.items || order.items.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    const customerEmail = order.customer.email?.trim();

    // No email on file — nothing to send, but we accept the call so UI does not break.
    if (!customerEmail) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'No customer email on order.',
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.ORDER_EMAIL_FROM || 'orders@sastamaal.net';

    // No Resend key configured (e.g. local dev without secrets) — log and skip gracefully.
    if (!apiKey) {
      console.warn('[order-email] RESEND_API_KEY missing — order confirmation email not sent.');
      console.warn('[order-email] would have sent to:', customerEmail, 'order:', order.orderNumber);
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'Email service not configured.',
      });
    }

    const resend = new Resend(apiKey);
    const subject = `Order ${order.orderNumber} confirmed — sastamaal.net`;
    const html = buildEmailHtml(order);

    const { data, error } = await resend.emails.send({
      from: `sastamaal.net <${fromAddress}>`,
      to: [customerEmail],
      subject,
      html,
    });

    if (error) {
      console.error('[order-email] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, messageId: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[order-email] unhandled error:', message);
    return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 });
  }
}
