import { YoutubeService } from '../services/youtubeService.js';
import { N8nService } from '../services/n8nService.js';
import { supabase, isSupabaseConfigured, localStore } from '../config/supabase.js';
import { TAXONOMY_DOMAINS } from '../utils/seedFallbackData.js';

export class CurationController {
  static getTaxonomy(req, res) {
    return res.json({ domains: TAXONOMY_DOMAINS });
  }

  static async curatePath(req, res) {
    try {
      const { topic, discipline, domainId, difficulty, query } = req.body;
      const userId = req.user.id;
      const searchQuery = (query || topic || '').trim();

      // 1. Transmit search query to n8n Webhook workflow (LearnLens search)
      let curatedVideos = await N8nService.searchEducationalVideos({
        query: searchQuery,
        topic,
        discipline,
        difficulty
      });

      // 2. If n8n returns recommendations, use them; otherwise fallback to YouTube / Gemini pipeline
      if (!curatedVideos || curatedVideos.length === 0) {
        console.log('[CurationController] Fallback to YouTube curation pipeline');
        curatedVideos = await YoutubeService.curatePath({
          topic,
          discipline,
          domainId,
          difficulty
        });
      }

      // 2. Persist learning path
      const learningPathId = crypto.randomUUID();
      const learningPathRecord = {
        id: learningPathId,
        user_id: userId,
        query_topic: topic,
        discipline,
        domain_id: domainId,
        target_difficulty: difficulty,
        status: 'in_progress',
        created_at: new Date().toISOString()
      };

      const dbVideos = curatedVideos.map((v, idx) => ({
        id: v.id || crypto.randomUUID(),
        learning_path_id: learningPathId,
        youtube_video_id: v.youtube_video_id,
        title: v.title,
        channel_title: v.channel_title,
        description: v.description,
        thumbnail_url: v.thumbnail_url,
        duration_seconds: v.duration_seconds || 1200,
        sequence_order: idx + 1,
        core_concepts: v.core_concepts || [],
        created_at: new Date().toISOString()
      }));

      const videosWithIds = dbVideos.map((v, idx) => ({
        ...v,
        curation_source: curatedVideos[idx]?.curation_source || 'curated_catalog',
        relevance: curatedVideos[idx]?.relevance || 95
      }));

      if (isSupabaseConfigured) {
        try {
          await supabase.from('learning_paths').insert([learningPathRecord]);
          await supabase.from('curated_videos').insert(dbVideos);
        } catch (dbErr) {
          console.warn('[Supabase Curate Path Insert Error]:', dbErr.message);
        }
      }

      // Also persist in localStore for resilience
      localStore.insert('learning_paths', learningPathRecord);
      videosWithIds.forEach((v) => localStore.insert('curated_videos', v));

      return res.status(201).json({
        success: true,
        learningPath: learningPathRecord,
        videos: videosWithIds
      });
    } catch (err) {
      console.error('[CurationController Error]:', err);
      return res.status(500).json({ error: 'Failed to curate academic learning path', details: err.message });
    }
  }

  static async getPathById(req, res) {
    try {
      const { pathId } = req.params;
      let path = null;
      let videos = [];

      if (isSupabaseConfigured) {
        try {
          const { data: pathData } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('id', pathId)
            .maybeSingle();

          if (pathData) {
            path = pathData;
            const { data: videoData } = await supabase
              .from('curated_videos')
              .select('*')
              .eq('learning_path_id', pathId)
              .order('sequence_order', { ascending: true });
            videos = videoData || [];
          }
        } catch (err) {
          console.warn('[Supabase Path Fetch Warning]:', err.message);
        }
      }

      if (!path) {
        path = localStore.get('learning_paths', pathId);
        videos = localStore
          .find('curated_videos', (v) => v.learning_path_id === pathId)
          .sort((a, b) => a.sequence_order - b.sequence_order);
      }

      if (!path) {
        return res.status(404).json({ error: 'Learning path not found' });
      }

      return res.json({ path, videos });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch learning path', details: err.message });
    }
  }

  static async getUserPaths(req, res) {
    try {
      const userId = req.user.id;
      let paths = [];

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('learning_paths')
            .select('*, curated_videos(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (data) paths = data;
        } catch (err) {
          console.warn('[Supabase User Paths Fetch Warning]:', err.message);
        }
      }

      if (paths.length === 0) {
        const localPaths = localStore.find('learning_paths', (p) => p.user_id === userId);
        paths = localPaths.map((p) => ({
          ...p,
          curated_videos: localStore.find('curated_videos', (v) => v.learning_path_id === p.id)
        }));
      }

      return res.json({ paths });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve enrolled paths', details: err.message });
    }
  }
}
