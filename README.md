# UTrippin - AI-Powered Travel Booking Platform

UTrippin is a modern travel booking platform that combines traditional search functionality with cutting-edge AI assistance and social travel features to help users plan, book, and manage their travel experiences.

## 🌟 Features

### Core Travel Booking
- **Multi-Search Interface**: Search flights, hotels, cars, packages, cruises, and experiences
- **Comprehensive Filters**: Advanced filtering options for all travel categories
- **Real-time Pricing**: Live pricing updates and deal notifications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### AI-Powered Features
- **AI Travel Assistant**: Interactive chat interface for personalized trip planning
- **Smart Recommendations**: AI-curated travel suggestions based on preferences
- **Price Prediction**: Machine learning algorithms for optimal booking timing
- **Itinerary Generation**: Automated day-by-day travel plans

### Social Travel Features (NEW in Version 2)
- **Travel Buddy Finder**: Tinder-style swiping to find compatible travel companions
- **Travel Matches**: Connect with fellow travelers who share your interests
- **Trip Planning Dashboard**: Manage your trips, save itineraries, and track travel buddies
- **Social Profiles**: Create detailed travel profiles with preferences and interests

### User Experience
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS
- **Fast Performance**: Optimized React components and efficient routing
- **SEO Optimized**: Proper meta tags and structured data
- **Accessibility**: WCAG compliant design patterns

## 🚀 Technology Stack

- **Frontend**: React 18, React Router DOM
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS, Custom Components
- **State Management**: React Query for server state
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Netlify (with _redirects for SPA)

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/                 # AI chat components
│   ├── advertising/        # Sponsored content
│   ├── common/            # Shared components (SEO, etc.)
│   ├── features/          # Feature-specific components
│   ├── layout/            # Header, Footer, Navigation
│   ├── search/            # Search interfaces
│   ├── travel/            # Travel buddy & social features
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── pages/                 # Route components
│   ├── Home.jsx
│   ├── FlightsPage.jsx
│   ├── HotelsPage.jsx
│   ├── CarsPage.jsx
│   ├── PackagesPage.jsx
│   ├── CruisesPage.jsx
│   ├── ExperiencesPage.jsx
│   ├── DealsPage.jsx
│   ├── AiTravelAssistantPage.jsx
│   ├── TravelBuddySwipePage.jsx    # NEW
│   ├── TravelMatchesPage.jsx       # NEW
│   └── TravelPlannerPage.jsx       # NEW
├── services/              # External API services
└── App.jsx               # Main app component
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AMB305/Utrippin.git
   cd Utrippin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # - VITE_OPENAI_API_KEY (optional for enhanced AI features)
   # - VITE_SUPABASE_URL (required for database)
   # - VITE_SUPABASE_ANON_KEY (required for database)
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project at https://supabase.com
   - Run the migration files in `supabase/migrations/` in your Supabase SQL editor
   - Update your `.env` file with your Supabase credentials

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema (Version 2)

### Core Tables
- **users**: Enhanced with travel preferences, bio, location, interests
- **travel_preferences**: Detailed travel style and accommodation preferences
- **trips**: AI-generated itineraries with social features
- **itineraries**: Normalized daily travel plans

### Social Features Tables (NEW)
- **travel_swipes**: Tinder-style swipe data for travel buddy matching
- **travel_buddy_matches**: Mutual matches between users
- **matches**: Trip-based matching system
- **buddy_requests**: Direct connection requests
- **trip_participants**: Group travel management
- **saved_itineraries**: Bookmarked trips from other users

### Key Features
- **Row Level Security (RLS)**: Secure data access policies
- **Real-time subscriptions**: Live updates for matches and messages
- **AI compatibility scoring**: Algorithm-based user matching
- **Comprehensive indexing**: Optimized for performance

## 🌐 Pages & Routes

### Core Pages
- `/` - Homepage with search interface and featured deals
- `/flights` - Flight search and booking
- `/hotels` - Hotel search and booking  
- `/cars` - Car rental search and booking
- `/packages` - Vacation package deals
- `/cruises` - Cruise search and booking
- `/experiences` - Tours and activities
- `/deals` - Exclusive travel deals and offers
- `/ai-assistant` - AI-powered travel planning interface

