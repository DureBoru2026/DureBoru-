# Dure Boru - Platform Installation Guide & Project Report

Welcome to the **Dure Boru** platform's official developer documentation. This document is divided into two primary sections: the **Developer Installation Guide** (local setup & deployment recommendations) and the **Strategic Project Report** (architectural details, product reviews, and secure P2P payment flow).

---

## SECTION 1: Developer Installation Guide

This guide provides step-by-step instructions for running, testing, and building the Dure Boru platform in a local environment, as well as deployment strategies for Netlify, Vercel, and Cloud environments.

### 1. System Requirements & Prerequisites
Before starting, ensure you have the following installed on your machine:
*   **Node.js**: Version 18.x or above (LTS version highly recommended).
*   **npm**: Version 9.x or above (pre-packaged with Node.js).
*   **Firebase Account**: A configured Google Firebase project with Firestore, Authentication, and Firebase Storage enabled.

### 2. Local Setup & Installation

Follow these steps to run the application locally on your computer:

1.  **Extract / Clone the Project**:
    Navigate to the project root directory containing the `package.json` file.

2.  **Install Dependencies**:
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```
    This will install all required frontend and backend dependencies, including React, Tailwind CSS, Lucide icons, Motion, Express, and Firebase SDKs.

3.  **Environment Variable Setup**:
    Create a file named `.env.local` (or `.env`) in the root of your workspace and declare your credentials:
    ```env
    # Firebase Frontend Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
    VITE_FIREBASE_APP_ID=your_app_id

    # Server Secrets
    GEMINI_API_KEY=your_optional_gemini_api_key_if_used
    ```

4.  **Launch the Development Server**:
    To boot the app, execute:
    ```bash
    npm run dev
    ```
    This fires up the Vite dev environment. Open your browser and navigate to `http://localhost:3000` (or the terminal-provided local port).

5.  **Compile & Production Build**:
    To compile the client-side single-page application (SPA) and produce optimized static files:
    ```bash
    npm run build
    ```
    All optimized, bundled output will be saved in the `/dist` directory.

---

## SECTION 2: Platform Project Report

### 1. Core Mission & Vision
Dure Boru is a modern, high-performance web ecosystem designed to empower Ethiopian agriculture. By blending modern agricultural practices with localized e-commerce, digital course academies, and interactive peer-to-peer social features, the platform connects local farmers, agronomists, and digital learners in a single seamless experience.

### 2. System Architecture
Dure Boru is engineered using a highly performant **React + TypeScript** single-page architecture powered by **Vite** for rapid hot-reloading and lightning-fast compilations.
*   **Styling & UX**: Styled entirely with **Tailwind CSS** following custom Display typography configurations ("Space Grotesk" for displays, "Inter" for UI, and "JetBrains Mono" for system telemetry). Animations are handled natively using **Motion** for smooth state transitions and route entries.
*   **Data Tier**: Utilizes **Google Cloud Firestore** for persistent real-time database services. Features offline cache-fallbacks using standard client-side `localStorage`.
*   **Storage**: Uses **Firebase Storage** to securely host and distribute high-fidelity product images, video courses, and digital assets.
*   **Security & Guardrails**: Standardized security protocols are enforced via compiled **Firestore Rules**, protecting critical namespaces such as `/users`, `/orders`, `/posts`, and `/products/{productId}/reviews`.

### 3. Integrated Peer-to-Peer (P2P) Payment Flows
To overcome standard payment gateway friction in local East-African economies, Dure Boru integrates a secure, user-friendly P2P payment flow supporting **Telebirr** and **CBE Birr**:
*   **Seamless In-app Orders**: Users click "Buy Now" on any product and enter their preferred mobile number and purchase notes.
*   **P2P Verification Form**: The checkout modal displays the official merchant/account details along with step-by-step instructions. Users send the amount directly via their USSD/bank app and then submit their **Mobile Number** and **Transaction ID (TxID)** inside Dure Boru.
*   **State Machine Tracker**: Orders are written directly to Firestore with status `Processing`. The Admin panel parses these records in real-time, displays secure transaction logs, and allows administrators to flag orders as `Shipped` or `Completed` after validating the payment on their official banking dashboard.

### 4. Custom Star-Rating & Reviews Engine
To establish digital trust and build powerful social proof, a custom product reviews engine has been implemented:
*   **Firestore Sub-collection**: Reviews are written to a secure nested collection: `/products/{productId}/reviews/{reviewId}`.
*   **Aesthetic Rating Cards**: Renders full average ratings, visual star breakdowns (5-star down to 1-star percentage bars with animated width expansion), and modular reviewer cards.
*   **Full CRUD Controls**: Authenticated users can write a review, select their rating, write descriptive feedback, edit their previous reviews, or completely delete them.
*   **Admin Moderation**: Integrated moderation controls allow system administrators to delete inappropriate reviews instantly from any product's details page.

### 5. Persistent Wishlist Page
The "Wishlist" tab compiles all saved learning courses, agricultural templates, and physical products using real-time Firestore sync and `localStorage` cache fallbacks:
*   **Multi-Category Filtering**: Admins and users can filter their wishlist by Products, Academy, or Agriculture designs, or search saved items in real-time.
*   **Quick Checkout Integration**: Physical marketplace items in the wishlist feature an instant **Buy Now** button. This opens the transaction flow directly without forcing the user to find the product in the main marketplace tab first.

---

## SECTION 3: Cloud Deployment Guide (Netlify & Vercel)

Dure Boru is a high-speed Single Page Application (SPA) on the frontend. Here is how you can deploy it to production platforms.

### A. Deploying to Netlify (Recommended for SPAs)
Netlify provides exceptionally fast static hosting with simple GitHub integrations.

1.  **Configure Build Settings**:
    *   **Repository**: Connect your Dure Boru repository to Netlify.
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
2.  **Configure URL Rewrites (`_redirects`)**:
    Because React uses client-side routing, you must instruct Netlify to redirect all routes to `index.html`.
    Create a file named `_redirects` inside the `/public` folder of your project with the following content:
    ```text
    /*    /index.html   200
    ```
    This ensures that reloading the page on routes like `/profile` or `/marketplace` does not trigger a 404 error.
3.  **Environment Variables**:
    Under **Site configuration > Environment variables**, add all variables prefixed with `VITE_` matching your `.env.local` settings.

### B. Deploying to Vercel
Vercel is optimized for React/Vite applications and has automatic SPA detection.

1.  **Deploy via Vercel CLI / Dashboard**:
    *   Import your project on the Vercel dashboard.
    *   Select **Vite** as the framework preset (Vercel will auto-configure `npm run build` as the build command and `dist` as the output directory).
2.  **Configure Routing (`vercel.json`)**:
    To handle client-side routing on Vercel, create a `vercel.json` file in the root directory:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    // Note: Do not include this config if you use server.ts backend APIs.
    ```
3.  **Environment Variables**:
    Add your Firebase environment variables (`VITE_FIREBASE_API_KEY`, etc.) in the Vercel Project settings.
