import { useState, useEffect } from 'react';
import { 
  MOCK_USER_STATS, 
  MOCK_LOCATION_STATS, 
  MOCK_USER_PROFILES,
  MOCK_LOCATION_PROFILES,
  getRandomUserProfile,
  getRandomLocationProfile,
  getUserById,
  getLocationStatsByZone 
} from '@/lib/mock-data';
import type { UserStats, LocationStats } from '@/lib/mock-data';

interface UseUserStatsOptions {
  userId?: string;
  locationZone?: string;
  randomize?: boolean;
}

export function useUserStats(options: UseUserStatsOptions = {}) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const loadStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Determine which user profile to load
        let selectedUser: UserStats;
        if (options.userId) {
          selectedUser = getUserById(options.userId) || MOCK_USER_STATS;
        } else if (options.randomize) {
          selectedUser = getRandomUserProfile();
        } else {
          selectedUser = MOCK_USER_STATS;
        }

        // Determine which location profile to load
        let selectedLocation: LocationStats;
        if (options.locationZone) {
          selectedLocation = getLocationStatsByZone(options.locationZone) || MOCK_LOCATION_STATS;
        } else if (options.randomize) {
          selectedLocation = getRandomLocationProfile();
        } else {
          selectedLocation = MOCK_LOCATION_STATS;
        }

        setUserStats(selectedUser);
        setLocationStats(selectedLocation);
        setError(null);
      } catch (err) {
        setError('Failed to load user statistics');
        console.error('Error loading user stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [options.userId, options.locationZone, options.randomize]);

  // Switch to a specific user profile
  const switchUser = (userId: string) => {
    const user = getUserById(userId);
    if (user) {
      setUserStats(user);
    }
  };

  // Switch to a specific location zone
  const switchLocation = (zone: string) => {
    const location = getLocationStatsByZone(zone);
    if (location) {
      setLocationStats(location);
    }
  };

  // Get a random profile (useful for demo/testing)
  const randomizeProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUserStats(getRandomUserProfile());
      setLocationStats(getRandomLocationProfile());
      setIsLoading(false);
    }, 300);
  };

  return {
    userStats,
    locationStats,
    isLoading,
    error,
    
    // Available profiles for switching
    availableUsers: MOCK_USER_PROFILES,
    availableLocations: MOCK_LOCATION_PROFILES,
    
    // Actions
    switchUser,
    switchLocation,
    randomizeProfile,
    refetch: () => {
      setIsLoading(true);
      setUserStats(MOCK_USER_STATS);
      setLocationStats(MOCK_LOCATION_STATS);
      setIsLoading(false);
    }
  };
}