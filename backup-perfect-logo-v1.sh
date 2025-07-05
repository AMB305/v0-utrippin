#!/bin/bash

# UTrippin PerfectLogoVersion1 Backup Script
# Run this script in your local development environment to create a backup with the perfect logo

echo "🎨 Creating UTrippin PerfectLogoVersion1 Backup..."

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
git commit -m "PerfectLogoVersion1: Enhanced logo design and notification system

- Added new compact gradient Logo component with hover effects
- Implemented travel buddy notification system with real-time updates
- Created NotificationBadge component with unread count display
- Added comprehensive database migration for notifications
- Enhanced header design with notification integration
- Updated Tailwind config with gradient pulse animations
- Improved responsive design across all screen sizes
- Added proper security policies for notification access

Key Features:
- Beautiful gradient logo with 8 colored blocks (U-T-R-I-P-P-I-N)
- Real-time notification badges for travel buddy matches
- Smooth animations and hover effects
- Mobile-responsive design
- Secure notification system with RLS policies"

# Create PerfectLogoVersion1 tag
echo "🏷️  Creating PerfectLogoVersion1 tag..."
git tag -a PerfectLogoVersion1 -m "PerfectLogoVersion1: Perfect Logo Design & Notifications

🎨 Logo Features:
- Compact gradient design with 8 colored blocks
- Smooth hover effects and animations
- Responsive sizing (sm/md/lg breakpoints)
- Beautiful color progression from blue to orange
- Pulse gradient animation effect

🔔 Notification System:
- Real-time notification badges
- Travel buddy match notifications
- Unread count display
- Secure RLS policies
- Auto-updating via Supabase subscriptions

🎯 Technical Improvements:
- Enhanced header layout
- Better mobile responsiveness
- Improved component organization
- Updated Tailwind animations
- Clean database migrations

This version represents the perfect balance of beautiful design
and functional notification features for the travel buddy system."

# Push to remote (if configured)
echo "🌐 Pushing to remote repository..."
if git remote get-url origin > /dev/null 2>&1; then
    git push origin main
    git push origin PerfectLogoVersion1
    echo "✅ Successfully pushed PerfectLogoVersion1 to remote repository!"
else
    echo "⚠️  No remote repository configured. To push to GitHub:"
    echo "   git remote add origin https://github.com/yourusername/utrippin.git"
    echo "   git push -u origin main"
    echo "   git push origin PerfectLogoVersion1"
fi

echo ""
echo "🎉 PerfectLogoVersion1 backup completed successfully!"
echo ""
echo "📋 Summary of this version:"
echo "   🎨 Perfect gradient logo design with 8 colored blocks"
echo "   🔔 Real-time notification system for travel buddies"
echo "   📱 Enhanced mobile-responsive header"
echo "   ⚡ Smooth animations and hover effects"
echo "   🔒 Secure notification policies"
echo ""
echo "🏷️  Tagged as: PerfectLogoVersion1"
echo "💾 All changes committed and ready for deployment"

# Show current status
echo ""
echo "📊 Current repository status:"
git status --short
echo ""
echo "🏷️  Available tags:"
git tag --list
echo ""
echo "🎨 Logo component location: src/components/ui/Logo.jsx"
echo "🔔 Notification component: src/components/ui/NotificationBadge.jsx"
echo "📄 Migration file: supabase/migrations/20250705150012_travel_buddy_notifications.sql"