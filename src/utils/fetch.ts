import axios from "axios";
import config from "../config";
import { Coords, GetPolygonsRes, Polygon } from "../types";
import { normalizeCoords } from "./normalize";

const BASE_URL = "https://map.ir/geofence";

const fetch = axios.create({
  headers: { "x-api-key": config.apiKey },
  baseURL: BASE_URL,
});

export const getBoundaries = async ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  try {
    const res = await fetch.get("/boundaries", { params: { lat, lon: lng } });
    if (res.data.value) {
      const data: GetPolygonsRes = res.data;
      const ids = data.value.map((v) => v.id);
      return ids;
    }
  } catch (error) {
    return [];
  }
  return [];
};

export const getStages = async (): Promise<Polygon[]> => {
  try {
    const res = await fetch.get("/stages");
    if (res.data.value) {
      const data: GetPolygonsRes = res.data;
      const polygons = data.value?.map((v) => ({
        id: v.id,
        coordinates: normalizeCoords(v.boundary.coordinates[0]) as Coords[],
      }));
      return polygons;
    }
  } catch (error) {
    return [];
  }
  return [];
};
