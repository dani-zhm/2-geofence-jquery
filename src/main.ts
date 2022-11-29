import "./style.css";
import axios from "axios";
import { Coords, GetPolygonsRes } from "./types";

// Mapp imports
// css
// import "./Mapp/css/mapp.min.css";
// import "./Mapp/css/fa/style.css";
// // js
// import "./Mapp/js/jquery-3.2.1.min.js";
// import "./Mapp/js/mapp.env.js";
// import "./Mapp/js/mapp.min.js";

/**
 * plan:
 * - fetch uploaded file
 * https://map.ir/geofence/stages, GET method, x-api-key in header,
 * - display the polygons
 * - let the user click,
 * - button for sending click coordinates
 * https://map.ir/geofence/boundaries?lat={...}&lon={...} , lat and lon params
 * - the polygon that has the right id
 */

const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM2ZjVkYzFjNGQ3ZjMxNmFkZDE5Njc3MTliMjNhZDFiOTQ1Nzg2ZmJhOWVkNzBhZDdmNTMwNmFjOWY3OTNjNzI4NjM0YTlmMGQ2N2IwNmY3In0.eyJhdWQiOiIyMDA4NyIsImp0aSI6ImM2ZjVkYzFjNGQ3ZjMxNmFkZDE5Njc3MTliMjNhZDFiOTQ1Nzg2ZmJhOWVkNzBhZDdmNTMwNmFjOWY3OTNjNzI4NjM0YTlmMGQ2N2IwNmY3IiwiaWF0IjoxNjY5MDk2ODczLCJuYmYiOjE2NjkwOTY4NzMsImV4cCI6MTY3MTYwMjQ3Mywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.r5EUqb9v6QDkS44OUQ8jxe19E3sdhZWFyGAPfrLvJ8TKMtxkKVipSdNUqmSTewng6595y3J7nWfCAYInAE4nSYm0oOxjIBu9Cs2vPhrpl3rrALbrVWi5MfmO1u6C176qy5oLM7Y6JY2bBVDJkpfZct_jKpo75C8BzB8jMwp1KAb0rO3evboszfNnoQ5H_VaZFrKIoXCea0YfcCRKtsrTtpGEWGPolk-_ITLNbtgHz8ust-TjeYKDHsS4OypptcJNkm83K5I74OjSMNblpza44ZxW8bSTZviQu7FTSuI2tfz27MQ7ijpLZHio23ps_yepvL_ejvhEEVdzkU4vIU5i2A";

const BASE_URL = "https://map.ir/geofence";

function normalizeCoords(coords: Coords[]) {
  return coords.map((c) => [c[1], c[0]]);
}

const fetch = axios.create({
  headers: { "x-api-key": apiKey },
  baseURL: BASE_URL,
});

async function handleMapClick(ev: any) {
  const { lat, lng } = ev.latlng;
  console.log("clicked on map");

  try {
    const res = await fetch.get("/boundaries", { params: { lat, lon: lng } });
    if (res.data.value) {
      const data: GetPolygonsRes = res.data;
      const polys = data.value.map((v) => v.id);
      $("#results").append(`overlapped with ${polys.join(" and ")}! <br/>`);
    }
  } catch (error) {
    $("#results").append("No overlap <br/>");
  }
}

interface Polygon {
  id: number;
  coordinates: Coords[];
}

async function fetchUploadedPolygons(): Promise<Polygon[]> {
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
}

async function mapInit() {
  $("#app").append('<div id="root"></div>');
  const app = new Mapp({
    element: "#root",
    presets: {
      latlng: {
        lat: 35.727403199232185,
        lng: 51.36704655584856,
      },
      zoom: 13,
    },
    apiKey,
  });

  app.addLayers();

  const polygons = await fetchUploadedPolygons();

  for (const polygon of polygons) {
    app.addPolygon({
      name: polygon.id,
      coordinates: polygon.coordinates,
      popup: false,
    });
  }

  app.map.on("click", handleMapClick);
}

async function main() {
  await mapInit();
  $("#app").append($('<p id="results"></p>'));
}

$(document).ready(function () {
  main();
});
