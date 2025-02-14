/**
 * Default avatars for players
 * Each avatar represents a different dwarf miner with unique characteristics
 * TODO: Replace with actual avatar images once available
 */
export const PLAYER_AVATARS = {
  // Using a generic placeholder until custom avatars are created
  THORIN: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=thorin&backgroundColor=b6e3f4&radius=50',
  GIMLI: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=gimli&backgroundColor=c1d1f0&radius=50',
  DWALIN: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dwalin&backgroundColor=d4c5f9&radius=50',
  BALIN: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=balin&backgroundColor=b6e3f4&radius=50',
  BOFUR: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=bofur&backgroundColor=c1d1f0&radius=50'
};

/**
 * Default player configurations
 */
export const DEFAULT_PLAYERS = [
  {
    id: 1,
    name: 'Thorin Goldbeard',
    avatar: PLAYER_AVATARS.THORIN,
    description: 'A natural leader with a keen eye for precious metals'
  },
  {
    id: 2,
    name: 'Gimli Ironfoot',
    avatar: PLAYER_AVATARS.GIMLI,
    description: 'A fierce warrior who never backs down from a challenge'
  },
  {
    id: 3,
    name: 'Dwalin Rockfist',
    avatar: PLAYER_AVATARS.DWALIN,
    description: 'A battle-hardened veteran who knows every tunnel trick'
  },
  {
    id: 4,
    name: 'Balin Gemseeker',
    avatar: PLAYER_AVATARS.BALIN,
    description: 'A wise elder with deep knowledge of mineral lore'
  },
  {
    id: 5,
    name: 'Bofur Pickaxe',
    avatar: PLAYER_AVATARS.BOFUR,
    description: 'A cheerful miner who keeps spirits high in dark places'
  }
];
