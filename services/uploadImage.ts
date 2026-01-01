import { File } from 'expo-file-system';
import { supabase } from '../lib/supabase';

export async function uploadImageToSupabase(uri: string): Promise<string> {
    const file = new File(uri);
    const buffer = await file.arrayBuffer();

    const ext = getFileExtension(uri) || 'jpg';
    const path = `items/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from('item-images')
        .upload(path, buffer, {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        });

    if (error) throw error;

    const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
    return `${base}/storage/v1/object/public/item-images/${path}`;
}

function getFileExtension(uri: string) {
    return uri.split('.').pop()?.toLowerCase();
}
