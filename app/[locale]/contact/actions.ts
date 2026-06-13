'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.company ? `Projekt-Anfrage — ${data.company}` : 'Projekt-Anfrage',
    message: data.message.trim(),
    metadata: { company: data.company ?? null },
    source_url: 'contact-form',
  });

  if (error) {
    console.error('Contact form submission error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
