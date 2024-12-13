let metadatas;

function preload() {
  loadUtils();
}

// function run when page loaded
window.onload = function () {
  //loadUtils();
};

async function loadUtils() {
  console.log("utils.js loaded");

  const images = getAllImages();
  console.log("🌆 Images:", images);

  const trackers = getAllTrackers();
  console.log("👀 Trackers:", trackers);

  const links = getAllLinks();
  console.log("⛓️ Links:", links);

  socialNetworks = getSocialDataAndNetworks();
  console.log("🤳 Social Metadata and Networks:", socialNetworks);

  cookies = getCookiesAndBrowserPreferences();
  console.log("🍪 Cookies and user Prefs:", cookies);

  comments = collectCommentsFromCurrentPage();
  console.log("💬 Comments:", comments);

  ads = detectGoogleAdsBanners();
  console.log("💰 Ads:", ads);

  hiddenElements = getHiddenElements();
  console.log("👻 Hidden Elements:", hiddenElements);

  // estimatedCO2 = calculatePageSizeAndCO2();
  // console.log("🌍 Page Size and Estimated CO2:", estimatedCO2);

  // push all data to metadatas
  metadatas = {
    images: images,
    trackers: trackers,
    links: links,
    socialNetworks: socialNetworks,
    cookies: cookies,
    comments: comments,
    ads: ads,
    hiddenElements: hiddenElements,
    // estimatedCO2: estimatedCO2,
  };
}

function setupCanvas(canvas) {
  // Set the canvas to a fixed position and give it a z-index
  canvas.position(0, 0);
  canvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  canvas.style("position", "fixed"); // Set position to fixed
  canvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));
}

// Function to process all images
function getAllImages() {
  const images = [];
  const allImages = document.querySelectorAll("img");

  allImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 180 && img.naturalHeight > 180) {
      // Ensure image is loaded and has minimum dimensions
      //if (img.src.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/i)) {
      // Check for bitmap formats
      images.push({
        src: img.src,
        alt: img.alt || "undefined",
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      //}
    }
  });

  return images;
}

// Function to process all trackers
function getAllTrackers() {
  const trackers = [];
  const allScripts = document.querySelectorAll("script");

  allScripts.forEach((script) => {
    const src = script.src;

    // Check if the script has a src attribute and looks like a tracker
    if (src) {
      let trackerType = "unknown";
      if (/analytics/i.test(src)) {
        trackerType = "analytics";
      } else if (/tag/i.test(src)) {
        trackerType = "tag manager";
      } else if (/ad/i.test(src)) {
        trackerType = "advertising";
      } else if (/track/i.test(src)) {
        trackerType = "event tracking";
      } else if (/remarketing/i.test(src)) {
        trackerType = "remarketing";
      }

      // Add the tracker to the array if it matches any tracker type
      if (trackerType !== "unknown") {
        trackers.push({
          type: "script",
          source: src,
          trackerType: trackerType, // Add the specific tracker type
          purpose: `Potential ${trackerType} script`,
        });
      }
    }
  });

  return trackers;
}

// Function to process all links
function getAllLinks() {
  const links = { internal: [], external: [] };
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const url = link.href;
    const text = link.innerText.trim();

    // Determine if the link is internal or external
    if (url.startsWith(window.location.origin)) {
      links.internal.push({
        url: url,
        text: text || "No Text",
      });
    } else {
      links.external.push({
        url: url,
        text: text || "No Text",
      });
    }
  });

  return links;
}

function getSocialDataAndNetworks() {
  const socialData = {};
  const socialNetworks = [];
  const socialDomains = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "linkedin.com",
    "youtube.com",
    "pinterest.com",
    "tiktok.com",
    "snapchat.com",
  ];

  // Extract Open Graph metadata
  const metaTags = document.querySelectorAll("meta");
  metaTags.forEach((meta) => {
    const property = meta.getAttribute("property");
    const content = meta.getAttribute("content");

    if (property && content && property.startsWith("og:")) {
      socialData[property] = content;
    }
  });

  // Extract linked social networks
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    const href = link.href;
    socialDomains.forEach((domain) => {
      if (href.includes(domain)) {
        socialNetworks.push({
          network: domain.split(".")[0], // Extract the network name
          url: href,
        });
      }
    });
  });

  return { socialData, socialNetworks };
}

