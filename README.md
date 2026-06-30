# React E-Commerce App with Firebase

A React e-commerce application originally built on the [FakeStore API](https://fakestoreapi.com/), now extended with **Firebase** for authentication, product management, and order tracking. Users can register, log in, browse and manage products, build a cart, and check out — with their order history saved and retrievable.

## Features

### Authentication

- **Register** with email/password — creates a Firebase Auth account and a matching user profile document in Firestore.
- **Login / Logout** with Firebase Authentication.

### User Profile

- **View** your profile (name, email, address).
- **Update** your name and address.
- **Delete** your account (requires password re-entry for security, then removes both your Firestore profile and your Auth account).

### Product Management

- Products are stored and managed entirely in **Firestore** (migrated from the original FakeStore API).
- **Browse** all products, filter by category (dynamically derived from existing products).
- **Add, edit, and delete** products directly from the app.
- Graceful image fallback if a product image fails to load.

### Shopping Cart

- Add products to a cart, adjust quantities, remove items.
- Cart state is managed with **Redux Toolkit** and persisted to `sessionStorage`.

### Order Management

- **Checkout** saves the cart as an order document in Firestore, tied to the logged-in user, then clears the cart.
- **Order History** — view a list of all past orders with date and total.
- **Order Detail** — click into any past order to see the full list of products and totals.

## Tech Stack

- **React** (Vite)
- **Firebase** — Authentication and Firestore (database, user profiles, products, orders)
- **React Query** (`@tanstack/react-query`) — data fetching and caching for products and orders
- **Redux Toolkit** (`@reduxjs/toolkit` + `react-redux`) — shopping cart state
- **React Router** (`react-router-dom`) — navigation and routing

## How It Works

The app separates concerns across a few clear boundaries:

- **Firebase Authentication** manages who's logged in. An `AuthContext` wraps the app and exposes the current user plus `register`, `login`, and `logout` functions to any component via `useAuth()`.
- **Firestore** is the database for everything else: user profiles (`users` collection), products (`products` collection), and orders (`orders` collection).
- **React Query** fetches and caches data from Firestore — products, a user's order history, and individual order details — and automatically refetches after any create/update/delete action.
- **Redux Toolkit** continues to manage only the shopping cart, which is local, in-progress state until checkout converts it into a permanent Firestore order.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- A [Firebase project](https://console.firebase.google.com/) with **Authentication** (Email/Password) and **Firestore Database** enabled

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/kdead/React-Ecommerce-Web-App.git
   cd React-Ecommerce-Web-App
```

2. Install dependencies:

```bash
   npm install
```

3. Add your Firebase project config to `src/firebase.js` (see Firebase Setup below).

4. Start the development server:

```bash
   npm run dev
```

5. Open the local URL shown in your terminal (usually `http://localhost:5173/`) in your browser.

### Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Register a Web app within the project to get your config object.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Enable **Firestore Database** (test mode is fine for development).
5. Paste your config values into `src/firebase.js`.

> Note: products must exist in Firestore for the app to display them. A one-time seed step was used during development to copy sample data from the FakeStore API into Firestore; products can also be added directly through the app's "Add Product" form once logged in.

## Project Structure

```
src/
  api/
    products.js          # Firestore product CRUD
    orders.js            # Firestore order create/read
  app/
    store.js             # Redux store + sessionStorage persistence
  context/
    AuthContext.jsx      # Firebase Auth state + register/login/logout
  features/
    cart/
      cartSlice.js       # Cart reducers and actions
  components/
    Navbar.jsx           # Navigation, auth-aware links, live cart count
    Home.jsx             # Product listing, category filter, add product
    ProductCard.jsx      # Single product card with edit/delete
    ProductForm.jsx      # Add/edit product form
    Cart.jsx             # Cart view, totals, checkout
    Register.jsx         # User registration
    Login.jsx            # User login
    Profile.jsx          # View/update/delete profile
    OrderHistory.jsx     # List of past orders
    OrderDetail.jsx      # Single order detail view
  firebase.js             # Firebase app initialization
  App.jsx                 # Routes
  main.jsx                # App entry + providers
  index.css               # Styling
```
