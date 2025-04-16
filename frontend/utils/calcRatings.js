const APP_URL = process.env.APP_URL;

export const addRatings = async (movieID, type) => {
  try {
	const response = await fetch(`${APP_URL}${type}/ratings/${movieID}`)
	const data = await response.json()
  console.log(data)

	// Calculate the sum of ratings and the total number of ratings
    const totalRating = data.totalRating; // Sum of all ratings
    const totalCount = data.result.length; // Total number of ratings

    if (totalCount === 0) {
      return null; // Handle case where there are no ratings
    }

    // Standardize the rating to a scale of 0 to 10
    const standardizedRating = ((totalRating + totalCount) / (totalCount * 4)) * 10;
	return standardizedRating.toFixed(2);
} catch (error) {
    console.error('Error updating movie rating:', error);
  }
};
