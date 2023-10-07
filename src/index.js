import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getSearchQuery } from './js/api';
import { renderPhotoCards } from './js/render';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox;
let page = 1;

refs.form.addEventListener('submit', handleSearch);
refs.loadMoreBtn.addEventListener('click', handleLoadMore);

function handleSearch(event) {
  event.preventDefault();
  const { searchQuery } = event.currentTarget.elements;
  page = 1;
  performSearch(searchQuery.value, page);
}

function handleLoadMore() {
  page += 1;
  const { query } = refs.loadMoreBtn.dataset;
  performSearch(query, page);
}

async function performSearch(query, page) {
  const result = await getSearchQuery(query, page);

  if (result.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    Notify.success(`Hooray! We found ${result.totalHits} images.`);
    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.dataset.query = query;
    refs.gallery.innerHTML = renderPhotoCards(result.hits);
    lightbox = new SimpleLightbox('.gallery a');
  } else {
    refs.gallery.insertAdjacentHTML('beforeend', renderPhotoCards(result.hits));
    lightbox.refresh();
  }
}
