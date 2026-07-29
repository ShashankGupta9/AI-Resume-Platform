import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a resume file to Supabase Storage bucket 'resumes'.
 * Falls back to local storage if Supabase credentials are missing or unconfigured.
 */
export async function uploadResumeFile(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; storageType: 'supabase' | 'local' }> {
  const sanitizedFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // Try Supabase Storage first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(sanitizedFileName, buffer, {
          contentType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(data.path);

        return {
          url: publicUrlData.publicUrl,
          storageType: 'supabase',
        };
      }
    } catch (err) {
      console.warn('Supabase upload fallback to local:', err);
    }
  }

  // Fallback to local file storage for seamless local development
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, sanitizedFileName);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${sanitizedFileName}`,
    storageType: 'local',
  };
}
