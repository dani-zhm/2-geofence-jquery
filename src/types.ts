interface ValueEntity {
  id: number;
  boundary: Boundary;
  meta?: any[];
  created_at: string;
  updated_at: string;
}

export type Coords = [number, number];

interface Boundary {
  type: string;
  coordinates: Coords[][];
}

export interface GetPolygonsRes {
  "odata.count": number;
  value: ValueEntity[];
}


// export type GetPolygonsRes = SucessGetPolygonsRes | ErrorGetPolygonsRes;
