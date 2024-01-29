import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

let currentPage = 1;
let searchQuery = '';
let loadingImages = false;

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");
    const galleryContainer = document.querySelector(".gallery");
    const lightbox = new SimpleLightbox(".gallery a");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loadingIndicator = document.getElementById("loadingIndicator");

    searchForm.addEventListener("submit", handleFormSubmit);
    loadMoreBtn.addEventListener("click", loadMoreImages);

    async function handleFormSubmit(event) {
        event.preventDefault();

        searchQuery = document.querySelector("#searchQuery").value;
        if (!searchQuery.trim()) {
            iziToast.error({
                title: "Error",
                message: "Please enter a search query.",
            });
            return;
        }

        try {
            currentPage = 1;
            await fetchImages(searchQuery);
            showLoadMoreButton();
        } catch (error) {
            console.error("Error handling form submission:", error);
        }
    }

    async function fetchImages(query, page = 1) {
        const apiKey = `41927432-a4c56e3ebe36f8f9b7d51fc62`;
        const perPage = 40;
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

        try {
            if (page === 1) {
                showLoadingIndicator();
                iziToast.info({
                    title: "Loading",
                    message: "Fetching images...",
                });
       
            }
            const response = await axios.get(apiUrl);
            const data = response.data;
            if (page === 1) {
                renderImages(data.hits);
            } else {
                appendImages(data.hits);
                scrollPageSmoothly(getGalleryCardHeight());
            }
               
        } catch (error) {
            console.error("Error fetching data:", error);
            iziToast.error({
                title: "Error",
                message: "Failed to fetch images. Please try again.",
            });
        } finally {
            hideLoadingIndicator();
        }
    }

function processImages(images, clearGallery = true) {
    if (clearGallery) {
        galleryContainer.innerHTML = "";
    }

    if (images.length === 0) {
        iziToast.warning({
            title: "No Results",
            message: "Sorry, there are no images matching your search query. Please try again!",
        });
        hideLoadMoreButton();
        return;
    }

    images.forEach(image => {
        const imageCard = createImageCard(image);
        galleryContainer.appendChild(imageCard);
    });

    lightbox.refresh();
    showLoadMoreButton();
}

function renderImages(images) {
    processImages(images);
}

function appendImages(images) {
    processImages(images, false);
}


    function createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';

        const link = document.createElement('a');
        link.href = image.largeImageURL;
        link.setAttribute('data-lightbox', 'gallery');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;

        const likes = document.createElement('span');
        likes.textContent = `Likes: ${image.likes}`;

        const views = document.createElement('span');
        views.textContent = `Views: ${image.views}`;

        const comments = document.createElement('span');
        comments.textContent = `Comments: ${image.comments}`;

        const downloads = document.createElement('span');
        downloads.textContent = `Downloads: ${image.downloads}`;

        link.appendChild(img);
        link.appendChild(likes);
        link.appendChild(views);
        link.appendChild(comments);
        link.appendChild(downloads);
        card.appendChild(link);
        return card;
    }
 async function loadMoreImages() {
      if (loadingImages) {
            return;
        }

        try {
            loadingImages = true;
            currentPage++;
            await fetchImages(searchQuery, currentPage);
        } finally {
            loadingImages = false;
        };
  }

  function showLoadMoreButton() {
    loadMoreBtn.style.display = 'inline-block';
  }

  function hideLoadMoreButton() {
    loadMoreBtn.style.display = 'none';
  }

  function showLoadingIndicator() {
    loadingIndicator.style.display = 'block';
  }

  function hideLoadingIndicator() {
    loadingIndicator.style.display = 'none';
    }

function getGalleryCardHeight() {
    const galleryCard = document.querySelector(".image-card");
    const cardRect = galleryCard.getBoundingClientRect();
    return cardRect.height;
  }

  function scrollPageSmoothly(scrollDistance) {
    window.scrollBy({
      top: scrollDistance,
      behavior: "smooth",
    });
  }

  });

