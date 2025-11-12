import { getLowStock, getOutOfStock } from "./apiInventory";
import { toast } from "sonner";

const STORAGE_KEY = "script_stock_alerts_v1";
let monitorInterval = null;
let isRunning = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { alerted: {} };
  } catch (e) {
    return { alerted: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

async function runCheck() {
  try {
    const state = loadState();
    const alerted = state.alerted || {};

    const [low, out] = await Promise.all([getLowStock(), getOutOfStock()]);

    const lowIds = new Set((low || []).map((i) => i.id || i._id));
    const outIds = new Set((out || []).map((i) => i.id || i._id));

    // notify new low stock
    (low || []).forEach((item) => {
      const id = item.id || item._id;
      if (!alerted[id]) {
        toast.warning(
          `Low stock: ${item.name} (${item.quantity ?? item.qty ?? "N/A"})`,
          { timeout: 10000 },
        );
        alerted[id] = { low: true, out: false, lastNotified: Date.now() };
      }
    });

    // notify new out of stock
    (out || []).forEach((item) => {
      const id = item.id || item._id;
      if (!alerted[id] || !alerted[id].out) {
        toast.error(`Out of stock: ${item.name}`);
        alerted[id] = { low: false, out: true, lastNotified: Date.now() };
      }
    });

    // clear alerts for items no longer low/out
    Object.keys(alerted).forEach((id) => {
      if (!lowIds.has(id) && !outIds.has(id)) {
        delete alerted[id];
      }
    });

    saveState({ alerted });
  } catch (error) {
    // Don't log or retry on rate limit errors - just skip this check
    if (error?.message?.includes("429") || error?.message?.includes("Too many requests")) {
      console.debug("Stock monitor skipped due to rate limit");
      return;
    }
    console.warn(`Stock monitor check failed: ${error?.message || error}`);
  }
}

export function startStockMonitor({ intervalMs = 1000 * 60 * 60 * 12, skipInitialRun = false } = {}) {
  if (isRunning) return;
  isRunning = true;
  
  // Don't run immediately if skipInitialRun is true (to avoid rate limits on page load)
  if (!skipInitialRun) {
    // Delay initial run by 2 seconds to avoid rate limits
    setTimeout(() => {
      runCheck();
    }, 2000);
  }
  
  monitorInterval = setInterval(() => {
    runCheck();
  }, intervalMs);
}

export function stopStockMonitor() {
  if (!isRunning) return;
  isRunning = false;
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }
}

export function isMonitoring() {
  return isRunning;
}
