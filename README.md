# habit-tracker

A single page app that lets you add habits, tick today, shows the last seven days and a live streak count. Data is stored locally in the browser using localStorage.

---

## Key Features

- Add habits, select days
- View the last 7 days
- Live streak count
- All data stored in browser using 'localStorage'
- No server required 

---

## Live Demo

**Live Site:**  
https://turtleicetea.github.io/habit-tracker/

**Repository:**  
https://github.com/turtleicetea/habit-tracker

---

# Installation & Running the App Locally

You can run the app directly by opening 'index.html'.

---

## **Windows Installation**

1. Open Command Prompt or PowerShell.  
2. Clone the repository:
   ```bash
   git clone https://github.com/turtleicetea/habit-tracker.git
3. Open the project folder:
   cd habit-tracker
4. Run the app by double-clicking index.html.
   It will open in your default browser.

## **macOS Installation**
1. Open Terminal.
2. Clone the repository:
   ```bash
   git clone https://github.com/turtleicetea/habit-tracker.git
3. Navigate into the project folder:
   cd habit-tracker
4. In Finder, double-click index.html.
   It will open in your default browser.

---

## Architecture Overview

### **index.html**
Defines the content, headers, form, and the empty container (#rows) that JavaScript will fill with habit data:
- The <head> includes meta tags for character encoding and viewport, the title, CSS link, and inline styles for button hover and screen reader elements.
- The <body> contains the main content with header, tip section, add habit form, tracker grid, data management section, and footer.
- The script tag loads app.js deferred.

### **styles.css**
- Defines color variables in :root for easy theming.
- Sets box-sizing to border-box for all elements, ensures full height for html and body, removes default margin from body, sets font family, background, color, and line-height.
- Focus styles add accessibility outlines.

### **app.js**
Core logic. It manages dates, stores data in localStorage, handles user events (toggles, adding habits), calculates streaks, and dynamically renders the entire UI:
- Full state reconciliation: render() rebuilds entire UI from state
- Zero dependencies: Pure HTML/CSS/JS — no frameworks
- Persistent storage: localStorage with JSON serialization
- Real-time updates: Every interaction instantly updates UI
- Accessibility first: ARIA labels, roles, keyboard support
- Responsive grid: CSS Grid with dynamic columns
- Streak calculation: Consecutive day tracking
- Data import/export: Full backup/restore capability
- Defensive programming: Null checks, error handling, validation
- Modular design: Clear separation of UI, state, and logic
- Performance optimized: Minimal DOM updates, efficient filtering
- Production ready: Robust, maintainable, scalable

### **Known Limitations**
- Data is stored locally in a single browser
- History limited to seven days

---

## Self-Assessment

A. Core Functionality 10/10	
B. Code Quality & Architecture 5/5	
C. UX & Accessibility 5/5	
D. Data Handling & Persistence 4/4	
E. Documentation 2/3	
F. Deployment 3/3	
G. Demo Video & Documentation 5/5	

---

## Learning Reflection

The habit tracker project let me apply my learned skills in frontend development to create something meaningful like a fully functioning app. Handling larger amounts of code made me consider the importance of structuring the code in order to make it readable, understandable and editable.

I encountered some issues with repositories and merging local anda remote data, and solving these issues helped me learn more about Git and understand branches, remotes and commits better.

This was also the first time I deployed a project using GitHub Pages.

As a next step to improve the app, I could look into displaying longer history views.

---

## Demo Video

Demo video is attached in the Canvas return box.

**Timestamps**
00:00 – Intro  
00:22 - Project overview  
01:38 – Demo: Adding habits  
01:57 – Demo: Toggling days + streaks  
02:37 – Demo: Export / import / reset  
03:03 – Conclusion

