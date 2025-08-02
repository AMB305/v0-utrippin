// Script to update all Expedia links with affiliate parameters
const fs = require('fs');

// Read the current file
const filePath = 'src/data/utrippin_experiences.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all Expedia links that don't already have affiliate parameters
const pattern = /"bookingUrl": "(https:\/\/www\.expedia\.com\/[^"?]+)(?!\?[^"]*(?:clickref|camref))"/g;
const replacement = '"bookingUrl": "$1?clickref=1110l15dQSW&camref=1110l15dQSW"';

const updatedContent = content.replace(pattern, replacement);

// Write back to file
fs.writeFileSync(filePath, updatedContent);

console.log('Updated all Expedia links with affiliate parameters');
