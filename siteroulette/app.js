// Replace with your Apps Script web app URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwl73pAvmU4RFwxdBASLhPOXcqqFssbgdIxrSGrMQPJSqjLpmbLaa99RhDJ_U-Ow5wf/exec";

// Cached URLs
let urlPool = [];

// Fetch dynamic list from Google Sheets
async function fetchUrls() {
  try {
    const res = await fetch(SCRIPT_URL + "?action=get");
    const data = await res.json();
    urlPool = data.urls || [];
  } catch (err) {
    console.error("Error fetching URLs:", err);
  }
}

// Redirect to random URL
function goRandom() {
  if (urlPool.length === 0) {
    showMessage("No URLs available yet.", "error");
    return;
  }
  const randomUrl = urlPool[Math.floor(Math.random() * urlPool.length)];
  window.location.href = randomUrl;
}

// Submit new URL
async function submitUrl() {
  const input = document.getElementById("urlInput");
  let newUrl = input.value.trim();

  if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
    showMessage("Please enter a valid URL starting with http(s).", "error");
    return;
  }

  try {
    // Simple "is alive" check
    const check = await fetch(newUrl, { method: "HEAD", mode: "no-cors" });
    // (No guarantee, but will usually pass if not totally dead)
  } catch {
    showMessage("That site seems unreachable.", "error");
    return;
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", url: newUrl })
    });
    const result = await res.json();

    if (result.status === "success") {
      showMessage("✅ Link added to index!", "success");
      input.value = "";
      await fetchUrls(); // refresh list
    } else if (result.status === "duplicate") {
      showMessage("⚠️ That link is already in the index.", "error");
    } else {
      showMessage("❌ Failed to add link.", "error");
    }
  } catch (err) {
    console.error("Submission error:", err);
    showMessage("❌ Error submitting link.", "error");
  }
}

// Show temporary message
function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = type === "success" ? "show" : "show error";
  setTimeout(() => { msg.className = "hidden"; }, 2500);
}

// Event listeners
document.getElementById("randomBtn").addEventListener("click", goRandom);
document.getElementById("submitBtn").addEventListener("click", submitUrl);

// Initial fetch
fetchUrls();
