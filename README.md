# React + Vite

rugby-gym-app/
│
├── public/
│ └── index.html # Main HTML template
│
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ ├── medals/ # gold.png, silver.png, bronze.png
│ │ │ ├── icons/ # buttons, avatars, logos
│ │ │ └── backgrounds/ # UI backgrounds
│ │ └── styles/
│ │ ├── main.css # Global styles
│ │ ├── dark-mode.css # Dark mode overrides
│ │ ├── animations.css
│ │ └── responsive.css
│ │
│ ├── components/ # Reusable React components
│ │ ├── Navbar.jsx
│ │ ├── Navbar.css
│ │ ├── Footer.jsx
│ │ ├── ProgressBar.jsx
│ │ ├── LeaderboardCard.jsx
│ │ └── WorkoutCard.jsx
│ │
│ ├── pages/ # Page components for routes
│ │ ├── Dashboard.jsx
│ │ ├── Login.jsx
│ │ ├── Login.css
│ │ ├── Workout.jsx
│ │ ├── Progress.jsx
│ │ ├── Leaderboard.jsx
│ │ └── AdminPanel.jsx
│ │
│ ├── context/ # Optional: React context for global state
│ │ └── AppContext.jsx
│ │
│ ├── hooks/ # Custom React hooks (optional)
│ │ └── useWorkout.js
│ │
│ ├── utils/ # Utility functions
│ │ ├── storage.js # LocalStorage or Firebase helper
│ │ └── charts.js # Chart.js or canvas setup
│ │
│ ├── App.jsx # Main App component (routes & layout)
│ ├── main.jsx # Entry point, renders <App /> into root
│ └── index.css # Vite default global CSS
│
├── package.json
├── vite.config.js
└── README.md
# Rugby
