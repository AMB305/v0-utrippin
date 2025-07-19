import { generateMissingDestinationMaps, getDestinationCoordinates } from './staticMapGenerator';
import destinationsData from '@/data/destinations.json';

export interface DestinationAuditResult {
  destination: string;
  hasImage: boolean;
  hasCoordinates: boolean;
  currentImage: string;
  suggestedStaticMap: string;
  issues: string[];
}

// Audit all destinations for missing images and coordinates
export const auditDestinations = (): DestinationAuditResult[] => {
  return destinationsData.map(dest => {
    const coordinates = getDestinationCoordinates(dest.name);
    const hasCoordinates = coordinates[0] !== 0 || coordinates[1] !== 0;
    const hasValidImage = dest.image && 
                         !dest.image.includes('placeholder') && 
                         !dest.image.includes('/src/assets/');
    
    const issues: string[] = [];
    
    if (!hasValidImage) {
      issues.push('Missing or invalid image');
    }
    
    if (!hasCoordinates) {
      issues.push('Missing coordinates');
    }
    
    const suggestedStaticMap = hasCoordinates 
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/pin-large-red(${coordinates[0]},${coordinates[1]})/${coordinates[0]},${coordinates[1]},10/400x300@2x?access_token={{MAPBOX_TOKEN}}`
      : 'N/A - No coordinates available';

    return {
      destination: dest.name,
      hasImage: hasValidImage,
      hasCoordinates,
      currentImage: dest.image || 'N/A',
      suggestedStaticMap,
      issues
    };
  });
};

// Get summary statistics
export const getAuditSummary = () => {
  const results = auditDestinations();
  const total = results.length;
  const missingImages = results.filter(r => !r.hasImage).length;
  const missingCoordinates = results.filter(r => !r.hasCoordinates).length;
  const fullyComplete = results.filter(r => r.hasImage && r.hasCoordinates).length;
  
  return {
    total,
    missingImages,
    missingCoordinates,
    fullyComplete,
    completionRate: Math.round((fullyComplete / total) * 100)
  };
};

// Generate report for missing images
export const generateMissingImagesReport = (): string => {
  const results = auditDestinations();
  const missingImages = results.filter(r => !r.hasImage);
  
  let report = `# Destination Image Audit Report\n\n`;
  report += `## Summary\n`;
  
  const summary = getAuditSummary();
  report += `- Total destinations: ${summary.total}\n`;
  report += `- Missing images: ${summary.missingImages}\n`;
  report += `- Missing coordinates: ${summary.missingCoordinates}\n`;
  report += `- Fully complete: ${summary.fullyComplete}\n`;
  report += `- Completion rate: ${summary.completionRate}%\n\n`;
  
  if (missingImages.length > 0) {
    report += `## Destinations Missing Images (${missingImages.length})\n\n`;
    
    missingImages.forEach(dest => {
      report += `### ${dest.destination}\n`;
      report += `- Current image: ${dest.currentImage}\n`;
      report += `- Has coordinates: ${dest.hasCoordinates ? 'Yes' : 'No'}\n`;
      if (dest.hasCoordinates) {
        report += `- Static map URL: ${dest.suggestedStaticMap}\n`;
      }
      report += `- Issues: ${dest.issues.join(', ')}\n\n`;
    });
  }
  
  return report;
};

// Log audit results to console for development
export const logAuditResults = () => {
  const summary = getAuditSummary();
  const report = generateMissingImagesReport();
  
  console.group('🏞️ Destination Image Audit');
  console.log('Summary:', summary);
  console.log('Full Report:');
  console.log(report);
  console.groupEnd();
  
  return { summary, report };
};