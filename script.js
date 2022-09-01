let activeTab = "Python";

cardDetails = {
  image: "",
  title: "",
  author: "",
  rating: 0.0,
  ratingNum: 0,
  price: 0,
  beforeOffer: -1,
};
function generateCard() {
  // create lectureCard
  let card = document.createElement("div");
  card.className = "card";
  // lectureCard image
  let courseImg = document.createElement("img");
  courseImg.src = cardDetails.image;
  courseImg.alt = "course image";
  card.appendChild(courseImg);
  // lectureCard title
  let title = document.createElement("h3");
  title.className = "title";
  title.innerHTML = cardDetails.title;
  card.appendChild(title);
  // lectureCard author name
  let author = document.createElement("p");
  author.className = "author";
  author.innerHTML = cardDetails.author;
  card.appendChild(author);
  // lectureCard rating
  let rating = document.createElement("div");
  rating.className = "rating";
  let ratingRatio = document.createElement("span");
  ratingRatio.className = "checked";
  ratingRatio.innerHTML = cardDetails.rating;
  rating.appendChild(ratingRatio);
  // lectureCard star rating
  for (let i = 1, myrating = cardDetails.rating; i <= 5; i++, myrating--) {
    let star = document.createElement("span");
    if (myrating >= 1) {
      star.className = "fa fa-star checked";
    } else if (myrating > 0) {
      star.className = "fa fa-star-half-full";
    } else {
      star.className = "fa fa-star-o";
    }
    rating.appendChild(star);
  }
  // lectureCard number of ratings
  let ratinglabel = document.createElement("label");
  ratinglabel.innerHTML = "(" + cardDetails.ratingNum + ")";
  rating.appendChild(ratinglabel);
  card.appendChild(rating);
  // lectureCard price
  let price = document.createElement("div");
  price.className = "price";
  let realprice = document.createElement("span");
  realprice.innerHTML = cardDetails.price;
  price.appendChild(realprice);
  // lectureCard offer if exist
  if (cardDetails.offer != -1) {
    let price_without_offer = document.createElement("del");
    price_without_offer.innerHTML = cardDetails.beforeOffer;
    price.appendChild(price_without_offer);
  }
  card.appendChild(price);

  document.querySelector(".container").appendChild(card);
}
const newFetch = fetch("http://localhost:3000/" + activeTab).then(
  (response) => {
    let jsondata = response.json();
    return jsondata;
  }
);

newFetch.then((course) => {
  let courseLectures = course["Lectures"];
  for (let Lecture of courseLectures) {
    cardDetails.image = Lecture["image"];
    cardDetails.title = Lecture["title"];
    cardDetails.author = Lecture["author"];
    cardDetails.rating = Lecture["rating"];
    cardDetails.ratingNum = Lecture["ratings"];
    cardDetails.price = Lecture["price"];
    cardDetails.beforeOffer = Lecture["beforeOffer"];
    generateCard();
  }
});
