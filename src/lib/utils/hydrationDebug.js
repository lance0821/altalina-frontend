/**
 * Utility functions for debugging hydration mismatches.
 * This helps visualize the differences between server and client rendered content.
 */

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

/**
 * Creates a visual diff of two HTML strings
 */
export function visualDiff(str1, str2) {
  if (!isBrowser) {
    return { html: 'Visual diff only works in browser' };
  }
  
  const diff = [];
  const tokens1 = tokenizeHTML(str1);
  const tokens2 = tokenizeHTML(str2);
  
  const maxLen = Math.max(tokens1.length, tokens2.length);
  
  for (let i = 0; i < maxLen; i++) {
    const t1 = tokens1[i] || '';
    const t2 = tokens2[i] || '';
    
    if (t1 === t2) {
      diff.push(`<span style="color:#999;">${escapeHTML(t1)}</span>`);
    } else {
      diff.push(`<span style="color:red;background:#ffdddd;text-decoration:line-through;">${escapeHTML(t1)}</span>`);
      diff.push(`<span style="color:green;background:#ddffdd;">${escapeHTML(t2)}</span>`);
    }
  }
  
  return { html: diff.join('') };
}

/**
 * Simple HTML tokenizer that breaks HTML into chunks for comparison
 */
function tokenizeHTML(html) {
  if (!html) return [];
  
  // Split by tags, attributes and text content
  const tokens = [];
  let inTag = false;
  let currentToken = '';
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    
    if (char === '<') {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
      inTag = true;
      currentToken += char;
    } else if (char === '>') {
      currentToken += char;
      tokens.push(currentToken);
      currentToken = '';
      inTag = false;
    } else if (inTag && (char === ' ' || char === '"' || char === "'")) {
      // Split attributes for better diffing
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }
      currentToken += char;
    } else {
      currentToken += char;
    }
  }
  
  if (currentToken) {
    tokens.push(currentToken);
  }
  
  return tokens;
}

/**
 * Escape HTML for safe display
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Captures the HTML of an element for comparison
 */
export function captureElementHTML(selector) {
  if (!isBrowser) return '';
  
  const element = document.querySelector(selector);
  return element ? element.outerHTML : '';
}

/**
 * Shows hydration debug information in the UI
 */
export function showHydrationDebug(serverHTML, clientHTML) {
  if (!isBrowser) return;
  
  // Create a debug panel if it doesn't exist
  let debugPanel = document.getElementById('hydration-debug-panel');
  
  if (!debugPanel) {
    debugPanel = document.createElement('div');
    debugPanel.id = 'hydration-debug-panel';
    debugPanel.style = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 80%;
      max-width: 800px;
      max-height: 400px;
      overflow: auto;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #333;
      border: none;
      color: white;
      padding: 3px 8px;
      border-radius: 3px;
      cursor: pointer;
    `;
    closeButton.onclick = () => {
      debugPanel.style.display = 'none';
    };
    
    debugPanel.appendChild(closeButton);
    document.body.appendChild(debugPanel);
  }
  
  // Update content
  debugPanel.innerHTML += `
    <h3>Hydration Mismatch Detected</h3>
    <div>
      <h4>Diff:</h4>
      <div style="background:#111; padding:10px; border-radius:3px;">${visualDiff(serverHTML, clientHTML).html}</div>
      
      <h4>Server HTML:</h4>
      <pre style="max-height:100px; overflow:auto;">${escapeHTML(serverHTML)}</pre>
      
      <h4>Client HTML:</h4>
      <pre style="max-height:100px; overflow:auto;">${escapeHTML(clientHTML)}</pre>
    </div>
  `;
  
  debugPanel.style.display = 'block';
} 