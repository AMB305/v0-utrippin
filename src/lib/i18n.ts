import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        flights: 'Flights',
        hotels: 'Hotels',
        cars: 'Cars',
        packages: 'Packages',
        experiences: 'Experiences',
        cruises: 'Cruises',
        deals: 'Deals',
        blog: 'Blog',
        travelBuddies: 'Travel Buddies',
        aiRecommendations: 'AI Recommendations',
        premium: 'Premium',
        more: 'More'
      },
      
      // Authentication
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?"
      },
      
      // Homepage
      home: {
        heroTitle: 'Discover Your Next Adventure',
        heroSubtitle: 'Find amazing travel experiences and connect with like-minded travelers',
        searchPlaceholder: 'Where do you want to go?',
        popularDestinations: 'Popular Destinations',
        travelCategories: 'Travel Categories',
        featuredDeals: 'Featured Deals'
      },
      
      // Travel Buddies
      travelBuddies: {
        title: 'Travel Buddies',
        subtitle: 'Connect with fellow travelers',
        findBuddies: 'Find Travel Buddies',
        myMatches: 'My Matches',
        messages: 'Messages',
        filters: 'Filters',
        location: 'Location',
        age: 'Age',
        travelStyle: 'Travel Style',
        interests: 'Interests',
        swipeLeft: 'Pass',
        swipeRight: 'Like',
        itsAMatch: "It's a Match!",
        sendMessage: 'Send Message',
        typeMessage: 'Type a message...'
      },
      
      // AI Recommendations
      aiRecommendations: {
        title: 'AI Trip Recommendations',
        subtitle: 'Personalized travel suggestions powered by AI',
        generateNew: 'Generate New',
        generating: 'Generating...',
        noRecommendations: 'No Recommendations Yet',
        firstSet: 'Generate your first set of personalized travel recommendations',
        match: 'match',
        save: 'Save',
        saved: 'Saved',
        activities: 'Suggested Activities:',
        days: 'days',
        new: 'New'
      },
      
      // Premium
      premium: {
        title: 'Premium Features',
        subtitle: 'Unlock the full potential of UTrippIN',
        freePlan: 'Free Plan',
        premiumPlan: 'Premium Plan',
        proPlan: 'Pro Plan',
        month: '/month',
        year: '/year',
        features: {
          unlimitedSwipes: 'Unlimited Swipes',
          advancedFilters: 'Advanced Filters',
          priorityMatching: 'Priority Matching',
          groupPlanning: 'Group Planning',
          apiAccess: 'API Access',
          whiteLabel: 'White-label Solutions'
        },
        upgrade: 'Upgrade Now',
        current: 'Current Plan'
      },
      
      // Search & Booking
      search: {
        from: 'From',
        to: 'To',
        departure: 'Departure',
        return: 'Return',
        passengers: 'Passengers',
        rooms: 'Rooms',
        adults: 'Adults',
        children: 'Children',
        search: 'Search',
        filters: 'Filters',
        sortBy: 'Sort by',
        price: 'Price',
        duration: 'Duration',
        stops: 'Stops',
        rating: 'Rating',
        amenities: 'Amenities'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        select: 'Select',
        all: 'All',
        none: 'None',
        yes: 'Yes',
        no: 'No'
      },
      
      // Currency
      currency: {
        usd: 'USD - US Dollar',
        eur: 'EUR - Euro',
        gbp: 'GBP - British Pound',
        jpy: 'JPY - Japanese Yen',
        aud: 'AUD - Australian Dollar',
        cad: 'CAD - Canadian Dollar'
      }
    }
  },
  
  es: {
    translation: {
      // Navigation
      nav: {
        flights: 'Vuelos',
        hotels: 'Hoteles',
        cars: 'Coches',
        packages: 'Paquetes',
        experiences: 'Experiencias',
        cruises: 'Cruceros',
        deals: 'Ofertas',
        blog: 'Blog',
        travelBuddies: 'Compañeros de Viaje',
        aiRecommendations: 'Recomendaciones IA',
        premium: 'Premium',
        more: 'Más'
      },
      
      // Authentication
      auth: {
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        forgotPassword: '¿Olvidaste tu contraseña?',
        createAccount: 'Crear Cuenta',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        dontHaveAccount: '¿No tienes una cuenta?'
      },
      
      // Homepage
      home: {
        heroTitle: 'Descubre Tu Próxima Aventura',
        heroSubtitle: 'Encuentra experiencias de viaje increíbles y conecta con viajeros afines',
        searchPlaceholder: '¿A dónde quieres ir?',
        popularDestinations: 'Destinos Populares',
        travelCategories: 'Categorías de Viaje',
        featuredDeals: 'Ofertas Destacadas'
      },
      
      // Travel Buddies
      travelBuddies: {
        title: 'Compañeros de Viaje',
        subtitle: 'Conecta con otros viajeros',
        findBuddies: 'Encontrar Compañeros',
        myMatches: 'Mis Coincidencias',
        messages: 'Mensajes',
        filters: 'Filtros',
        location: 'Ubicación',
        age: 'Edad',
        travelStyle: 'Estilo de Viaje',
        interests: 'Intereses',
        swipeLeft: 'Pasar',
        swipeRight: 'Me Gusta',
        itsAMatch: '¡Es una Coincidencia!',
        sendMessage: 'Enviar Mensaje',
        typeMessage: 'Escribe un mensaje...'
      },
      
      // AI Recommendations
      aiRecommendations: {
        title: 'Recomendaciones IA de Viajes',
        subtitle: 'Sugerencias de viaje personalizadas con IA',
        generateNew: 'Generar Nuevas',
        generating: 'Generando...',
        noRecommendations: 'Sin Recomendaciones Aún',
        firstSet: 'Genera tu primer conjunto de recomendaciones de viaje personalizadas',
        match: 'coincidencia',
        save: 'Guardar',
        saved: 'Guardado',
        activities: 'Actividades Sugeridas:',
        days: 'días',
        new: 'Nuevo'
      },
      
      // Premium
      premium: {
        title: 'Características Premium',
        subtitle: 'Desbloquea todo el potencial de UTrippIN',
        freePlan: 'Plan Gratuito',
        premiumPlan: 'Plan Premium',
        proPlan: 'Plan Pro',
        month: '/mes',
        year: '/año',
        features: {
          unlimitedSwipes: 'Deslizamientos Ilimitados',
          advancedFilters: 'Filtros Avanzados',
          priorityMatching: 'Coincidencias Prioritarias',
          groupPlanning: 'Planificación Grupal',
          apiAccess: 'Acceso API',
          whiteLabel: 'Soluciones de Marca Blanca'
        },
        upgrade: 'Actualizar Ahora',
        current: 'Plan Actual'
      },
      
      // Search & Booking
      search: {
        from: 'Desde',
        to: 'Hasta',
        departure: 'Salida',
        return: 'Regreso',
        passengers: 'Pasajeros',
        rooms: 'Habitaciones',
        adults: 'Adultos',
        children: 'Niños',
        search: 'Buscar',
        filters: 'Filtros',
        sortBy: 'Ordenar por',
        price: 'Precio',
        duration: 'Duración',
        stops: 'Escalas',
        rating: 'Calificación',
        amenities: 'Servicios'
      },
      
      // Common
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        save: 'Guardar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Eliminar',
        view: 'Ver',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        close: 'Cerrar',
        select: 'Seleccionar',
        all: 'Todos',
        none: 'Ninguno',
        yes: 'Sí',
        no: 'No'
      },
      
      // Currency
      currency: {
        usd: 'USD - Dólar Estadounidense',
        eur: 'EUR - Euro',
        gbp: 'GBP - Libra Esterlina',
        jpy: 'JPY - Yen Japonés',
        aud: 'AUD - Dólar Australiano',
        cad: 'CAD - Dólar Canadiense'
      }
    }
  },
  
  fr: {
    translation: {
      // Navigation
      nav: {
        flights: 'Vols',
        hotels: 'Hôtels',
        cars: 'Voitures',
        packages: 'Forfaits',
        experiences: 'Expériences',
        cruises: 'Croisières',
        deals: 'Offres',
        blog: 'Blog',
        travelBuddies: 'Compagnons de Voyage',
        aiRecommendations: 'Recommandations IA',
        premium: 'Premium',
        more: 'Plus'
      },
      
      // Authentication
      auth: {
        signIn: 'Se Connecter',
        signUp: "S'inscrire",
        signOut: 'Se Déconnecter',
        email: 'Email',
        password: 'Mot de Passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        forgotPassword: 'Mot de passe oublié?',
        createAccount: 'Créer un Compte',
        alreadyHaveAccount: 'Vous avez déjà un compte?',
        dontHaveAccount: "Vous n'avez pas de compte?"
      },
      
      // Homepage
      home: {
        heroTitle: 'Découvrez Votre Prochaine Aventure',
        heroSubtitle: 'Trouvez des expériences de voyage incroyables et connectez-vous avec des voyageurs similaires',
        searchPlaceholder: 'Où voulez-vous aller?',
        popularDestinations: 'Destinations Populaires',
        travelCategories: 'Catégories de Voyage',
        featuredDeals: 'Offres Vedettes'
      },
      
      // Travel Buddies
      travelBuddies: {
        title: 'Compagnons de Voyage',
        subtitle: 'Connectez-vous avec d\'autres voyageurs',
        findBuddies: 'Trouver des Compagnons',
        myMatches: 'Mes Correspondances',
        messages: 'Messages',
        filters: 'Filtres',
        location: 'Lieu',
        age: 'Âge',
        travelStyle: 'Style de Voyage',
        interests: 'Intérêts',
        swipeLeft: 'Passer',
        swipeRight: "J'aime",
        itsAMatch: 'C\'est un Match!',
        sendMessage: 'Envoyer un Message',
        typeMessage: 'Tapez un message...'
      },
      
      // AI Recommendations
      aiRecommendations: {
        title: 'Recommandations IA de Voyage',
        subtitle: 'Suggestions de voyage personnalisées avec IA',
        generateNew: 'Générer de Nouvelles',
        generating: 'Génération...',
        noRecommendations: 'Aucune Recommandation Encore',
        firstSet: 'Générez votre premier ensemble de recommandations de voyage personnalisées',
        match: 'correspondance',
        save: 'Sauvegarder',
        saved: 'Sauvegardé',
        activities: 'Activités Suggérées:',
        days: 'jours',
        new: 'Nouveau'
      },
      
      // Premium
      premium: {
        title: 'Fonctionnalités Premium',
        subtitle: 'Débloquez tout le potentiel d\'UTrippIN',
        freePlan: 'Plan Gratuit',
        premiumPlan: 'Plan Premium',
        proPlan: 'Plan Pro',
        month: '/mois',
        year: '/an',
        features: {
          unlimitedSwipes: 'Glissements Illimités',
          advancedFilters: 'Filtres Avancés',
          priorityMatching: 'Correspondance Prioritaire',
          groupPlanning: 'Planification de Groupe',
          apiAccess: 'Accès API',
          whiteLabel: 'Solutions de Marque Blanche'
        },
        upgrade: 'Mettre à Niveau',
        current: 'Plan Actuel'
      },
      
      // Search & Booking
      search: {
        from: 'De',
        to: 'À',
        departure: 'Départ',
        return: 'Retour',
        passengers: 'Passagers',
        rooms: 'Chambres',
        adults: 'Adultes',
        children: 'Enfants',
        search: 'Rechercher',
        filters: 'Filtres',
        sortBy: 'Trier par',
        price: 'Prix',
        duration: 'Durée',
        stops: 'Escales',
        rating: 'Évaluation',
        amenities: 'Équipements'
      },
      
      // Common
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        save: 'Sauvegarder',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        view: 'Voir',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        close: 'Fermer',
        select: 'Sélectionner',
        all: 'Tous',
        none: 'Aucun',
        yes: 'Oui',
        no: 'Non'
      },
      
      // Currency
      currency: {
        usd: 'USD - Dollar Américain',
        eur: 'EUR - Euro',
        gbp: 'GBP - Livre Sterling',
        jpy: 'JPY - Yen Japonais',
        aud: 'AUD - Dollar Australien',
        cad: 'CAD - Dollar Canadien'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;