let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch data as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  DBHelper.registerServiceWorker();
  this._dbPromise = DBHelper.openDatabase();
  fetchNeighborhoods();
  fetchCuisines();
  PrivateContent.addMap();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

  this._showCachedRestaurants().then(function() {
    updateRestaurants();
  });
}

_showCachedRestaurants = () => {
  return this._dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db) return;

    var index = db.transaction('restuarnats').objectStore('restuarnats');

    return index.getAll().then(function(restaurants) {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    });
  });
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
      networkWarning();
    } else {
      resetRestaurants(restaurants);
      _updateDB();
      fillRestaurantsHTML();
    }
  })
}

/**
 * No restaurants found.
 */
networkWarning = () => {
  const ul = document.getElementById('restaurants-list');
  ul.insertAdjacentHTML('beforeend', `<p class="network-warning"><span>Oh no! There was an error making a request for restuarnats.</span></p>`);
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Add new restaurants from network.
 */
_updateDB = (restaurants = self.restaurants) => {
  this._dbPromise.then(function(db) {
    if (!db) return;

    var tx = db.transaction('restuarnats', 'readwrite');
    var store = tx.objectStore('restuarnats');

    restaurants.forEach(restaurant => {
      store.put(restaurant);
    });
  });
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imgSrc = DBHelper.imageUrlForRestaurant(restaurant);
  if (imgSrc) {
    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = imgSrc;
    image.alt = DBHelper.getPhotoDescription(restaurant);
    li.append(image);
  } else {
    const image = document.createElement('div');
    image.alt = "No image found!";
    image.innerHTML = "No image found!";
    li.append(image);
  }

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  name.title = 'restaurant name';
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.title = 'restaurant neighborhood';
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.title = 'restaurant address';
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = `View More about ${restaurant.name}`;
  more.title = `More details about the resturant ${restaurant.name}`;
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });

    self.markers.push(marker);
  });
}
