type ProfileMetadata = {
  custom_avatar_url?: string;
  avatar_url?: string;
  username?: string;
  bio?: string;
  birthday?: string;
  telegram_handle?: string;
  instagram_handle?: string;
  location_city?: string;
};

const FIELDS: { key: string; filled: (meta: ProfileMetadata) => boolean }[] = [
  { key: "avatar", filled: (m) => !!(m.custom_avatar_url || m.avatar_url) },
  { key: "name", filled: (m) => !!m.username },
  { key: "bio", filled: (m) => !!m.bio },
  { key: "birthday", filled: (m) => !!m.birthday },
  { key: "telegram", filled: (m) => !!m.telegram_handle },
  { key: "instagram", filled: (m) => !!m.instagram_handle },
  { key: "location", filled: (m) => !!m.location_city },
];

export function getProfileCompletion(meta: ProfileMetadata) {
  const filled = FIELDS.filter((f) => f.filled(meta)).length;
  const total = FIELDS.length;
  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
    isComplete: filled === total,
  };
}
