const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweUaj-BrO_6fGgNNP-uyyK-Z0t2yWrs97MfvBU8molutlq0NIrfYO71Ynoii4lWd_K/exec";

const randomBtn = document.getElementById("randomBtn");
const submitBtn = document.getElementById("submitBtn");
const urlInput = document.getElementById("urlInput");
const message = document.getElementById("message");

let urlList = [];

// Fetch URLs from the sheet
async function fetchUrls() {
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    urlList = data.urls || [];
  } catch (err) {
    console.error("Error fetching URLs:", err);
    urlList = [];
  }
}

// Pick a random URL and open in new tab
randomBtn.addEventListener("click", async () => {
  if (!urlList.length) await fetchUrls();
  if (!urlList.length) return showMessage("No URLs available yet!", "error");

  const randomIndex = Math.floor(Math.random() * urlList.length);
  const url = urlList[randomIndex];
  window.open(url, "_blank");
});

// Submit new URL via GET (no CORS issues)
submitBtn.addEventListener("click", async () => {
  const url = encodeURIComponent(urlInput.value.trim());
  if (!url) return showMessage("❌ Please enter a URL", "error");

  try {
    // GET request with URL as query parameter
    const res = await fetch(`${SCRIPT_URL}?url=${url}`);
    const data = await res.json();

    if (data.urls && data.urls.includes(decodeURIComponent(url))) {
      showMessage("✅ URL added!", "success");
      urlInput.value = "";
      urlList = data.urls; // refresh local cache
    } else {
      showMessage("❌ Failed to add URL", "error");
    }
  } catch (err) {
    console.error("Submit error:", err);
    showMessage("❌ Submission failed", "error");
  }
});

// Display messages
function showMessage(msg, type) {
  message.textContent = msg;
  message.className = type;
  setTimeout(() => {
    message.textContent = "";
    message.className = "";
  }, 3000);
}

// Initial fetch
fetchUrls();
