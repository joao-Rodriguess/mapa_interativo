// OpenStreetMap (Leaflet) Logic - Secure & Free
let map;
const mapElement = document.getElementById('map');
const statusBadge = document.getElementById('status-badge');
const statusText = document.getElementById('status-text');
const locationStatus = document.getElementById('location-status');
const loadingOverlay = document.getElementById('loading-overlay');

// Interaction State
let isDragging = false;
let lastHandPosition = { x: 0, y: 0 };
let zoomLevel = 15;

// Config 
// Sensitivity adjusted for Leaflet pixels
const PAN_SENSITIVITY = 3.0;

function initMap() {
    // 1. Create Map (Center initially on Brasilia to show *something*)
    map = L.map('map', {
        zoomControl: false, // Cleaner UI
        attributionControl: false // Minimalist
    }).setView([-15.793889, -47.882778], 5); // Start visibly in Brazil

    // Hide loader when map tiles start loading
    map.whenReady(() => {
        // Wait a bit for MediaPipe too, or just fade out base content
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500);
        }, 2000);
    });

    // 2. Add Tile Layer (OpenStreetMap Standard + CSS Dark Filter)
    // Isso permite Zoom nível 19 (detalhe de rua) e até 22 (zoom digital)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxNativeZoom: 19, // Tiles existem até aqui
        maxZoom: 22        // Leaflet estica a imagem além disso
    }).addTo(map);

    // 3. Geolocation (User's Computer Location)
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Fly to user location
                map.flyTo([lat, lng], 15, {
                    duration: 2 // smooth animation
                });

                // Add a marker/circle for the user
                const userMark = L.circle([lat, lng], {
                    color: '#6366f1',
                    fillColor: '#6366f1',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(map);

                // Setup Routing
                setupRouting(lat, lng);

                // Reverse Geocoding
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                    .then(response => response.json())
                    .then(data => {
                        const fullAddress = data.display_name.split(',')[0] + ", " + (data.address.suburb || data.address.city);
                        locationStatus.innerText = `📍 ${fullAddress}`;
                        userMark.bindPopup(`<b>Você está aqui</b><br>${data.display_name}`).openPopup();
                    });
            },
            (error) => {
                console.error("Erro de localização:", error);
                locationStatus.innerText = "GPS Indisponível (Clique para Rota)";
                // Fallback View
                map.setView([-23.550520, -46.633308], 13);
                // Setup Routing without start point
                setupRouting(null, null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        locationStatus.innerText = "GPS não suportado";
        setupRouting(null, null);
    }

    startCamera();
}

let routingControl = null;

function setupRouting(startLat, startLng) {
    // Click map to set destination
    map.on('click', function (e) {
        if (routingControl) {
            map.removeControl(routingControl);
        }

        const waypoints = [];

        if (startLat && startLng) {
            // Route from User to Click
            waypoints.push(L.latLng(startLat, startLng));
            waypoints.push(e.latlng);
            locationStatus.innerText = "Calculando rota...";
        } else {
            // First click is start? No, Routing Machine handles generic.
            // Let's assume click is DESTINATION, and fallback start is Map Center or ask user.
            // Simpler: Just place a "Destination" marker and calculate from known start?
            // If no known start, we can't route simply.
            // Fallback: Default Start (Sao Paulo) -> Click.
            waypoints.push(L.latLng(-23.550520, -46.633308));
            waypoints.push(e.latlng);
            alert("Localização desconhecida. Rota saindo do Centro de SP.");
        }

        routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            language: 'pt-BR',
            showAlternatives: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#6366f1', opacity: 0.8, weight: 6 }]
            }
        }).on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            // Show time and distance
            const timeMin = Math.round(summary.totalTime / 60);
            const distKm = (summary.totalDistance / 1000).toFixed(1);
            locationStatus.innerText = `🚗 ${timeMin} min (${distKm} km)`;
        }).addTo(map);
    });
}

// MediaPipe Setup
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Mirror the video output for natural feeling
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Draw all detected hands
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#f8fafc', lineWidth: 2 });
            drawLandmarks(canvasCtx, landmarks, { color: '#6366f1', lineWidth: 1, radius: 3 });
        }

        const handCount = results.multiHandLandmarks.length;

        if (handCount === 2) {
            // Two Hands -> ZOOM Mode
            processZoom(results.multiHandLandmarks);
            statusText.innerText = "Modo Zoom (2 Mãos)";
        } else if (handCount === 1) {
            // One Hand -> PAN Mode
            processPan(results.multiHandLandmarks[0]);
            statusText.innerText = "Modo Mover (1 Mão)";
        }

        statusBadge.classList.add('status-active');
    } else {
        statusBadge.classList.remove('status-active');
        statusText.innerText = "Aguardando Mãos...";
        isDragging = false;
        mapElement.style.cursor = 'default';
    }

    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 2, // Enable two hands for zoom
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

function startCamera() {
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 320,
        height: 240
    });
    camera.start();
}

// Logic variables
let lastPinchDist = 0;
let zoomCooldown = false;

function processPan(landmarks) {
    if (!map) return;

    // Reset Zoom state
    lastPinchDist = 0;

    const isFist = detectFist(landmarks);
    const currentX = landmarks[9].x;
    const currentY = landmarks[9].y;

    if (isFist) {
        if (isDragging) {
            const rawDeltaX = (currentX - lastHandPosition.x);
            const rawDeltaY = (currentY - lastHandPosition.y);

            const pixelDeltaX = rawDeltaX * window.innerWidth * PAN_SENSITIVITY;
            const pixelDeltaY = rawDeltaY * window.innerHeight * PAN_SENSITIVITY;

            map.panBy([-pixelDeltaX, pixelDeltaY], { animate: false });
        } else {
            isDragging = true;
            mapElement.style.cursor = 'grabbing';
        }
        lastHandPosition = { x: currentX, y: currentY };
    } else {
        isDragging = false;
        mapElement.style.cursor = 'default';
    }
}

function processZoom(landmarksArray) {
    if (!map || zoomCooldown) return;

    // Get Index Finger Tip (8) of both hands
    const handA = landmarksArray[0][8];
    const handB = landmarksArray[1][8];

    // Calculate distance between index fingers
    const currentDist = distance(handA, handB);

    if (lastPinchDist > 0) {
        const delta = currentDist - lastPinchDist;
        const threshold = 0.05; // Sensitivity threshold

        if (Math.abs(delta) > threshold) {
            const currentZoom = map.getZoom();

            if (delta > 0) {
                // Moving apart -> Zoom IN
                map.setZoom(currentZoom + 1);
            } else {
                // Moving together -> Zoom OUT
                map.setZoom(currentZoom - 1);
            }

            // Cooldown to prevent rapid flickering
            zoomCooldown = true;
            setTimeout(() => { zoomCooldown = false; }, 600);

            // Reset base distance to avoid continuous zooming without movement
            lastPinchDist = currentDist;
        }
    } else {
        lastPinchDist = currentDist;
    }
}

function detectFist(landmarks) {
    const fingerTips = [8, 12, 16, 20];
    const fingerPips = [6, 10, 14, 18];
    let curledCount = 0;

    for (let i = 0; i < 4; i++) {
        const dTip = distance(landmarks[fingerTips[i]], landmarks[0]);
        const dPip = distance(landmarks[fingerPips[i]], landmarks[0]);

        // Simple heuristic: Tip closer to wrist than PIP is to wrist
        if (dTip < dPip) {
            curledCount++;
        }
    }

    return curledCount >= 3;
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Start
initMap();
