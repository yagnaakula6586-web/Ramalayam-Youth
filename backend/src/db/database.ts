import Database from 'better-sqlite3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export interface YearRecord {
  id: string;
  year: number;
  created_at: string;
}

export interface EventAlbumRecord {
  id: string;
  year: number;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  drive_folder_id?: string;
  drive_folder_url?: string;
  photo_count: number;
  video_count: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface MediaItemRecord {
  id: string;
  event_id: string;
  original_name: string;
  mime_type: string;
  media_type: 'photo' | 'video';
  size: number;
  drive_file_id: string;
  web_view_link?: string;
  thumbnail_url?: string;
  created_at: string;
}

let sqliteDb: Database.Database | null = null;
let pgPool: Pool | null = null;
let isPg = false;

export async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl && dbUrl.startsWith('postgres')) {
    try {
      pgPool = new Pool({ connectionString: dbUrl, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
      await pgPool.query('SELECT NOW()');
      isPg = true;
      console.log('✅ Connected to PostgreSQL Database.');
      await setupPgTables();
      await seedDefaultData();
      return;
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection failed, using local SQLite database:', err.message);
    }
  }

  const dbDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'ramayaml_youth.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  console.log('✅ SQLite Database initialized at:', dbPath);

  setupSqliteTables();
  seedDefaultData();
}

function setupSqliteTables() {
  if (!sqliteDb) return;

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS years (
      id TEXT PRIMARY KEY,
      year INTEGER UNIQUE NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_albums (
      id TEXT PRIMARY KEY,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      location TEXT,
      drive_folder_id TEXT,
      drive_folder_url TEXT,
      photo_count INTEGER DEFAULT 0,
      video_count INTEGER DEFAULT 0,
      thumbnail_url TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      media_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      drive_file_id TEXT NOT NULL,
      web_view_link TEXT,
      thumbnail_url TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES event_albums(id) ON DELETE CASCADE
    );
  `);
}

async function setupPgTables() {
  if (!pgPool) return;

  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS years (
      id VARCHAR(64) PRIMARY KEY,
      year INTEGER UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS event_albums (
      id VARCHAR(64) PRIMARY KEY,
      year INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_date VARCHAR(64),
      location VARCHAR(255),
      drive_folder_id VARCHAR(255),
      drive_folder_url TEXT,
      photo_count INTEGER DEFAULT 0,
      video_count INTEGER DEFAULT 0,
      thumbnail_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS media_items (
      id VARCHAR(64) PRIMARY KEY,
      event_id VARCHAR(64) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(64) NOT NULL,
      media_type VARCHAR(32) NOT NULL,
      size BIGINT NOT NULL,
      drive_file_id VARCHAR(255) NOT NULL,
      web_view_link TEXT,
      thumbnail_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function seedDefaultData() {
  const defaultYears = [2026];

  for (const year of defaultYears) {
    if (sqliteDb) {
      sqliteDb.prepare(`INSERT OR IGNORE INTO years (id, year, created_at) VALUES (?, ?, ?)`).run(
        `year_${year}`,
        year,
        new Date().toISOString()
      );
    }
  }

  // EXCLUSIVELY Annadanam Event 2026 and Uragimpu Event 2026 with user's Ganesha image
  const defaultAlbums = [
    {
      id: 'album_2026_annadanam',
      year: 2026,
      title: 'Annadanam Event 2026',
      description: 'Ramayaml Youth community Annadanam grand food distribution event in Vissannapeta.',
      event_date: '2026-08-20',
      location: 'Ramayaml Youth Center, Vissannapeta',
      drive_folder_id: '1k2JbNaa_AyWhc_luXEVHnrNG-uvmVYlI',
      drive_folder_url: 'https://drive.google.com/drive/folders/1k2JbNaa_AyWhc_luXEVHnrNG-uvmVYlI',
      photo_count: 35,
      video_count: 6,
      thumbnail_url: '/images/ganesha_event_profile.png',
    },
    {
      id: 'album_2026_uragimpu',
      year: 2026,
      title: 'Uragimpu Event 2026 (ఉరేగింపు)',
      description: 'Ramayaml Youth traditional grand procession (ఉరేగింపు) and festival celebrations in Vissannapeta.',
      event_date: '2026-09-10',
      location: 'Vissannapeta Village Procession Route',
      drive_folder_id: '1-leSPBd1dPNMt21W5b7AvE6dZEi5Ewe2',
      drive_folder_url: 'https://drive.google.com/drive/folders/1-leSPBd1dPNMt21W5b7AvE6dZEi5Ewe2',
      photo_count: 48,
      video_count: 12,
      thumbnail_url: '/images/ganesha_event_profile.png',
    },
  ];

  if (sqliteDb) {
    sqliteDb.exec(`
      DELETE FROM event_albums 
      WHERE id NOT IN ('album_2026_annadanam', 'album_2026_uragimpu');
    `);

    const stmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO event_albums 
      (id, year, title, description, event_date, location, drive_folder_id, drive_folder_url, photo_count, video_count, thumbnail_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const album of defaultAlbums) {
      stmt.run(
        album.id,
        album.year,
        album.title,
        album.description,
        album.event_date,
        album.location,
        album.drive_folder_id,
        album.drive_folder_url,
        album.photo_count,
        album.video_count,
        album.thumbnail_url,
        new Date().toISOString()
      );
    }
  }
}

export function getAllYears(): number[] {
  if (sqliteDb) {
    const rows = sqliteDb.prepare('SELECT year FROM years ORDER BY year DESC').all() as { year: number }[];
    return rows.map((r) => r.year);
  }
  return [2026];
}

export function getAlbums(year?: number, search?: string): EventAlbumRecord[] {
  if (sqliteDb) {
    let sql = 'SELECT * FROM event_albums WHERE 1=1';
    const params: any[] = [];

    if (year) {
      sql += ' AND year = ?';
      params.push(year);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at ASC';
    return sqliteDb.prepare(sql).all(...params) as EventAlbumRecord[];
  }
  return [];
}

export function getAlbumById(id: string): EventAlbumRecord | undefined {
  if (sqliteDb) {
    return sqliteDb.prepare('SELECT * FROM event_albums WHERE id = ?').get(id) as EventAlbumRecord | undefined;
  }
  return undefined;
}

export function getAlbumByYearAndTitle(year: number, title: string): EventAlbumRecord | undefined {
  if (sqliteDb) {
    return sqliteDb.prepare('SELECT * FROM event_albums WHERE year = ? AND LOWER(title) = LOWER(?)').get(year, title) as EventAlbumRecord | undefined;
  }
  return undefined;
}

export function createAlbum(album: Omit<EventAlbumRecord, 'photo_count' | 'video_count' | 'created_at'>): EventAlbumRecord {
  const newAlbum: EventAlbumRecord = {
    ...album,
    photo_count: 0,
    video_count: 0,
    created_at: new Date().toISOString(),
  };

  if (sqliteDb) {
    sqliteDb.prepare(`
      INSERT INTO event_albums (id, year, title, description, event_date, location, drive_folder_id, drive_folder_url, photo_count, video_count, thumbnail_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newAlbum.id,
      newAlbum.year,
      newAlbum.title,
      newAlbum.description || '',
      newAlbum.event_date || '',
      newAlbum.location || '',
      newAlbum.drive_folder_id || '',
      newAlbum.drive_folder_url || '',
      newAlbum.photo_count,
      newAlbum.video_count,
      newAlbum.thumbnail_url || '/images/ganesha_event_profile.png',
      newAlbum.created_at
    );
  }

  return newAlbum;
}

export function saveMediaItem(item: Omit<MediaItemRecord, 'created_at'>): MediaItemRecord {
  const newItem: MediaItemRecord = {
    ...item,
    created_at: new Date().toISOString(),
  };

  if (sqliteDb) {
    sqliteDb.prepare(`
      INSERT INTO media_items (id, event_id, original_name, mime_type, media_type, size, drive_file_id, web_view_link, thumbnail_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newItem.id,
      newItem.event_id,
      newItem.original_name,
      newItem.mime_type,
      newItem.media_type,
      newItem.size,
      newItem.drive_file_id,
      newItem.web_view_link || '',
      newItem.thumbnail_url || '',
      newItem.created_at
    );

    const countCol = newItem.media_type === 'video' ? 'video_count' : 'photo_count';
    sqliteDb.prepare(`UPDATE event_albums SET ${countCol} = ${countCol} + 1 WHERE id = ?`).run(newItem.event_id);
  }

  return newItem;
}

export function getMediaItemsByEventId(eventId: string): MediaItemRecord[] {
  if (sqliteDb) {
    return sqliteDb.prepare('SELECT * FROM media_items WHERE event_id = ? ORDER BY created_at DESC').all(eventId) as MediaItemRecord[];
  }
  return [];
}

export function getPlatformStats() {
  if (sqliteDb) {
    const albumCount = (sqliteDb.prepare('SELECT COUNT(*) as count FROM event_albums').get() as any).count;
    const mediaRow = sqliteDb.prepare('SELECT SUM(photo_count) as photos, SUM(video_count) as videos FROM event_albums').get() as any;
    
    return {
      totalAlbums: albumCount || 2,
      totalPhotos: mediaRow?.photos || 83,
      totalVideos: mediaRow?.videos || 18,
    };
  }

  return { totalAlbums: 2, totalPhotos: 83, totalVideos: 18 };
}
