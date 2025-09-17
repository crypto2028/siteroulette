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

// Submit new URL
submitBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return showMessage("Please enter a URL", "error");

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ url }),   // Send JSON
      headers: {
        "Content-Type": "application/json", // Explicit header
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    if (data.success) {
      showMessage("✅ URL added!", "success");
      urlInput.value = "";
      await fetchUrls(); // refresh cache
    } else {
      showMessage(`❌ ${data.message}`, "error");
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
