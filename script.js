// course carousel
let carouselWidth = document.querySelector(".carousel-container").offsetWidth;
const next_btn = document.querySelector(".carousel-buttons .next");
const prev_btn = document.querySelector(".carousel-buttons .prev");
const track = document.querySelector(".carousel-container .track");
// if the screen size changed
window.addEventListener("resize", () => {
  carouselWidth = document.querySelector(".carousel-container").offsetWidth;
});

// buttons
let index = 0;
next_btn.addEventListener("click", () => {
  index++;
  track.style.transform = `translateX(-${index * carouselWidth}px)`;
  prev_btn.style.display = "block";
  console.log(track.offsetWidth, index, index * carouselWidth, carouselWidth);
  if (track.offsetWidth - index * carouselWidth < carouselWidth) {
    next_btn.style.display = "none";
  }
});

prev_btn.addEventListener("click", () => {
  index--;
  track.style.transform = `translateX(-${index * carouselWidth}px)`;
  next_btn.style.display = "block";

  if (index === 0) {
    prev_btn.style.display = "none";
  }
});

// course lectures
let activeTab = "Python";
async function generateCard(lecture) {
  // create lectureCard
  let card = document.createElement("div");
  card.className = "lectureCard";
  // lectureCard image
  let courseImg = document.createElement("div");
  courseImg.className = "courseImg";
  myImage = document.createElement("img");
  myImage.src = lecture["image"];
  myImage.alt = "course image";
  courseImg.appendChild(myImage);
  card.appendChild(courseImg);
  // lectureCard title
  let title = document.createElement("h6");
  title.className = "title";
  title.innerHTML = lecture["title"];
  card.appendChild(title);
  // lectureCard author name
  let author = document.createElement("p");
  author.className = "author";
  author.innerHTML = lecture["author"];
  card.appendChild(author);
  // lectureCard rating
  let rating = document.createElement("div");
  rating.className = "rating";
  let ratingRatio = document.createElement("span");
  ratingRatio.className = "checked";
  ratingRatio.innerHTML = lecture["rating"];
  rating.appendChild(ratingRatio);
  // lectureCard star rating
  for (let i = 1, myrating = lecture["rating"]; i <= 5; i++, myrating--) {
    let star = document.createElement("span");
    if (myrating >= 1) {
      star.className = "bi bi-star-fill";
    } else if (myrating > 0) {
      star.className = "bi bi-star";
    } else {
      star.className = "bi bi-star-half";
    }
    rating.appendChild(star);
  }
  // lectureCard number of ratings
  let ratinglabel = document.createElement("label");
  ratinglabel.innerHTML = "(" + lecture["ratings"] + ")";
  rating.appendChild(ratinglabel);
  card.appendChild(rating);
  // lectureCard price
  let price = document.createElement("div");
  price.className = "price";
  let realprice = document.createElement("span");
  realprice.className = "realPrice";
  realprice.innerHTML = "E£ " + lecture["price"];
  price.appendChild(realprice);
  // lectureCard offer if exist
  if (lecture["beforeOffer"] != -1) {
    let price_without_offer = document.createElement("del");
    price_without_offer.innerHTML = "E£ " + lecture["beforeOffer"];
    price.appendChild(price_without_offer);
  }
  card.appendChild(price);
  const temp = document.createElement("div");
  temp.className = "card-container";
  temp.appendChild(card);
  document.querySelector(".track").appendChild(temp);
}
const fetchCourse = fetch("http://localhost:3000/" + activeTab).then(
  (response) => {
    let jsondata = response.json();
    return jsondata;
  }
);
fetchCourse.then((course) => {
  for (let lecture of course["Lectures"]) {
    generateCard(lecture);
  }
});

// search bar
function compareStrings(string, substring) {
  string = string.toLowerCase();
  substring = substring.toLowerCase();
  return string.includes(substring);
}
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");
function searchData(event) {
  if (event.key !== "Enter" && event != "Enter") return;
  // get lectures data
  const searchFetch = fetch("http://localhost:3000/" + activeTab)
    .then((searchResult) => {
      return searchResult.json();
    })
    .then((searchResult) => {
      // show all lectures
      for (let lecture of searchResult["Lectures"]) {
        let temp = document.querySelectorAll(".container .lectureCard")[
          lecture["id"]
        ];
        temp.style.cssText = "display: inline";
      }

      // show all courses in case the search value is empty
      if (searchInput.value.length === 0) return;
      for (let lecture of searchResult["Lectures"]) {
        let title = compareStrings(lecture["title"], searchInput.value);
        let author = compareStrings(lecture["author"], searchInput.value);
        let price = compareStrings(lecture["price"], searchInput.value);
        // console.log(title, author, price);
        if (title === false && author === false && price === false) {
          let temp = document.querySelectorAll(".container .lectureCard")[
            lecture["id"]
          ];
          temp.style.cssText = "display: none";
        }
      }
    })
    .then(() => (searchInput.value = "")); // clear search bar input
}
searchInput.addEventListener("keyup", () => searchData(this.event));
searchButton.addEventListener("click", () => searchData("Enter"));
