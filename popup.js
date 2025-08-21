let enabled = false; // state variable
const toggleSwitch = document.getElementById("toggleSwitch");
const toggleLabel = document.getElementById("toggleLabel");

// Load saved state when popup opens
chrome.storage.sync.get("enabled", (data) => {
  enabled = data.enabled ?? false;
  toggleSwitch.checked = enabled;
  updateLabel();
});

// Handle toggle change
toggleSwitch.addEventListener("change", () => {
  enabled = toggleSwitch.checked;
  chrome.storage.sync.set({ enabled }); // persist
  updateLabel();
});

// Update label text
function updateLabel() {
  toggleLabel.textContent = enabled ? "Enabled" : "Disabled";
  toggleLabel.style.color = enabled ? "#4CAF50" : "#999";
}