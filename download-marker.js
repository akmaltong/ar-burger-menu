const https = require('https');
const fs = require('fs');
const path = require('path');

// URL для скачивания маркера
const markerUrl = 'https://raw.githubusercontent.com/ARjsorg/AR.js/master/data/images/barcode-6.png';
const outputPath = path.join(__dirname, 'markers', 'barcode-6.png');

// Создаем директорию markers если её нет
const markersDir = path.join(__dirname, 'markers');
if (!fs.existsSync(markersDir)) {
    fs.mkdirSync(markersDir, { recursive: true });
}

console.log('📥 Скачивание маркера Barcode value=6...');

https.get(markerUrl, (response) => {
    if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log('✅ Маркер успешно скачан!');
            console.log('📁 Путь:', outputPath);
            console.log('');
            console.log('🖨️ Распечатайте этот маркер и положите на стол.');
            console.log('📱 Гости будут наводить камеру на этот маркер для просмотра бургера.');
        });
    } else {
        console.error('❌ Ошибка скачивания. Код статуса:', response.statusCode);
        console.log('');
        console.log('📥 Скачайте маркер вручную:');
        console.log(markerUrl);
    }
}).on('error', (err) => {
    console.error('❌ Ошибка:', err.message);
    console.log('');
    console.log('📥 Скачайте маркер вручную:');
    console.log(markerUrl);
});
