import React, { useEffect, useRef, useMemo } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Circle, Fill, Stroke } from "ol/style";

export default function NodeMapView({ node, onCoordinateChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const longitude = parseFloat(node.data.longitude || 0);
  const latitude = parseFloat(node.data.latitude || 0);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(null);
    }

    // Create new map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([longitude || 0, latitude || 0]),
        zoom: longitude && latitude ? 12 : 3,
      }),
    });

    // Create vector source and layer for marker
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: "red" }),
          stroke: new Stroke({ color: "white", width: 2 }),
        }),
      }),
    });
    map.addLayer(vectorLayer);

    // Add marker if coordinates exist
    if (longitude && latitude) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      vectorSource.addFeature(feature);
    }

    // Click handler to update coordinates
    map.on("click", (event) => {
      const coordinate = toLonLat(event.coordinate);
      if (onCoordinateChange) {
        onCoordinateChange("longitude", coordinate[0].toFixed(6));
        onCoordinateChange("latitude", coordinate[1].toFixed(6));
      }
    });

    // Store map instance
    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (onCoordinateChange) {
          onCoordinateChange("longitude", position.coords.longitude.toFixed(6));
          onCoordinateChange("latitude", position.coords.latitude.toFixed(6));
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get location: " + error.message);
      }
    );
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <button onClick={handleUseMyLocation}>Use My Location</button>
    </div>
  );
}
