/* =========================================================
   Pescara Boat View — coastal route map (MapLibre GL)
   Style: Carto Positron (free, no token), recolored to brand sea tones.
   ========================================================= */
(function () {
  const el = document.getElementById("map");
  if (!el || !window.maplibregl) return;

  // Points of interest along the Costa dei Trabocchi (lng, lat)
  const POIS = [
    { n: "Pescara",            c: [14.2156, 42.4664], major: true },
    { n: "Francavilla al Mare", c: [14.2903, 42.4184] },
    { n: "Ortona",             c: [14.4046, 42.3553] },
    { n: "San Vito Chietino",  c: [14.4430, 42.2970] },
    { n: "Fossacesia Marina",  c: [14.4920, 42.2470] },
    { n: "Vasto",              c: [14.6680, 42.1190], major: true },
  ];

  // Route slightly offshore (east) so it reads as a sea route
  const route = {
    type: "Feature",
    geometry: { type: "LineString", coordinates: POIS.map(p => [p.c[0] + 0.022, p.c[1] - 0.004]) },
  };

  let started = false;
  function init() {
    if (started) return; started = true;

    const map = new maplibregl.Map({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      bounds: [[14.16, 42.07], [14.76, 42.51]],
      fitBoundsOptions: { padding: { top: 40, bottom: 40, left: 40, right: 40 } },
      dragRotate: false,
      pitchWithRotate: false,
    });

    // keep the view "fixed": page scroll is never hijacked
    map.scrollZoom.disable();
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      // brand sea colour on water layers
      try {
        map.getStyle().layers.forEach(l => {
          if (l.type === "fill" && /water|ocean|sea|marine/i.test(l.id)) {
            map.setPaintProperty(l.id, "fill-color", "#cfe8f4");
          }
        });
      } catch (e) {}

      // route line
      map.addSource("route", { type: "geojson", data: route });
      map.addLayer({
        id: "route-glow", type: "line", source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#15a3a3", "line-width": 8, "line-opacity": 0.18 },
      });
      map.addLayer({
        id: "route-line", type: "line", source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#0f7d80", "line-width": 3, "line-dasharray": [1.4, 1.4] },
      });

      // POI markers + labels
      POIS.forEach(p => {
        const pin = document.createElement("div");
        pin.className = "map-pin" + (p.major ? " map-pin-major" : "");
        new maplibregl.Marker({ element: pin })
          .setLngLat(p.c)
          .setPopup(new maplibregl.Popup({ offset: 16, closeButton: false }).setText(p.n))
          .addTo(map);
      });
    });
  }

  // lazy-init when the map scrolls into view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { init(); io.disconnect(); } });
  }, { rootMargin: "250px" });
  io.observe(el);
})();
