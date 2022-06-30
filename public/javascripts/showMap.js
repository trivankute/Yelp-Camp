
  mapboxgl.accessToken = `${mapToken}`;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/dark-v10', // style URL
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 8 // starting zoom
  });

  const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
      .setHTML(
          `<h3 style="font-size:18px; font-weight:600;">${campground.title}</h3>
          <p style="font-size:15px;">${campground.location}</p>
          `
      )
  )
  .addTo(map);

  map.addControl(new mapboxgl.NavigationControl());