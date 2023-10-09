import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getSearchQuery } from './js/api';
import { renderPhotoCards } from './js/render';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  target: document.querySelector('.js-guard'),
  hasReachedEnd: document.querySelector('.end-search'),
};

let options = {
  roll: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(handleLoadMore, options);
let lightbox;
let page = 1;

refs.form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const { query } = event.currentTarget.elements;
  page = 1;

  getSearchQuery(query.value, page)
    .then(result => {
      if (result.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.success(`Hooray! We found ${result.totalHits} images.`);
      refs.target.dataset.query = query.value;
      refs.gallery.innerHTML = renderPhotoCards(result.hits);
      observer.observe(refs.target);

      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a');
      }

      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Sorry, something went wrong. Please try again.');
    });
}

function handleLoadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      const { query } = refs.target.dataset;

      getSearchQuery(query, page)
        .then(result => {
          if (
            result.totalHits - refs.gallery.children.length < 40 &&
            result.totalHits > 0
          ) {
            refs.hasReachedEnd.classList.remove('is-hidden');
            observer.unobserve(refs.target);
          }
          refs.gallery.insertAdjacentHTML(
            'beforeend',
            renderPhotoCards(result.hits)
          );
          lightbox.refresh();
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
}
