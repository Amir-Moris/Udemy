let activeTab = "Python";
// course lectures carousel
let carouselWidth = document.querySelector(".carousel-container").offsetWidth;
const next_btn = document.querySelector(".carousel-buttons .next");
const prev_btn = document.querySelector(".carousel-buttons .prev");
const track = document.querySelector(".carousel-container .track");

// if the screen size changed
window.addEventListener("resize", () => {
  carouselWidth = document.querySelector(".carousel-container").offsetWidth;
});

function checkOverFlow(width, index, carousel_Width) {
  return width - index * carousel_Width < carousel_Width;
}
// buttons
let index = 0;
next_btn.addEventListener("click", () => {
  index++;
  track.style.transform = `translateX(-${index * carouselWidth}px)`;
  prev_btn.style.display = "block";
  if (checkOverFlow(track.offsetWidth, index, carouselWidth)) {
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
function generateCard(lecture) {
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
      star.className = "bi bi-star-half";
    } else {
      star.className = "bi bi-star";
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
  let cardContainer = document.createElement("div");
  cardContainer.className = "card-container";
  cardContainer.appendChild(card);

  return cardContainer;
}
async function getCourse() {
  const fetchCourse = await fetch("http://localhost:3000/" + activeTab)
    .then((response) => {
      let jsondata = response.json();
      return jsondata;
    })
    .then(async (course) => {
      const track = document.querySelector(".track");
      while (await track.lastChild) {
        await track.removeChild(track.lastChild);
      }
      const courseDes = document.querySelector(".courseContent .description");
      courseDes.children[0].innerHTML = course["header"];
      courseDes.children[1].innerHTML = course["details"];
      let courseName = document.querySelector(
        ".course." + activeTab + " button"
      ).textContent;
      courseDes.children[2].textContent = "Explore " + courseName;

      for (let lecture of course["Lectures"]) {
        track.append(generateCard(lecture));
      }
    });
}
// course tabs
const courses = document.querySelectorAll(".courses-tabs .course");
async function initializeTabs() {
  for (let i = 0; i < courses.length; i++) {
    await courses[i].addEventListener("click", async () => {
      await changeActiveTab(courses[i]);
    });
  }
  changeActiveTab(courses[0]);
}
initializeTabs();
async function changeActiveTab(tab) {
  // change the color of the previous tab
  const prev_activeTab = document.querySelector(
    ".courses-tabs .course." + activeTab + " button"
  );
  // change the color of the current tab
  prev_activeTab.style.color = "#8b8c8e";
  tab.children[0].style.color = "black";

  activeTab = tab.classList[1];
  await getCourse();
}
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
    .then((response) => {
      return response.json();
    })
    .then(async (allCourses) => {
      // remove all lectures
      const track = document.querySelector(".track");
      while (await track.lastChild) {
        await track.removeChild(track.lastChild);
      }
      for (let lecture of allCourses["Lectures"]) {
        let title = compareStrings(lecture["title"], searchInput.value);
        let author = compareStrings(lecture["author"], searchInput.value);
        let price = compareStrings(lecture["price"], searchInput.value);

        if (title || author || price) {
          track.appendChild(generateCard(lecture));
        }
      }
    })
    .then(() => (searchInput.value = "")); // clear search bar input
}
searchInput.addEventListener("keyup", () => searchData(this.event));
searchButton.addEventListener("click", () => searchData("Enter"));
