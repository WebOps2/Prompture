// console.log("[PromptBoard] 🧠 Content script loaded on", window.location.hostname);
// const { data: { session } } = await supabase.auth.getSession();
// const token = session?.access_token;

console.log("[PromptBoard] ✅ Content script loaded on:", window.location.href);

const selectors = {
  "https://chatgpt.com/*": '[contenteditable="true"]', // ChatGPT
  "claude.ai": '[contenteditable="true"]',                      // Claude
  "chat.deepseek.com": "textarea",
   "gemini.google.com": "textarea",
   "www.perplexity.ai": '[contenteditable="true"]'                        // Poe
};

// Check if user is authorized and notify the web app
chrome.storage.local.get("authData", async (result) => {
  console.log("[Extension] 🔍 Checking auth data in storage...", result);
  if (result.authData && result.authData.userId) {
    const userId = result.authData.userId;
    console.log("[Extension] 🔐 User ID found:", userId);
    try {
      const response = await fetch(
        "https://lzswifnoadbeubxwoery.supabase.co/functions/v1/profile_api",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      console.log("[Extension] ✅ Sync status updated:", data);
    } catch (err) {
      console.error("[Extension] ❌ Failed to update sync status:", err);
    }
  }
});



window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !event.data?.type ||
    event.data?.source !== "promptboard-app"
  ) return;

  if (event.data.type === "AUTH_DATA") {
    const { token, userId } = event.data.payload;
    console.log("[ContentScript] 🔐 Received token + userId:", userId);

    chrome.storage.local.set({ authData: { token, userId } }, () => {
    console.log("[Extension] ✅ Auth data cached in storage");
  });

    // // Forward to background (optional)
    // chrome.runtime?.sendMessage({
    //   type: "RECEIVE_AUTH",
    //   payload: { token, userId }
    // });
  }

  if (event.data.type === "PROMPT_SUBMIT") {
    console.log("Prompt received:", event.data.payload.prompt);
    // you can also include user info here if needed
  }
});
console.log("[ChatGPT Detector] ✅ Content script loaded on", window.location.href);

// // Only run this on ChatGPT
if (!window.location.hostname.includes("prompt-board")) {
  chrome.storage.local.get("authData", (result) => {
    if (result.authData) {
      const { token, userId } = result.authData;
      console.log("[Detector] 🔐 Token:", token);
      console.log("[Detector] 🆔 User ID:", userId);
    } else {
      console.warn("[Detector] ⚠️ No auth data found in storage.");
    }
  });
}

let latestPrompt = "";
const site = window.location.hostname;
const selector = selectors[site] || selectors["https://chatgpt.com/*"];
const timestamp = new Date().toISOString();


// 👇 This tracks user input into ChatGPT's editable div
document.addEventListener("input", () => {
  const active = document.activeElement;
  if (active && active.matches(selector)) {
    latestPrompt = active.value || active.innerText.trim();
    console.log("[PromptBoard] 📝 Latest prompt captured:", latestPrompt);
  }
  else {
    console.log("[PromptBoard] ⚠️ No active input field matches selector:", selector);
  }
}, true);


// 👇 This captures Enter key to trigger prompt send  
document.addEventListener("keydown", (event) => {
  const active = document.activeElement;

  // const isChatGPTInput =
  //   active &&
  //   active.tagName === "DIV" &&
  //   active.getAttribute("contenteditable") === "true";
  console.log("Host:", window.location.hostname);
  console.log("Active element:", active);
  console.log("Active element matches selector:", active.matches(selector));

  if (active && active.matches(selector) && event.key === "Enter" && !event.shiftKey) {
    if (latestPrompt) {
      console.log("[PromptBoard] ✅ User entered");
      console.log("[PromptBoard] 📝 Prompt captured:", latestPrompt);
      try{
        sendPrompt(latestPrompt);
      } catch (err) {
        console.warn("[PromptBoard] ⚠️ sendPrompt failed:", err.message);
      }
      // sendPrompt(latestPrompt); // <-- SEND the prompt
    } else {
      console.log("[PromptBoard] ⚠️ Prompt was empty");
    }
    latestPrompt = ""; // Reset for next entry
  }
});

const observer = new MutationObserver(() => {
  if (document.querySelector(selector)) {
    console.log("[PromptBoard] ✅ Found input field for", site);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// ✅ Define sendPrompt locally since we can't import in content_scripts
async function sendPrompt(prompt) {
  const getAuthData = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get("authData", (result) => {
        resolve(result.authData);
      });
    });
  };

  const authData = await getAuthData();

  if (!authData) {
    console.warn("[PromptBoard] ⚠️ No auth data found. Skipping prompt save.");
    return;
  }

  const { userId } = authData;
  const site = window.location.hostname;
  const timestamp = new Date().toISOString();
  const now = new Date();
  const day = now.toLocaleString("en-US", { weekday: "long" });
  console.log("Day of the week:", day);


  try {
    const response = await fetch("https://lzswifnoadbeubxwoery.supabase.co/functions/v1/dynamic-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        userId,   // ✅ now sent properly
        site,
        timestamp,
        day
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[PromptBoard] ❌ Error saving prompt:", data);
    } else {
      console.log("[PromptBoard] ✅ Prompt sent to Supabase:", data);
    }
  } catch (err) {
    console.error("[PromptBoard] ❌ Network error:", err);
  }
}





