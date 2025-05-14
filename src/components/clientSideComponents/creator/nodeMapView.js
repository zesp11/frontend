import React, { useEffect, useRef, useState } from "react";
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
  const vectorSourceRef = useRef(null);
  const viewRef = useRef(null);

  // Parse coordinates and handle potential invalid values
  const longitude = parseFloat(node.data.longitude) || 0;
  const latitude = parseFloat(node.data.latitude) || 0;

  // Update marker whenever coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;

    // Clear existing features
    vectorSourceRef.current.clear();

    // Add new marker if coordinates exist
    if (longitude !== 0 || latitude !== 0) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      vectorSourceRef.current.addFeature(feature);

      // Pan map to new location but preserve zoom
      const currentZoom = mapInstanceRef.current.getView().getZoom();
      mapInstanceRef.current
        .getView()
        .setCenter(fromLonLat([longitude, latitude]));

      // Only set initial zoom if it hasn't been set before
      if (
        !viewRef.current.initialZoomSet &&
        (longitude !== 0 || latitude !== 0)
      ) {
        mapInstanceRef.current.getView().setZoom(14);
        viewRef.current.initialZoomSet = true;
      }
    }
  }, [longitude, latitude]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(null);
    }

    // Create vector source and keep a reference
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    // Initialize viewRef for zoom tracking
    viewRef.current = { initialZoomSet: false };

    // Create vector layer with styling
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: "#ff6b00" }),
          stroke: new Stroke({ color: "white", width: 2 }),
        }),
      }),
    });

    // Create new map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: longitude !== 0 || latitude !== 0 ? 14 : 3,
      }),
    });

    // Add marker if coordinates exist
    if (longitude !== 0 || latitude !== 0) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      vectorSource.addFeature(feature);
      viewRef.current.initialZoomSet = true;
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

    // Ensure map renders correctly by updating its size
    setTimeout(() => {
      map.updateSize();
    }, 100);

    // Cleanup
    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, []);

  const handleUseMyLocation = (e) => {
    // Prevent event bubbling to parent elements
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      alert("Geolokalizacja nie jest obsługiwana w twojej przeglądarce");
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
        console.error("Błąd geolokalizacji:", error);
        alert("Nie można pobrać lokalizacji: " + error.message);
      }
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={handleUseMyLocation}
        type="button" // Explicitly set type to prevent form submission
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "8px 12px",
          backgroundColor: "#2c7be5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Użyj mojej lokalizacji
      </button>
    </div>
  );
}
