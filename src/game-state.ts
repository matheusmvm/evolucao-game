/** V14 source model: kept as source documentation; the GitHub Pages runtime uses script.js. */
export interface Relation { trust:number; trade:number; science:number; }
export interface Nation { id:string; name:string; region:string; territory:number; economy:number; military:number; tension:number; attitude:number; }
export interface GameState { year:number; round:number; actionsLeft:number; population:number; treasury:number; science:number; technology:number; economy:number; military:number; diplomacyPower:number; trade:number; nations:Record<string,Nation>; relations:Record<string,Relation>; tradeRoutes:Record<string, unknown>; tech:Record<string,number>; }
export type ActionCost = 1 | 2;
