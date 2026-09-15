/** Conceptual map contract used by V14's Canvas/SVG presentation layer. */
export interface MapRegion { id:string; label:string; x:number; y:number; biome:string; owner?:string; }
export interface MapRoute { id:string; from:string; to:string; level:number; active:boolean; }
export function clampZoom(value:number){ return Math.max(.85, Math.min(1.8, value)); }
