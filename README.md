# Reactive PNL & Risk Analysis Dashboard

![Status](https://img.shields.io/badge/Status-Stable_v1.0-success)
![Language](https://img.shields.io/badge/Language-JavaScript_(ES6+)-yellow)
![Platform](https://img.shields.io/badge/Platform-Web_|_Mobile-blue)

## Interface Preview
*Status: Responsive UI & Logic Fully Implemented*

| Control Panel | Smart Leverage |
|:---:|:---:|
| <img src="image/example.png" alt="Input Logic" width="250"/> | <img src="image/levex.png" alt="Leverage Selector" width="250"/> |

> *Live Demo: [Click here to view the Tool]([https:/github.com/melihlevent-aslan/reactive-web-app](https://melihlevent-aslan.github.io/reactive-web-app/))* 

## Project Overview
This project is a lightweight, high-performance web application designed for **real-time financial risk assessment**. It simulates the order management systems of professional digital asset exchanges, allowing users to calculate Profit/Loss (PNL), Return on Investment (ROI), and Break-Even thresholds with precision.

Unlike standard calculators, this tool integrates **fee logic (Maker/Taker)** and **leverage impact** directly into the calculation kernel, offering a realistic simulation of net outcomes.

## Motivation
In high-frequency or leveraged environments, "hidden" costs like exchange fees significantly impact profitability. This project was developed to:
1.  **Automate Risk Management:** Instantly visualize the "Break-Even Price" to prevent net-loss trades that appear profitable on the surface.
2.  **Enhance User Workflow:** Replace manual spreadsheet calculations with a reactive, specific-purpose UI.
3.  **Demonstrate UI/UX Patterns:** Implement modern "Dark Mode" aesthetics and responsive input handling typical of fintech applications.

## Methodology & Features
The application is built on a **Zero-Dependency** architecture (Vanilla JS) for maximum speed and compatibility.

1.  **Dynamic DOM Manipulation:**
    * Real-time event listeners handle input changes instantly without page reloads.
    * State management switches seamlessy between "Long" and "Short" logic, inverting mathematical formulas and visual cues (Green/Red) dynamically.

2.  **Bidirectional Input Synchronization:**
    * *Algorithm:* A "Smart Sync" feature links the `Target Move %` and `Exit Price` fields.
    * *Behavior:* Typing a percentage auto-calculates the price; typing a price reverse-engineers the percentage. This requires robust input handling to prevent recursive loops.

3.  **Fee Structure Logic:**
    * Implements `Position Size = Margin × Leverage`.
    * Calculates fees based on total position size (not just margin), reflecting real-world exchange mechanics.

## Tech Stack
* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** CSS Grid & Flexbox (Responsive Design)
* **Theme:** "Pro-Exchange" Dark Mode (High contrast accessibility)
* **Deployment:** GitHub Pages

## Roadmap & Progress
* [x] **Core Architecture:** Implement PNL, ROI, and Fee calculation algorithms.
* [x] **UI/UX:** Develop responsive Dark Mode interface.
* [x] **Logic:** Implement "Break-Even" price derivation.
* [x] **Feature:** Add Bidirectional Sync (Price <-> Percentage).
* [ ] **Future:** Integrate live price API (e.g., Binance WebSocket) to auto-fill Entry Price.

---
*Melih Levent Aslan | M.Sc. Geodetic Engineering Student, University of Bonn*
