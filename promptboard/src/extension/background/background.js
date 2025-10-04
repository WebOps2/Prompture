// window.addEventListener('message', (event) => {
//               if (event.source === window && event.data.type === 'MY_APP_DATA') {
//                 chrome.runtime.sendMessage({ type: 'EXTENSION_DATA', payload: event.data.payload });
//               }
//             });

// Optionally send to background or store it
    // chrome.runtime.sendMessage({
    //   type: "STORE_PROMPT",
    //   payload: event.data.payload
    // });