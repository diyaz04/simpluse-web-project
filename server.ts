<<<<<<< HEAD
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Server client if credentials are set
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const isRealSupabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder');
const supabaseServer = isRealSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'diyaznajib.93@gmail.com';

// API: Handle Order Submission
app.post('/api/orders', async (req, res) => {
  const { full_name, whatsapp, email, website_type, description, budget, deadline } = req.body;

  let savedOrder = null;

  // 1. Try to save to Supabase
  if (supabaseServer) {
    try {
      const { data, error } = await supabaseServer
        .from('orders')
        .insert([{
          full_name,
          whatsapp,
          email,
          website_type,
          description,
          budget,
          deadline,
          status: 'new'
        }])
        .select()
        .single();

      if (!error && data) {
        savedOrder = data;
        console.log('Order successfully saved to Supabase server side.');
      } else {
        console.warn('Supabase DB error, order not saved to cloud database:', error);
      }
    } catch (dbError) {
      console.error('Failed to execute Supabase query:', dbError);
    }
  }

  // 2. Try to dispatch email via Resend
  if (resend) {
    try {
      // Create a nice styled HTML layout for the email notification
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; background-color: #FAFAFA;">
          <h2 style="color: #EA580C; margin-top: 0;">Simpluse Web Project — Notifikasi Order Baru!</h2>
          <p>Halo Owner, Anda telah menerima pengajuan order pembuatan website baru dari calon klien.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #F3F4F6;">
              <td style="padding: 10px; font-weight: bold; width: 180px; border: 1px solid #E5E7EB;">Nama Lengkap</td>
              <td style="padding: 10px; border: 1px solid #E5E7EB;">${full_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB;">No. WhatsApp</td>
              <td style="padding: 10px; border: 1px solid #E5E7EB;">
                <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" style="color: #ea580c; text-decoration: none; font-weight: 500;">
                  ${whatsapp}
                </a>
              </td>
            </tr>
            <tr style="background-color: #F3F4F6;">
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB;">Email</td>
              <td style="padding: 10px; border: 1px solid #E5E7EB;">
                <a href="mailto:${email}" style="color: #ea580c; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB;">Jenis Website</td>
              <td style="padding: 10px; font-weight: bold; color: #111827; border: 1px solid #E5E7EB;">${website_type}</td>
            </tr>
            <tr style="background-color: #F3F4F6;">
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB;">Estimasi Budget</td>
              <td style="padding: 10px; color: #047857; font-weight: 600; border: 1px solid #E5E7EB;">${budget}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB;">Deadline</td>
              <td style="padding: 10px; border: 1px solid #E5E7EB;">${deadline}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #E5E7EB; vertical-align: top;">Kebutuhan & Deskripsi</td>
              <td style="padding: 10px; border: 1px solid #E5E7EB; white-space: pre-wrap;">${description}</td>
            </tr>
          </table>
          
          <div style="text-align: center; margin-top: 25px;">
            <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(full_name)}%2C%20saya%20dari%20Simpluse%20Web%20Project%20terkait%20order%20website%20${encodeURIComponent(website_type)}%20..." 
               style="background-color: #EA580C; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
               Hubungi via WhatsApp
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 25px 0;" />
          <p style="font-size: 11px; color: #9CA3AF; text-align: center;">Email dikirim otomatis oleh integrasi server Resend dari web app Simpluse Web.</p>
        </div>
      `;

      // Resend restrictions for sandbox: if domain is not configured, send to verified email (the owner).
      const resendSender = 'onboarding@resend.dev'; // Standard Resend sandbox sender
      await resend.emails.send({
        from: `Simpluse Portal <${resendSender}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `[Order Baru] ${website_type} - ${full_name}`,
        html: emailHtml,
      });
      console.log(`Notification email dispatched to owner: ${OWNER_EMAIL}`);
    } catch (resendError) {
      console.error('Resend email sending failed:', resendError);
    }
  } else {
    console.warn('Resend key absent. Notification email transmission skipped.');
  }

  return res.json(savedOrder || { success: true, localOnly: true });
});

// Configure Vite or Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
=======
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fetch from "node-fetch";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for scraping website content
  app.post("/api/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Basic text extraction from common tags
      // In a real app, you'd use a parser like Cheerio, but we keep it simple for now
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : "";
      
      // Extract meta description
      const descMatch = html.match(/<meta name="description" content="(.*?)"/);
      const description = descMatch ? descMatch[1] : "";

      // Extract some body text (first 2000 chars of body)
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
      let bodyText = bodyMatch ? bodyMatch[1] : html;
      
      // Clean up tags
      bodyText = bodyText.replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .substring(0, 3000);

      res.json({ title, description, bodyText });
    } catch (error: any) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
>>>>>>> c13a4f057412919f64019d17e2c47ad1cecf9719
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

<<<<<<< HEAD
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Simpluse Server] Running on http://localhost:${PORT}`);
  });
}

setupServer();
=======
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
>>>>>>> c13a4f057412919f64019d17e2c47ad1cecf9719
