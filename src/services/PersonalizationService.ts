// src/services/PersonalizationService.ts

import { supabase } from '@/integrations/supabase/client';

export interface UserPersonalizationData {
  profile: any;
  preferences: any;
  isAgent: boolean;
}

export class PersonalizationService {
  async getUserPersonalizationData(userId: string): Promise<UserPersonalizationData | null> {
    try {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`
          email,
          age,
          bio,
          location,
          travel_style,
          interests,
          preferred_destinations,
          languages_spoken,
          expedia_affiliate_id,
          booking_affiliate_id,
          agoda_affiliate_id
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      // Get travel preferences
      const { data: preferences, error: preferencesError } = await supabase
        .from('travel_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        console.error('Error fetching travel preferences:', preferencesError);
      }

      // Check if user is an agent (has any affiliate IDs)
      const isAgent = profile ? !!(profile.expedia_affiliate_id || profile.booking_affiliate_id || profile.agoda_affiliate_id) : false;

      return {
        profile,
        preferences,
        isAgent
      };
    } catch (error) {
      console.error('Error in getUserPersonalizationData:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updateTravelPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('travel_preferences')
        .upsert({ 
          user_id: userId, 
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating travel preferences:', error);
      throw error;
    }
  }

  getPersonalizedPromptContext(data: UserPersonalizationData): string {
    if (!data.profile) return "";

    const { profile, preferences, isAgent } = data;

    return `
**USER PERSONALIZATION:**
- Age: ${profile.age || 'Not specified'}
- Location: ${profile.location || 'Not specified'}
- Travel Style: ${profile.travel_style || 'Not specified'}
- Interests: ${profile.interests?.join(', ') || 'Not specified'}
- Preferred Destinations: ${profile.preferred_destinations?.join(', ') || 'Not specified'}
- Languages: ${profile.languages_spoken?.join(', ') || 'Not specified'}
${isAgent ? '- **AGENT USER**: This user is a travel agent with affiliate capabilities.' : ''}

**TRAVEL PREFERENCES:**
${preferences ? `
- Budget Range: $${preferences.budget_range_min}-$${preferences.budget_range_max}
- Accommodation Types: ${preferences.accommodation_type?.join(', ') || 'Not specified'}
- Preferred Activities: ${preferences.preferred_activities?.join(', ') || 'Not specified'}
- Travel Pace: ${preferences.travel_pace || 'Not specified'}
- Group Size: ${preferences.group_size_preference || 'Not specified'}
- Dietary Restrictions: ${preferences.dietary_restrictions?.join(', ') || 'None'}
- Accessibility Needs: ${preferences.accessibility_needs?.join(', ') || 'None'}
` : '- No specific preferences set'}

**PERSONALIZATION GUIDELINES:**
- Tailor suggestions to match the user's travel style and interests
- Consider their age and location for age-appropriate and locally relevant activities
- Respect stated budget preferences and dietary restrictions
- Match the preferred travel pace (slow/moderate/fast)
${isAgent ? '- For agents: Include premium options and commission-optimized suggestions' : ''}
${isAgent ? '- For agents: Add professional touches that can be white-labeled for their clients' : ''}
    `;
  }

  // Agent-specific branding options
  getAgentBrandingOptions(isAgent: boolean) {
    if (!isAgent) return null;

    return {
      showCommissionBadges: true,
      professionalLayout: true,
      customizableHeader: true,
      whitelabelOptions: true,
      premiumBookingEmphasis: true
    };
  }
}

export const personalizationService = new PersonalizationService();
