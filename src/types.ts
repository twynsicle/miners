export type PathType = number[];
export type PathsType = PathType[];

export type CardType = 'start' | 'dest' | 'path' | 'action';

export type ActionCardType = 'break_pickaxe' | 'break_lantern' | 'break_cart' | 
                           'fix_pickaxe' | 'fix_lantern' | 'fix_cart' | 
                           'view_dest' | 'cave_in';

export interface ActionCardData {
  id: string;
  text: string;
  color: string;
  count: number;
}
