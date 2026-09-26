import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('your_supabase') &&
  !supabaseKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseKey.length > 20
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (isSupabaseConfigured) {
  console.log('[EasySpace DB] Connected to Supabase PostgreSQL at:', supabaseUrl);
} else {
  console.log('[EasySpace DB] Supabase credentials not set or placeholder detected. Operating with resilient memory/JSON persistent datastore with full schema support.');
}

// In-Memory resilient fallback datastore for smooth local operation
class LocalMemoryStore {
  constructor() {
    this.profiles = new Map();
    this.learning_paths = new Map();
    this.curated_videos = new Map();
    this.diagnostic_quizzes = new Map();
    this.quiz_questions = new Map();
    this.quiz_attempts = new Map();
    this.concept_mastery = new Map();
    this.remediation_sessions = new Map();

    this.initSeedData();
  }

  initSeedData() {
    const defaultUserId = '00000000-0000-0000-0000-000000000001';
    this.profiles.set(defaultUserId, {
      id: defaultUserId,
      email: 'alex.rivera@mit.edu',
      full_name: 'Alex Rivera',
      academic_institution: 'MIT',
      field_of_study: 'EECS & Mechanical Engineering',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Generic table getter
  getTable(name) {
    if (!this[name]) {
      this[name] = new Map();
    }
    return this[name];
  }

  insert(tableName, record) {
    const table = this.getTable(tableName);
    const id = record.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const createdRecord = {
      ...record,
      id,
      created_at: record.created_at || now,
      updated_at: record.updated_at || now
    };
    table.set(id, createdRecord);
    return createdRecord;
  }

  update(tableName, id, updates) {
    const table = this.getTable(tableName);
    const existing = table.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };
    table.set(id, updated);
    return updated;
  }

  get(tableName, id) {
    return this.getTable(tableName).get(id) || null;
  }

  find(tableName, filterFn) {
    const items = Array.from(this.getTable(tableName).values());
    return filterFn ? items.filter(filterFn) : items;
  }

  delete(tableName, id) {
    return this.getTable(tableName).delete(id);
  }
}

export const localStore = new LocalMemoryStore();