function getCookiesAndBrowserPreferences() {
  const cookies = [];
  const rawCookies = document.cookie.split("; ");

  rawCookies.forEach((rawCookie) => {
    const [name, value] = rawCookie.split("=");
    cookies.push({
      name: name || "undefined",
      value: decodeURIComponent(value || ""),
      domain: window.location.hostname,
      expiration: "Session", // Default expiration is 'Session' unless specified
    });
  });

  const browserPreferences = {
    darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
    lightMode: window.matchMedia("(prefers-color-scheme: light)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  };

  return { cookies, browserPreferences };
}

function collectCommentsFromCurrentPage() {
  const htmlContent = document.documentElement.outerHTML;

  // Regex to match code-style comments:
  // 1. Single-line comments: // ...
  // 2. Multi-line comments: /* ... */
  const commentRegex = /(\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)/g;

  const comments = [];
  let match;

  while ((match = commentRegex.exec(htmlContent)) !== null) {
    const commentContent = match[0].trim();

    // Calculate the line number by splitting the HTML before the match
    const beforeComment = htmlContent.slice(0, match.index);
    const lineNumber = beforeComment.split("\n").length;

    comments.push({
      content: commentContent,
      line: lineNumber,
    });
  }

  return comments;
}

function detectGoogleAdsBanners() {
  const ads = [];
  let estimatedTotalValue = 0;

  // Known Google Ads domains and keywords
  const adKeywords = [
    "googleads",
    "googlesyndication",
    "doubleclick",
    "adservice",
  ];

  // Estimated value per impression (based on average CPM of $5)
  const valuePerImpression = 0.005; // $5 CPM = $0.005 per impression

  // Find iframes (common for ad banners)
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    if (adKeywords.some((keyword) => iframe.src.includes(keyword))) {
      estimatedTotalValue += valuePerImpression;

      ads.push({
        type: "iframe",
        url: iframe.src,
        purpose: "Google AdWords banner",
        estimatedValue: `$${valuePerImpression.toFixed(3)}`,
      });
    }
  });

  // Find scripts for ad-serving
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script) => {
    if (
      script.src &&
      adKeywords.some((keyword) => script.src.includes(keyword))
    ) {
      estimatedTotalValue += valuePerImpression;

      ads.push({
        type: "script",
        url: script.src,
        purpose: "Ad-serving script",
        estimatedValue: `$${valuePerImpression.toFixed(3)}`,
      });
    }
  });

  // Total estimated value
  ads.push({
    type: "summary",
    totalEstimatedValue: `$${estimatedTotalValue.toFixed(2)}`,
  });

  return ads;
}
function getHiddenElements() {
  const hiddenElements = [];
  const allElements = document.querySelectorAll("*"); // Select all elements on the page

  allElements.forEach((element) => {
    if (element.tagName.toLowerCase() === "script") return; // Skip <script> tags

    const computedStyle = getComputedStyle(element);

    if (
      computedStyle.display === "none" ||
      computedStyle.visibility === "hidden" ||
      computedStyle.opacity === "0" ||
      computedStyle.height === "0px" ||
      computedStyle.width === "0px" ||
      element.hidden
    ) {
      let content = null;
      if (element.tagName.toLowerCase() === "img" && element.src) {
        content = element.src; // Image source for <img> tags
      } else if (element.textContent.trim()) {
        content = element.textContent.trim(); // Visible text content
      }

      // Only include elements with content
      if (content) {
        const reason = [];
        if (computedStyle.display === "none") reason.push("display: none");
        if (computedStyle.visibility === "hidden")
          reason.push("visibility: hidden");
        if (computedStyle.opacity === "0") reason.push("opacity: 0");
        if (computedStyle.height === "0px") reason.push("height: 0px");
        if (computedStyle.width === "0px") reason.push("width: 0px");
        if (element.hidden) reason.push("hidden attribute");

        const rect = element.getBoundingClientRect(); // Get the bounding box
        hiddenElements.push({
          tag: element.tagName.toLowerCase(),
          content: content,
          reason: reason.join(", "),
          coordinates: {
            x: rect.left + window.scrollX, // Adjust for scrolling
            y: rect.top + window.scrollY, // Adjust for scrolling
          },
        });
      }
    }
  });

  return hiddenElements;
}

async function calculatePageSizeAndCO2() {
  const pageSize = {
    html: 0,
    css: 0,
    js: 0,
    images: 0,
    total: 0,
  };

  // Estimate highly compressed image weights
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    const width = img.naturalWidth || 0;
    const height = img.naturalHeight || 0;
    const area = width * height;

    // Highly compressed weight: 10 KB per 100x100 pixels
    const estimatedWeightKB = (area / 10000) * 10;
    pageSize.images += estimatedWeightKB;
  });

  // Estimate script weights
  const scripts = document.querySelectorAll("script[src]");
  scripts.forEach(() => {
    pageSize.js += 30; // Assume 30 KB per script
  });

  // Fetch and estimate the size of the HTML content
  try {
    const response = await fetch(window.location.href, { method: "GET" });
    const htmlText = await response.text();
    const htmlSizeBytes = new Blob([htmlText]).size; // Get HTML size in bytes
    pageSize.html += htmlSizeBytes / 1024; // Convert bytes to KB
  } catch (error) {
    console.warn("Failed to fetch page HTML:", error);
  }

  // Estimate CSS size (assuming inline and external stylesheets)
  const stylesheets = document.querySelectorAll("link[rel='stylesheet']");
  stylesheets.forEach(() => {
    pageSize.css += 20; // Assume 20 KB per CSS file
  });

  // Calculate total page size
  pageSize.total = pageSize.html + pageSize.css + pageSize.js + pageSize.images;

  // Estimate CO2 emissions
  // Reference: Digital Decarb Calculator (https://digitaldecarb.org/calc_it.html)
  // 1 KB ≈ 0.0002g CO2
  const estimatedCO2 = (pageSize.total * 0.0002).toFixed(2) + "g";

  // Construct the JSON object
  const result = {
    pageSize: pageSize,
    estimatedCO2: estimatedCO2,
  };

  return result;
}
