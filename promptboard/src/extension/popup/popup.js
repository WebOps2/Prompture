document.getElementById("open-dashboard").addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://prompt-board-rouge.vercel.app/panel/dashboard" // Replace with your actual site URL
  });
});
