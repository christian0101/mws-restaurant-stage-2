/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   * Using Fetch API.
   * @param callback the callback function
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(e => callback(e, null));
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch restaurant specified by id.
    fetch(`${DBHelper.DATABASE_URL}/${id}`)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(e => callback('Restaurant does not exist', null));
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image description.
   */
  static getPhotoDescription(restaurant) {
    return (`Photo of ${restaurant.name} in ${restaurant.neighborhood}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant && restaurant.photograph) {
      return (`imgs/${restaurant.photograph}.jpg`);
    } else {
      return null;
    }
  }

  /**
   * Restaurant image srcset URLs.
   */
  static imageSRCSetUrlsForRestaurant(restaurant, indexes) {
    const weights = {0: "800w", 1: "500w", 2: "1600w"};

    let srcSet = "";

    indexes.forEach(index => {
      srcSet += `imgs/${restaurant.photographs[index]} ${weights[index]}, `;
    });

    return srcSet;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

  /**
   * Create database for restuarants.
   */
  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('resturantsData', 1, function(upgradeDb) {
      var store = upgradeDb.createObjectStore('restuarnats', {
        keyPath: 'name'
      });
      store.createIndex('name', 'name');
    });
  }

  /**
   * Register service worker
   */
   static registerServiceWorker() {
     if (!navigator.serviceWorker) {
       return;
     }

     navigator.serviceWorker.register('sw.js').then(function(reg) {
       if (!navigator.serviceWorker.controller) {
         return;
       }

       if (reg.waiting) {
         DBHelper._updateReady(reg.waiting);
         return;
       }

       if (reg.installing) {
         DBHelper._trackInstalling(reg.installing);
         return;
       }

       reg.addEventListener('updatefound', function() {
         DBHelper._trackInstalling(reg.installing);
       });
     });

     // Ensure refresh is only called once.
     // This works around a bug in "force update on reload".
     var refreshing;
     navigator.serviceWorker.addEventListener('controllerchange', function() {
       if (refreshing) return;
       window.location.reload();
       refreshing = true;
     });
   }

   static _trackInstalling(worker) {
     worker.addEventListener('statechange', function() {
       if (worker.state == 'installed') {
         DBHelper._updateReady(worker);
       }
     });
   }

   static _updateReady(worker) {
     const toast = document.getElementById('toast');

     toast.classList.remove('toast-dismissed');
     toast.classList.add('toast');
     toast.focus();

     const refresh = document.getElementById('refreshsw');
     refresh.addEventListener('click', function() {
       worker.postMessage({action: 'skipWaiting'});
     });
   }

   static dismissToast() {
     const toast = document.getElementById('toast');

     toast.classList.remove('toast');
     toast.classList.add('toast-dismissed');
   }
}
