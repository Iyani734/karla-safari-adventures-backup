import { COUNTRIES_DATA } from "./countriesData";


export const getLikedActivities = () => {
  try {
    const stored = localStorage.getItem('safari_activity_likes');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading activity likes from localStorage:', error);
    return {};
  }
};

// Get all activities from all countries with their like status
export const getAllActivitiesWithLikes = () => {
  const likedActivities = getLikedActivities();
  const allActivities = [];
  
  COUNTRIES_DATA.forEach(country => {
    if (country.thingsToDoContent?.activities) {
      country.thingsToDoContent.activities.forEach((activity, index) => {
        const activityId = `${country.name}-activity-${index + 1}`;
        allActivities.push({
          ...activity,
          id: activityId,
          country: country.name,
          countryFlag: country.id, // or however you store flag data
          isLiked: likedActivities[activityId] === true,
          activityNumber: index + 1
        });
      });
    }
  });
  
  return allActivities;
};

// Get only liked activities
export const getAllLikedActivities = () => {
  return getAllActivitiesWithLikes().filter(activity => activity.isLiked);
};

// Get activities by country
export const getActivitiesByCountry = (countryName) => {
  return getAllActivitiesWithLikes().filter(
    activity => activity.country.toLowerCase() === countryName.toLowerCase()
  );
};

// Get liked activities by country
export const getLikedActivitiesByCountry = (countryName) => {
  return getAllLikedActivities().filter(
    activity => activity.country.toLowerCase() === countryName.toLowerCase()
  );
};
