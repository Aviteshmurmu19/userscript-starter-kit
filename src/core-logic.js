// This placeholder will be replaced by the minified content of ui.html
// Using backticks `` allows the injected string to span multiple lines.
const uiHTML = `{{UI_HTML}}`;

function injectPopup() {
  // 1. Create a new DOMParser instance
  const parser = new DOMParser();

  // 2. Parse the HTML string into a new, temporary document
  const parsedDoc = parser.parseFromString(uiHTML, 'text/html');

  // 3. Get the main element from the parsed document's body
  // We expect our ui.html to have a single root element, the container div.
  const popupElement = parsedDoc.body.firstChild;

  // 4. Check if the element was parsed correctly
  if (popupElement) {
    // 5. Find the close button *within our new element*
    const closeButton = popupElement.querySelector('#demo-popup-close-btn');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        popupElement.remove();
      });
    }

    // 6. Append the fully functional element to the actual page's body
    document.body.appendChild(popupElement);
  }
}

// Run the function to create and show the popup
injectPopup();

console.log('Demo script loaded and popup injected using DOMParser!');