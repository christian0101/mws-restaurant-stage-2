let restaurant;var map;document.addEventListener("DOMContentLoaded",e=>{DBHelper.registerServiceWorker(),this._toastsView=new Toast,fetchRestaurantFromURL()}),window.initMap=(()=>{self.restaurant&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))}),fetchRestaurantFromURL=(()=>{if(self.restaurant)return;const e=getParameterByName("id");e?DBHelper.fetchRestaurantById(e,(e,t)=>{if(self.restaurant=t,!t){self.restaurant={};this._toastsView.create(e)}fillRestaurantHTML(),Helper.lazyLoad()}):error="No restaurant id in URL"}),fillRestaurantHTML=((e=self.restaurant)=>{fillBreadcrumb();const t=document.getElementsByTagName("head")[0],n=document.createElement("meta");n.setAttribute("name","description"),n.setAttribute("content",`Detailed information about ${e.name}`),t.append(n);const a=document.getElementById("restaurant-name");a.innerHTML=e.name,a.title="restaurant name";const r=document.getElementById("restaurant-address");r.innerHTML=e.address,r.title="restaurant address";const s=DBHelper.imageUrlForRestaurant(e,!0),i=document.getElementById("restaurant-img");i.className="restaurant-img",i.classList.add("lazy"),i.src=s,i.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),i.setAttribute("data-srcset",DBHelper.imageSRCSetUrlsForRestaurant(e,["1x","2x"])),i.alt=e.photograph?DBHelper.getPhotoDescription(e):"no picture found";const l=document.getElementById("restaurant-cuisine");l.innerHTML=e.cuisine_type,l.title="restaurant cuisine type",e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,r.className="openhours-day",a.appendChild(r);const s=document.createElement("td");s.innerHTML=e[n],s.className="openhours-time",a.appendChild(s),t.appendChild(a)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.className="review-name",n.title="reviewer's name",t.appendChild(n);const a=document.createElement("p");a.innerHTML=e.date,a.className="review-date",a.title="date when review was posted",t.appendChild(a);const r=document.createElement("p");r.innerHTML=`Rating: ${e.rating}`,r.className="review-rating",r.title="given rating",t.appendChild(r);const s=document.createElement("p");return s.innerHTML=e.comments,s.className="review-comments",s.title="comments from the reviewer",t.appendChild(s),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});