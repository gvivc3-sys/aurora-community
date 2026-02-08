export function extractVideoId(
  url: string,
): { provider: "vimeo" | "youtube"; id: string } | null {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?.*v=)([\w-]+)/,
    /youtu\.be\/([\w-]+)/,
    /youtube\.com\/embed\/([\w-]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) return { provider: "youtube", id: match[1] };
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(?:video\/)?(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/[\w-]+\/(\d+)/,
    /vimeo\.com\/groups\/[\w-]+\/videos\/(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) return { provider: "vimeo", id: match[1] };
  }

  return null;
}

export function getEmbedUrl(provider: "vimeo" | "youtube", id: string): string {
  if (provider === "youtube") {
    return `https://www.youtube.com/embed/${id}`;
  }
  return `https://player.vimeo.com/video/${id}`;
}
