      // This function runs when the button is clicked
      function greetUser() {
        let name = prompt("What's your name? \n ཁྱེད་རང་གི་མིང་ལ་ག་རེ་རེད།");
        if (name) {
          alert("Tashi Delek བཀྲ་ཤིས་བདེ་ལེགས།, " + name + "! 👋");
        } else {
          alert("You've probably got to write a name. probably.");
        }
    const map = L.map('map').setView([28.3949, 84.1240], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const tracePoints = [
      [29.653, 91.117],   // Lhasa
      [27.7172, 85.324],  // Kathmandu
      [14.9737, 75.0407]    // Mundgod
    ];

    const pathLine = L.polyline(tracePoints, { color: 'red' }).addTo(map);
    
    map.fitBounds(pathLine.getBounds());

    coords: [29.653, 91.117],
    title: 'Lhasa',
    content: `<h2>Lhasa</h2>
                  <p>This is where my grandmother was born. She lived here until she left Tibet in 1959.</p>
                  <img src="images/lhasa.jpg" alt="Lhasa">`

    L.marker(tracePoints[0]).addTo(map).bindPopup('Lhasa');
    L.marker(tracePoints[1]).addTo(map).bindPopup('Kathmandu');
    L.marker(tracePoints[2]).addTo(map).bindPopup('Mundgod');
      }

