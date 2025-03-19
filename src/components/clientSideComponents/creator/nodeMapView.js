import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Circle, Fill, Stroke, Text } from "ol/style";

export default function NodeMapView({ node, onCoordinateChange }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markerLayer, setMarkerLayer] = useState(null);

  const longitude = parseFloat(node.data.longitude || 0);
  const latitude = parseFloat(node.data.latitude || 0);

  // Create map on component mount
  useEffect(() => {
    if (!mapRef.current) return;

    console.log("Creating map");

    // Initialize map
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([longitude || 0, latitude || 0]),
        zoom: 8,
      }),
    });

    // Create marker source and layer
    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
      style: (feature) => {
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: "#4a90e2" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
          text: new Text({
            text: feature.get("name") || "Location",
            offsetY: -15,
            fill: new Fill({ color: "#000" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
        });
      },
    });

    initialMap.addLayer(layer);

    // Add click handler
    initialMap.on("click", (event) => {
      const clickedCoord = initialMap.getCoordinateFromPixel(event.pixel);
      const lonLat = toLonLat(clickedCoord);

      if (onCoordinateChange) {
        onCoordinateChange("longitude", lonLat[0].toFixed(6));
        onCoordinateChange("latitude", lonLat[1].toFixed(6));
      }
    });

    setMap(initialMap);
    setMarkerLayer(layer);

    // Add initial marker if coordinates exist
    if (longitude && latitude) {
      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        name: node.data.label || "Location",
      });
      source.addFeature(markerFeature);
    }

    // Clean up on unmount
    return () => {
      if (initialMap) {
        initialMap.setTarget(null);
      }
    };
  }, [longitude, latitude, node.data.label, onCoordinateChange]); // Include necessary dependencies

  // Update marker when coordinates change
  useEffect(() => {
    if (!map || !markerLayer) return;

    const source = markerLayer.getSource();
    source.clear();

    if (longitude && latitude) {
      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        name: node.data.label || "Location",
      });
      source.addFeature(markerFeature);

      // Center map on marker
      map.getView().setCenter(fromLonLat([longitude, latitude]));
    }
  }, [map, markerLayer, longitude, latitude, node.data.label]);

  // Handle "Use My Location" button click
  const handleUseMyLocation = () => {
    if (!navigator.geolocation || !map || !markerLayer) {
      alert("Geolocation is not available in your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLon = position.coords.longitude;
        const userLat = position.coords.latitude;

        // Update coordinates in parent component
        if (onCoordinateChange) {
          onCoordinateChange("longitude", userLon.toString());
          onCoordinateChange("latitude", userLat.toString());
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-view"></div>
      <div className="map-controls">
        <div className="map-instructions">Click on the map to set location</div>
        <button
          type="button"
          className="location-button"
          onClick={handleUseMyLocation}
        >
          Use My Location
        </button>
      </div>
    </div>
  );
}
