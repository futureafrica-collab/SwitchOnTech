import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "Switchon Tech <noreply@switchontech.com>";

const brandHeader = `
<div style="background: linear-gradient(135deg, #1a237e 0%, #7b2ff7 50%, #f107a3 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
  <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-family: 'Arial', sans-serif; font-weight: bold;">⚡ Switchon Tech</h1>
  <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 6px 0 0;">Complete ICT Center</p>
</div>`;

const brandFooter = `
<div style="background: #f8f9fa; padding: 24px 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
  <p style="color: #6c757d; font-size: 12px; margin: 0 0 6px;">Switchon Tech — Complete ICT Center</p>
  <p style="color: #6c757d; font-size: 12px; margin: 0 0 6px;">📞 08050624942 | ✉️ switchontech@gmail.com</p>
  <p style="color: #adb5bd; font-size: 11px; margin: 8px 0 0;">You received this email because of your interaction with Switchon Tech.</p>
</div>`;

const wrap = (body: string) => `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI','Arial',sans-serif;">
<div style="max-width:560px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
${brandHeader}
<div style="padding:28px 24px;">
${body}
</div>
${brandFooter}
</div></body></html>`;

const formatNaira = (n: number) => "₦" + Number(n).toLocaleString("en-NG");

const templates: Record<string, (data: any) => { subject: string; html: string }> = {

  "order-confirmation": (d) => ({
    subject: "Order Confirmed — Switchon Tech",
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">Thank you for your order, ${d.customer_name}!</h2>
      <p style="color:#0d1b4b;font-size:14px;">Your order <strong style="color:#7b2ff7;">${d.reference}</strong> has been received.</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-weight:bold;color:#1a237e;margin:0 0 10px;font-size:14px;">Items Ordered:</p>
        ${(d.items || []).map((i: any) => `<p style="color:#0d1b4b;font-size:13px;margin:4px 0;">• ${i.name} × ${i.quantity} — ${formatNaira(i.price)}</p>`).join("")}
        <hr style="border:none;border-top:1px solid #dee2e6;margin:12px 0;">
        <p style="font-weight:bold;color:#1a237e;font-size:15px;margin:0;">Total: ${formatNaira(d.total_amount)}</p>
      </div>
      <p style="color:#0d1b4b;font-size:13px;">📍 Delivery: ${d.delivery_address}, ${d.city}, ${d.state}</p>
      <p style="color:#6c757d;font-size:13px;margin-top:16px;">We will contact you shortly to confirm your order. Call us at <strong>08050624942</strong> for any questions.</p>
    `),
  }),

  "order-status-update": (d) => ({
    subject: `Your Order Status Update — Switchon Tech`,
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">Order Status Update</h2>
      <p style="color:#0d1b4b;font-size:14px;">Hi ${d.customer_name}, your order <strong style="color:#7b2ff7;">${d.reference}</strong> has been updated.</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
        <p style="font-size:12px;color:#6c757d;margin:0 0 6px;">NEW STATUS</p>
        <p style="font-size:20px;font-weight:bold;color:#7b2ff7;margin:0;text-transform:uppercase;">${d.status}</p>
      </div>
      <p style="color:#0d1b4b;font-size:13px;">${statusMeaning("order", d.status)}</p>
      <p style="color:#6c757d;font-size:13px;margin-top:16px;">Questions? Call us at <strong>08050624942</strong>.</p>
    `),
  }),

  "repair-confirmation": (d) => ({
    subject: "Repair Request Received — Switchon Tech",
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">We received your repair request!</h2>
      <p style="color:#0d1b4b;font-size:14px;">Hi ${d.full_name}, thank you for reaching out.</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0;"><strong>Device:</strong> ${d.device_type}${d.device_model ? " — " + d.device_model : ""}</p>
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0;"><strong>Issue:</strong> ${d.issue_description}</p>
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0;"><strong>Urgency:</strong> ${d.urgency}</p>
      </div>
      <p style="color:#0d1b4b;font-size:13px;">Our technician will contact you within <strong>2 hours</strong> on <strong>${d.phone}</strong>.</p>
    `),
  }),

  "repair-status-update": (d) => ({
    subject: "Repair Update — Switchon Tech",
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">Repair Status Update</h2>
      <p style="color:#0d1b4b;font-size:14px;">Hi ${d.full_name}, your repair request has been updated.</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
        <p style="font-size:12px;color:#6c757d;margin:0 0 6px;">NEW STATUS</p>
        <p style="font-size:20px;font-weight:bold;color:#7b2ff7;margin:0;text-transform:uppercase;">${d.status}</p>
      </div>
      <p style="color:#0d1b4b;font-size:13px;">${statusMeaning("repair", d.status)}</p>
      <p style="color:#6c757d;font-size:13px;margin-top:16px;">Questions? Call us at <strong>08050624942</strong>.</p>
    `),
  }),

  "welcome": (d) => ({
    subject: "Welcome to Switchon Tech!",
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">Welcome to Switchon Tech, ${d.full_name}!</h2>
      <p style="color:#0d1b4b;font-size:14px;">We're excited to have you on board. Here's what you can do:</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:13px;color:#0d1b4b;margin:6px 0;">🛒 <strong>Shop</strong> — Browse our latest computers & accessories</p>
        <p style="font-size:13px;color:#0d1b4b;margin:6px 0;">🔧 <strong>Request Repairs</strong> — Submit repair requests online</p>
        <p style="font-size:13px;color:#0d1b4b;margin:6px 0;">📦 <strong>Track Orders</strong> — Monitor your order status in real time</p>
        <p style="font-size:13px;color:#0d1b4b;margin:6px 0;">📰 <strong>Read Our Blog</strong> — Stay updated with tech tips and news</p>
      </div>
      <p style="color:#6c757d;font-size:13px;">Need help? Reach us at <strong>08050624942</strong>.</p>
    `),
  }),

  "newsletter-welcome": (d) => ({
    subject: "You're subscribed — Switchon Tech Newsletter",
    html: wrap(`
      <h2 style="color:#1a237e;margin:0 0 16px;">Welcome to the community! 🎉</h2>
      <p style="color:#0d1b4b;font-size:14px;">You've successfully subscribed to the Switchon Tech newsletter.</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:13px;color:#0d1b4b;margin:6px 0;">📬 What to expect:</p>
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0 4px 12px;">• Latest tech tips & tutorials</p>
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0 4px 12px;">• Product reviews & deals</p>
        <p style="font-size:13px;color:#0d1b4b;margin:4px 0 4px 12px;">• Industry news & updates</p>
      </div>
      <p style="color:#6c757d;font-size:13px;">To unsubscribe, reply to this email with "unsubscribe".</p>
    `),
  }),
};

function statusMeaning(type: string, status: string): string {
  const s = status?.toLowerCase();
  if (type === "order") {
    const m: Record<string, string> = {
      pending: "Your order has been received and is awaiting confirmation.",
      confirmed: "Your order has been confirmed. We're preparing it now.",
      processing: "Your order is being processed and packed.",
      shipped: "Your order has been shipped! It's on its way to you.",
      delivered: "Your order has been delivered. Enjoy!",
      cancelled: "Your order has been cancelled. Contact us if you have questions.",
    };
    return m[s] || "Your order status has been updated.";
  }
  const m: Record<string, string> = {
    pending: "Your repair request is in queue. A technician will review it shortly.",
    "in progress": "A technician is currently working on your device.",
    completed: "Your repair is complete! You can pick up your device or we'll deliver it.",
    cancelled: "Your repair request has been cancelled. Contact us if this was a mistake.",
  };
  return m[s] || "Your repair status has been updated.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { template, data, to } = await req.json();

    if (!template || !templates[template]) {
      return new Response(JSON.stringify({ error: "Invalid template" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!to) {
      return new Response(JSON.stringify({ error: "Missing 'to' email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = templates[template](data || {});

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: result }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
