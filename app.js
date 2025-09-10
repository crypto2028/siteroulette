// ===== CONFIG =====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFKdblNelCgH0RONjt-lvI0QZzgmMXGVdU3uQMaJBliBzqQOoJhbNA3FAzLcm2dTeP/exec"; 
// Replace with your actual Apps Script Web App URL (must end in /exec)

// ===== URL SUBMISSION =====
async function submitURL(event) {
  event.preventDefault();
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();

  if (!url) {
    showMessage("⚠️ Please enter a URL.", "error");
    return;
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();

    if (result.status === "success") {
      showMessage("✅ Link added to index!", "success");
      urlInput.value = ""; // clear input box
      await fetchUrls();   // refresh list
    } else {
      showMessage("❌ Failed to add link.", "error");
    }
  } catch (err) {
    console.error("Submission error:", err);
    showMessage("❌ Error submitting link.", "error");
  }
}

// ===== RANDOM SITE =====
async function goRandom() {
  if (urls.length === 0) {
    showMessage("⚠️ No URLs available yet.", "error");
    return;
  }
  const randomUrl = urls[Math.floor(Math.random() * urls.length)];
  window.location.href = randomUrl; // open in same tab
}

// ===== FETCH ALL URLS =====
let urls = [];

async function fetchUrls() {
  try {
    const response = await fetch(SCRIPT_URL);
    urls = await response.json();
    console.log("Fetched URLs:", urls);
  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("⚠️ Could not load URLs.", "error");
  }
}

// ===== MESSAGES =====
function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = type === "success" ? "show" : "show error";
  setTimeout(() => { msg.className = "hidden"; }, 2500);
}

// ===== EVENT LISTENERS =====
document.getElementById("randomBtn").addEventListener("click", goRandom);
document.getElementById("submitBtn").addEventListener("click", submitURL);

// ===== INITIALIZE =====
fetchUrls();

