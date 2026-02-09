const fs = require('fs');
const path = require('path');

// Generate simple letter markers for burgers 2, 3, 4
const markers = [
    { name: 'A', letter: 'A', burger: 2 },
    { name: 'B', letter: 'B', burger: 3 },
    { name: 'C', letter: 'C', burger: 4 },
];

markers.forEach(marker => {
    const canvas = createMarkerCanvas(marker.letter);
    const buffer = canvas.toBuffer('image/png');
    const filename = `${marker.name.toLowerCase()}-marker.png`;

    fs.writeFileSync(filename, buffer);
    console.log(`Generated ${filename} for Burger ${marker.burger}`);
});

function createMarkerCanvas(letter) {
    const size = 400;
    const canvas = require('canvas').createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Black border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, size - 20, size - 20);

    // Inner border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(30, 30, size - 60, size - 60);

    // Letter in center
    ctx.fillStyle = 'black';
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, size / 2, size / 2);

    // Label at bottom
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Marker ${letter}`, size / 2, size - 20);

    return canvas;
}

console.log('Markers generated successfully!');
console.log('Files: a-marker.png, b-marker.png, c-marker.png');
