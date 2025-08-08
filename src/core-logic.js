// This placeholder will be replaced by the minified content of ui.html during the build.
// Using backticks `` allows the injected HTML string to be processed correctly.
const uiHTML = `{{UI_HTML}}`;

/**
 * Injects and initializes the popup UI.
 */
function injectPopup() {
  // Use the browser's native DOMParser to safely convert the HTML string into DOM nodes.
  // This avoids "unsafe-inline" and Trusted Types security errors on modern websites.
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(uiHTML, "text/html");

  // Get the main element from the parsed document.
  const popupElement = parsedDoc.body.firstChild;

  // Ensure the element was created before trying to add logic to it.
  if (popupElement) {
    // Find the close button within our newly created element.
    const closeButton = popupElement.querySelector("#demo-popup-close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        popupElement.remove();
      });
    }

    // Append the fully functional element to the page.
    document.body.appendChild(popupElement);
  }
}

// Run the main function.
injectPopup();

console.log("Demo script loaded and popup injected using DOMParser!");
