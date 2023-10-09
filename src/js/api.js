import axios from 'axios';
import { API_KEY } from './refs';

axios.defaults.baseURL = 'https://pixabay.com/';

export async function getSearchQuery(query, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });

  const response = await axios.get('/api/', { params });
  return response.data;
}
