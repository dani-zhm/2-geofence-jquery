import "./style.css";
import { getBoundaries, getStages } from "./utils/fetch";
import config from "./config";

/**
 * 
 * TODO: 
 * - implement file upload
 *  -- 
 */


async function handleMapClick(ev: any) {
  const ids = await getBoundaries(ev.latlng);
  if (ids.length > 0) {
    $("#results").append(`overlapped with ${ids.join(" and ")}! <br/>`);
  } else {
    $("#results").append("No overlap <br/>");
  }
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
    apiKey: config.apiKey,
  });

  app.addLayers();

  const polygons = await getStages();

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
