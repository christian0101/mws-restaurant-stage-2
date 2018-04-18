
class PrivateContent {

  static getMapAPI() {
    return 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBmEW_-AejQ5xe_QdcSEDOvAri6hLCEEr0&libraries=places&callback=initMap';
  }

  static addMap() {
    const select = document.getElementById('API');
    select.setAttribute('src', PrivateContent.getMapAPI());
  }
}
