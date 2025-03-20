const API_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, "");
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

export { API_URL, ACCESS_TOKEN };

export const getItems = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  console.log("items");
  const data = await response.json();
  return data.Items;
};

export const getMovies = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Movie`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  console.log("movies");
  const data = await response.json();
  return data.Items;
};

export const getShows = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true&IncludeItemTypes=Series`, {
    headers: { 'X-Emby-Token': ACCESS_TOKEN },
  });
  console.log("shows");
  const data = await response.json();
  return data.Items;
};
