# ✅ ToDo Mobile App (React Native + Expo)

A clean, interview-ready **mobile ToDo application** built with **React Native (Expo)**.  
This project focuses on core task management functionality, local persistence, and a polished user experience with a simple and maintainable codebase.

---

## 📌 Overview

This app was built as a fast, practical mobile project for interview/demo purposes.  
Instead of overengineering, the focus was on delivering a **stable MVP+** with features users actually expect in a todo app:

- Add tasks
- Edit tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Filter tasks (All / Active / Done)
- Clear completed tasks
- Persist data locally using AsyncStorage (survives app restart)

The result is a lightweight, responsive, and functional app that demonstrates:

- React Native fundamentals
- State management with hooks (`useState`, `useEffect`, `useMemo`)
- Mobile UI/UX thinking
- Local storage integration
- Clean component logic and feature iteration

---

## 🖼️ App Screenshots

> Place the screenshots (`1.jpeg`, `2.jpeg`, `3.jpeg`, `4.jpeg`) in the **root of the repository** (same level as `README.md`) for these image links to work.

### 1) Home / Empty or Initial State
![Todo App Screenshot 1](./1.jpeg)

### 2) Adding and Viewing Tasks
![Todo App Screenshot 2](./2.jpeg)

### 3) Completed Tasks / Filters
![Todo App Screenshot 3](./3.jpeg)

### 4) Edit Task Flow
![Todo App Screenshot 4](./4.jpeg)

---

## ✨ Features

### Core Features
- **Add Task**
  - Users can add a new task from the input field.
  - Empty input is safely ignored (trim validation).

- **Toggle Task Completion**
  - Tap a task (or checkbox) to mark it complete/incomplete.
  - Completed tasks are visually styled with:
    - checkmark
    - filled checkbox
    - strikethrough text

- **Delete Task**
  - Users can delete a task.
  - Includes a confirmation alert before deletion.

### Productivity Features
- **Edit Task**
  - Users can edit an existing task.
  - App supports:
    - entering edit mode
    - updating task text
    - canceling edit mode
  - UI changes dynamically (`Add` → `Update`)

- **Task Filters**
  - Filter views:
    - **ALL**
    - **ACTIVE**
    - **DONE**

- **Clear Completed**
  - One-tap cleanup to remove all completed tasks.

### Persistence
- **Local Storage with AsyncStorage**
  - Tasks are automatically saved locally.
  - Data remains available after:
    - app restart
    - reload in Expo Go

---

## 🧠 Technical Highlights (Interview Talking Points)

This project intentionally uses a **clean and practical architecture** for speed, readability, and reliability.

### 1) React Hooks-based State Management
The app uses React hooks only (no Redux required for this scope):

- `useState` → local UI and task state
- `useEffect` → load/save tasks from storage
- `useMemo` → derive filtered tasks and stats efficiently

Why this matters:
- Less boilerplate
- Faster development
- Easy to reason about in an interview setting

---

### 2) Local Persistence (AsyncStorage)
Tasks are stored using:

- `@react-native-async-storage/async-storage`

This demonstrates:
- Native-compatible persistence in React Native
- Async side effects
- Simple data serialization/deserialization (`JSON.stringify` / `JSON.parse`)

---

### 3) Defensive UX / Edge Cases Handled
The app includes practical safeguards:

- Prevent adding empty tasks
- Confirm before delete
- Cancel edit mode safely
- Disable **Clear Completed** when there’s nothing to clear
- Keep edited state consistent if item is deleted/cleared

---

### 4) Mobile-first UI Design
The UI is intentionally simple but polished:

- `SafeAreaView` for mobile layout safety
- `KeyboardAvoidingView` for better typing experience
- Large touch targets for mobile usability
- Clear visual states (active/done/editing)
- Consistent spacing and typography

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **JavaScript (ES6+)**
- **AsyncStorage** for local persistence

---

## 📂 Project Structure (Current)

This is currently a streamlined interview-focused setup.

```text
ToDo/
├── App.js                 # Main application logic + UI
├── package.json
├── package-lock.json
├── app.json
├── babel.config.js
├── assets/                # Expo assets (default)
├── 1.jpeg                  # Screenshot 1 (README)
├── 2.jpeg                  # Screenshot 2 (README)
├── 3.jpeg                  # Screenshot 3 (README)
├── 4.jpeg                  # Screenshot 4 (README)
└── README.md