/**
 * Simple event bus for cross-component communication.
 * Used to synchronize state changes across pages (e.g., when a sale is added).
 */

const listeners = {};

/**
 * Subscribe to an event
 * @param {string} event - Event name (e.g., 'sale-added', 'inventory-updated')
 * @param {Function} callback - Function to call when event is emitted
 * @returns {Function} Unsubscribe function
 */
export function on(event, callback) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);

  // Return unsubscribe function
  return () => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter((cb) => cb !== callback);
    }
  };
}

/**
 * Emit an event
 * @param {string} event - Event name
 * @param {*} data - Data to pass to listeners
 */
export function emit(event, data) {
  if (!listeners[event]) return;
  listeners[event].forEach((callback) => {
    try {
      callback(data);
    } catch (e) {
      console.error(`Error in event listener for ${event}:`, e);
    }
  });
}

/**
 * Remove all listeners for an event (or all events if no event specified)
 * @param {string} [event] - Event name, or undefined to clear all
 */
export function clearListeners(event) {
  if (event) {
    delete listeners[event];
  } else {
    Object.keys(listeners).forEach((key) => delete listeners[key]);
  }
}
