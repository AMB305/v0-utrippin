#!/bin/bash

# UTrippin Version 3 Backup Script
# Run this script in your local development environment to create a version 3 backup

echo "🚀 Creating UTrippin Version 3 Backup..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Add all changes
echo "📁 Adding all changes to staging..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Version 3: Enhanced header design and travel buddy features

- Updated header with smaller colorful logo for better navigation spacing
- Improved FlightsPage hero section with background image and compact design
- Enhanced travel buddy swipe and match functionality
- Added comprehensive database schema for social travel features
- Integrated Supabase for real-time travel buddy matching
- Added TravelBuddySwipePage and TravelMatchesPage
- Updated README with Version 2 changelog and features
- Improved responsive design and user experience"

# Create version 3 tag
echo "🏷️  Creating version 3 tag..."
git tag -a v3.0.0 -m "Version 3.0.0: Enhanced UI and Social Travel Features

Key Features:
- Redesigned header with compact colorful logo
- Enhanced FlightsPage with background imagery
- Complete travel buddy matching system
- Supabase database integration
- Real-time social features
- Improved responsive design
- Better navigation spacing and usability

Technical Improvements:
- Comprehensive database schema
- Row Level Security policies
- Real-time matching algorithms
- Enhanced UI components
- Better code organization"

# Push to remote (if configured)
echo "🌐 Pushing to remote repository..."
if git remote get-url origin > /dev/null 2>&1; then
    git push origin main
    git push origin v3.0.0
    echo "✅ Successfully pushed to remote repository!"
else
    echo "⚠️  No remote repository configured. To push to GitHub:"
    echo "   git remote add origin https://github.com/yourusername/utrippin.git"
    echo "   git push -u origin main"
    echo "   git push origin v3.0.0"
fi

echo ""
echo "🎉 Version 3 backup completed successfully!"
echo ""
echo "📋 Summary of changes:"
echo "   - Enhanced header design with compact logo"
echo "   - Improved FlightsPage hero section"
echo "   - Complete travel buddy matching system"
echo "   - Supabase database integration"
echo "   - Real-time social features"
echo ""
echo "🏷️  Tagged as: v3.0.0"
echo "💾 All changes committed and ready for deployment"

# Show current status
echo ""
echo "📊 Current repository status:"
git status --short
echo ""
echo "🏷️  Available tags:"
git tag --list