/**
 * Normalizes and cleans input text (lowercase, removes punctuation, collapses spaces, and maps synonyms).
 */
export function normalizeText(text: string): string {
  let cleaned = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const synonyms: { [key: string]: string } = {
    "kades": "kepala desa",
    "kk": "kartu keluarga",
    "ktp-el": "kartu tanda penduduk",
    "ktp": "kartu tanda penduduk",
    "apbdes": "anggaran desa",
    "umkm": "produk lokal",
  };

  for (const [key, replacement] of Object.entries(synonyms)) {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    cleaned = cleaned.replace(regex, replacement);
  }

  return cleaned;
}

/**
 * Calculates the Cosine Similarity of character trigrams between two strings.
 * This runs entirely locally, maps synonyms, and handles spelling variations and typos.
 * Returns a score between 0.0 and 1.0.
 */
export function getTrigramCosineSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1.0;
  if (s1.length < 3 || s2.length < 3) return 0.0;

  // Extract character trigrams
  const getTrigrams = (str: string): { [trigram: string]: number } => {
    const counts: { [trigram: string]: number } = {};
    for (let i = 0; i < str.length - 2; i++) {
      const trigram = str.substring(i, i + 3);
      counts[trigram] = (counts[trigram] || 0) + 1;
    }
    return counts;
  };

  const trigrams1 = getTrigrams(s1);
  const trigrams2 = getTrigrams(s2);

  // Get union of all trigrams
  const allTrigrams = new Set([...Object.keys(trigrams1), ...Object.keys(trigrams2)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const trigram of allTrigrams) {
    const countA = trigrams1[trigram] || 0;
    const countB = trigrams2[trigram] || 0;

    dotProduct += countA * countB;
    normA += countA * countA;
    normB += countB * countB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
