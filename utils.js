let images = [];
let links = [];
let headlines = [];
let meta_datas = [];

function preload() {
  loadUtils();
}

function loadUtils() {
  console.log("utils.js loaded");

  // load all images urls from current page
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    images.push(img.src);
  });

  console.log(images);

  // load all links urls from current page
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    links.push(link.href);
  });

  console.log(links);

  // load all titles from current page by h1, h2, h3, h4, h5, h6
  const allTitles = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  allTitles.forEach((title) => {
    headlines.push(title.innerText);
  });

  console.log(headlines);

  // load all meta datas from current page
  const allMetaDatas = document.querySelectorAll("meta");
  allMetaDatas.forEach((meta_data) => {
    meta_datas.push(meta_data.content);
  });

  console.log(meta_datas);
}