### Social Features (NEW)
- `/travel-buddy` - Swipe interface to find travel companions
- `/travel-matches` - View and chat with matched travel buddies
- `/travel-planner` - Personal dashboard for trip management

## 🔑 Environment Variables

The application supports the following environment variables:

- `VITE_OPENAI_API_KEY` - OpenAI API key for enhanced AI travel planning (optional)
- `VITE_SUPABASE_URL` - Your Supabase project URL (required)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key (required)

## 🎨 Design System

### Colors
- Primary Blue: `#0068EF`
- Secondary Blue: `#0055A5` 
- Dark Blue: `#003C8A`
- Accent Orange: `#FF6200`
- Success Green: Various green shades
- Neutral Grays: Gray-50 to Gray-900

### Typography
- Font Family: Helvetica Neue, Helvetica, Arial, sans-serif
- Headings: Bold weights (700)
- Body: Regular weight (400)
- UI Elements: Medium weight (500)

### Components
- Consistent border radius (rounded-lg, rounded-xl)
- Hover states and transitions
- Focus states for accessibility
- Responsive breakpoints (sm, md, lg, xl)

## 🔧 Key Components

### Search Components
- `MultiSearch` - Tabbed search interface for all travel types
- `AiSearchDemo` - AI-powered natural language search

### Social Components (NEW)
- `TravelBuddyFinder` - Swipe interface for finding travel companions
- `TravelMatchesPage` - Display and manage travel buddy matches
- `SavedItineraries` - Bookmark and manage favorite trips

### UI Components
- `Button` - Consistent button styling with variants
- `Card` - Flexible card component for content display
- `Badge` - Status and category indicators
- `Input` - Form input with consistent styling

### Layout Components
- `Header` - Navigation with responsive menu
- `Footer` - Site footer with links and branding
- `SEOHead` - Dynamic meta tags for SEO

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🚀 Deployment

The site is configured for deployment on Netlify with:
- `_redirects` file for SPA routing
- Optimized build output
- Environment variable support

## 🤖 AI Features

### Travel Assistant
- Natural language trip planning
- Personalized recommendations
- OpenAI-powered itinerary generation
- Real-time price monitoring
- Structured JSON responses for travel data
- 24/7 chat support

### Smart Features
- Price prediction algorithms
- Deal discovery engine
- Preference learning
- Multi-destination optimization
- Cost estimation and budget planning

## 👥 Social Features (NEW in Version 2)

### Travel Buddy Matching
- Tinder-style swipe interface
- AI-powered compatibility scoring
- Interest and destination-based matching
- Real-time match notifications

### Trip Planning & Sharing
- Personal travel dashboard
- Save and share itineraries
- Group trip planning
- Travel buddy requests and management

### User Profiles
- Detailed travel preferences
- Photo and bio management
- Interest and destination tracking
- Privacy controls

## 📊 Performance

- Lighthouse Score: 90+ across all metrics
- Core Web Vitals optimized
- Lazy loading for images
- Code splitting for optimal bundle size

## 🔒 Security & Privacy

- Row Level Security (RLS) in Supabase
- Secure API communication patterns
- Privacy-compliant data handling
- GDPR considerations built-in
- User data encryption

## 📈 Version 2 Changelog

### New Features
- **Travel Buddy System**: Complete Tinder-style matching system
- **Social Profiles**: Enhanced user profiles with travel preferences
- **Trip Management**: Personal dashboard for managing trips and matches
- **Real-time Matching**: Instant notifications for new travel buddy matches
- **Advanced Database Schema**: Comprehensive social travel features

### Technical Improvements
- **Supabase Integration**: Full database migration to Supabase
- **Enhanced Security**: Row Level Security policies
- **Performance Optimization**: Improved database indexing
- **Real-time Features**: Live updates for social interactions

### Database Migrations
- `20250705000628_aged_pond.sql`: Core travel and social tables
- `20250705001107_cool_torch.sql`: Travel buddy swipe and match system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase for the powerful backend-as-a-service
- Tailwind CSS for the utility-first styling
- Lucide for the beautiful icons
- Unsplash for the high-quality images
- All the open-source contributors

## 📞 Support

For support, email support@utrippin.com or join our Slack channel.

---

**UTrippin Version 2** - Making travel planning effortless with AI-powered assistance and social connections.