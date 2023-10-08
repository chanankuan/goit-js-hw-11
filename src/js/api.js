import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
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
  });

  try {
    const response = await axios.get('/api/', { params });
    return response.data;
  } catch (error) {
    console.log(error);
    Notify.failure('Sorry, something went wrong. Please try again.');
  }
}
