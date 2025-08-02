const fs = require('fs');

// Read the experiences file
const content = fs.readFileSync('src/data/utrippin_experiences.ts', 'utf8');

// Replace all Expedia URLs that don't already have affiliate parameters
const updatedContent = content.replace(
  /"bookingUrl": "(https:\/\/www\.expedia\.com\/[^"?]+)"/g,
  '"bookingUrl": "$1?clickref=1110l15dQSW&camref=1110l15dQSW"'
);

// Write the updated content back
fs.writeFileSync('src/data/utrippin_experiences.ts', updatedContent);

console.log('✅ All Expedia links have been updated with affiliate parameters');
