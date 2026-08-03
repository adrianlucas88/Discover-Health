import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { HealthcareResource } from '../types';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

type ResourceMapProps = {
  resources: HealthcareResource[];
  onMapClick: (lat: number, lon: number) => void;
};

function buildPopupContent(resource: HealthcareResource) {
  const container = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = resource.name;
  container.appendChild(title);

  const category = document.createElement('p');
  category.textContent = `Category: ${resource.category}`;
  container.appendChild(category);

  const description = document.createElement('p');
  description.textContent = resource.description;
  container.appendChild(description);

  const recommendations = document.createElement('p');
  recommendations.textContent = `Recommendations:${resource.recommendations}`;
  container.appendChild(recommendations);

  return container;
}

function ResourceMap({ resources, onMapClick }: ResourceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const onMapClickRef = useRef(onMapClick);

  onMapClickRef.current = onMapClick;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current).setView([52.4862, -1.8904], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (event) => {
      onMapClickRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    resources.forEach((resource) => {
      if (resource.lat === null || resource.lon === null) {
        return;
      }

      const marker = L.marker([resource.lat, resource.lon]).addTo(map);
      marker.bindPopup(() => buildPopupContent(resource));

      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [resources]);

  return (
    <div>
      <p className="map-help">
        Click on the map to copy latitude and longitude into the add resource form.
      </p>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}

export default ResourceMap;