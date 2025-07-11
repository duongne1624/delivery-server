import axios from 'axios';

export async function isImageUrl(url: string): Promise<boolean> {
  try {
    const res = await axios.head(url);
    return res.headers['content-type']?.startsWith('image/');
  } catch {
    return false;
  }
}
