// Get reference to rows container
const rows = document.getElementById("rows");

// Load saved state from localStorage, or create empty state
let state = JSON.parse(localStorage.getItem("habitTrackerState")) || { habits: [] };

// Get today's date as "YYYY-MM-DD"
function todayKey() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Get array of last 7 dates for the week view
function getWeekKeys() {
  const keys = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(d);
    date.setDate(date.getDate() - i);
    keys.push(date.toISOString().split("T")[0]);
  }
  return keys;
}

const weekKeys = getWeekKeys();

// Create new habit object
function newHabit(name) {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: name,
    log: {}
  };
}

// Save state to localStorage
function saveState(stateObj) {
  localStorage.setItem("habitTrackerState", JSON.stringify(stateObj));
}

// Calculate how many days in a row habit was completed
function computeStreak(habit) {
  let count = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split("T")[0];
    if (habit.log[key]) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

// =====================================================================
// === 1. RENDER UI: Dynamic DOM Generation (State Reconciliation) ===
// This function completely rebuilds the habit tracker table in the browser
// It is called every time the data changes (add, toggle, delete, import, etc.)
// It uses the current 'state' object to generate fresh HTML: no templates!
// =====================================================================
// render(): The master function that draws the entire UI from scratch
function render() {
  // Clear previous HTML
  rows.innerHTML = "";

  // Show "No habits yet" message if empty
  if (state.habits.length === 0) {
    // Create placeholder row
    const row = document.createElement("div");
    row.setAttribute("style", "display:grid;grid-template-columns:1.6fr repeat(7,.9fr) .8fr 1fr;align-items:center;border-bottom:1px solid #eef2f6;");
    
    // Add habit name column
    const nameCol = document.createElement("div");
    nameCol.setAttribute("style", "padding:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;");
    nameCol.textContent = "No habits yet";
    row.appendChild(nameCol);
    
    // Add empty day columns for alignment
    weekKeys.forEach(() => {
      const col = document.createElement("div");
      col.setAttribute("style", "padding:10px;text-align:center;");
      row.appendChild(col);
    });
    
    // Add streak column (0 for empty state)
    const streakCol = document.createElement("div");
    streakCol.setAttribute("style", "padding:10px;font-variant-numeric:tabular-nums;");
    streakCol.textContent = "0";
    row.appendChild(streakCol);
    
    // Add actions column
    const actionsCol = document.createElement("div");
    actionsCol.setAttribute("style", "padding:10px;color:#66788a;");
    actionsCol.textContent = "Add a habit";
    row.appendChild(actionsCol);
    
    // Show placeholder and exit
    rows.appendChild(row);
    return;
  }

  // Loop through each habit and create a row
  state.habits.forEach(h => {
    // Create habit row
    const row = document.createElement("div");
    row.setAttribute("style", "display:grid;grid-template-columns:1.6fr repeat(7,.9fr) .8fr 1fr;align-items:center;border-bottom:1px solid #eef2f6;");

    // Add habit name
    const nameCol = document.createElement("div");
    nameCol.setAttribute("style", "padding:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;");
    nameCol.textContent = h.name;
    row.appendChild(nameCol);

    // Add day columns (7 days for the week)
    weekKeys.forEach(k => {
      const col = document.createElement("div");
      col.setAttribute("style", "padding:10px;text-align:center;");

      // Create clickable button for each day
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `${h.name} on ${k}`);
      btn.setAttribute("role", "checkbox");

      // Check if this day is marked complete
      const checked = !!h.log[k];
      btn.setAttribute("aria-checked", String(checked));
      btn.textContent = checked ? "Yes" : "";

      // Store habit ID and date for the click handler
      btn.dataset.habitId = h.id;
      btn.dataset.dateKey = k;

      // Style button green if completed
      btn.setAttribute(
        "style",
        "display:flex;align-items:center;justify-content:center;width:36px;height:36px;margin:auto;border-radius:8px;border:1px solid #dbe7f0;cursor:pointer;user-select:none;background:"+(checked?"#e9f8ef":"#fff")+";color:"+(checked?"#1e9e4a":"inherit")+";font-weight:"+(checked?"700":"400")+";"
      );

      // Click to toggle day
      btn.addEventListener("click", onToggleDay);

      // Space/Enter keys also toggle
      btn.addEventListener("keydown", e => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          btn.click();
        }
      });

      col.appendChild(btn);
      row.appendChild(col);
    });

    // Streak counter
    const streakCol = document.createElement("div");
    streakCol.setAttribute("style", "padding:10px;font-variant-numeric:tabular-nums;");
    streakCol.textContent = String(computeStreak(h));
    row.appendChild(streakCol);

    // Action buttons
    const actions = document.createElement("div");
    actions.setAttribute("style", "padding:10px;display:flex;gap:8px;flex-wrap:wrap;");

    // Tick today button
    const tick = document.createElement("button");
    tick.type = "button";
    tick.textContent = "Tick today";
    tick.setAttribute("style", "background:#fff;border:1px solid #dbe7f0;color:#0b3b58;padding:6px 10px;border-radius:8px;cursor:pointer;");
    tick.addEventListener("click", () => toggleLog(h.id, todayKey()));
    actions.appendChild(tick);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.style.cssText = "padding:6px 12px;border:none;background:#fee;color:#c00;border-radius:4px;cursor:pointer;font-weight:700;";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete "${h.name}"?`)) {
        state.habits = state.habits.filter(x => x.id !== h.id);
        saveState(state);
        render();
      }
    });
    actions.appendChild(deleteBtn);
    
    row.appendChild(actions);
    rows.appendChild(row);
  });
}


// =====================================================================
// EVENT HANDLING & STATE MUTATION
// =====================================================================

// Toggle a habit's log for a specific date
function onToggleDay(e) {
  const btn = e.currentTarget;
  const habitId = btn.dataset.habitId;
  const dateKey = btn.dataset.dateKey;
  toggleLog(habitId, dateKey);
}

// Add or remove a date from habit log
function toggleLog(habitId, dateKey) {
  const habit = state.habits.find(h => h.id === habitId);
  if (habit) {
    habit.log[dateKey] = !habit.log[dateKey];
    saveState(state);
    render();
  }
}

// Add new habit via form
// =====================================================================
document.getElementById("habit-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("habit-name");
  const name = input.value.trim();
  if (!name) return;
  
  state.habits.push(newHabit(name));
  saveState(state);
  input.value = "";
  render();
});

// Data management
// =====================================================================

// Export habits as JSON file
document.getElementById("export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "habits-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import habits from JSON file
document.getElementById("import-json").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data.habits)) throw new Error("Invalid format");
    
    state = data;
    saveState(state);
    render();
    alert("Import complete. Data loaded.");
  } catch (err) {
    alert("Import failed. Please check the JSON file format.");
  }
  e.target.value = "";
});

// Reset all data
document.getElementById("reset-all").addEventListener("click", () => {
  if (!confirm("Delete all habits and logs?")) return;
  
  state = { habits: [] };
  saveState(state);
  render();
  alert("All data reset.");
});

// Start the app on page load
render();