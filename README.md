# FoodNet - Modern Full-Stack Food Platform

FoodNet is a revolutionary platform that combines live cooking video streaming, online food ordering, and a marketplace for chefs and restaurants.

## Features

- **Live Streaming**: Watch chefs cook in real-time with interactive chat.
- **Ordering**: Browse restaurants, add to cart, and track your orders.
- **Dashboards**: Specialized dashboards for Chefs (manage streams/orders) and Users.
- **Admin Panel**: Complete system oversight, moderation, and analytics.
- **Mobile First**: Fully responsive design using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (Google Sign-In)

## Firebase Integration

This app uses Firebase for data storage and authentication. 
- **Firestore**: Stores users, streams, food items, and orders.
- **Auth**: Google Sign-In managed via Firebase.

The schema is defined in `firebase-blueprint.json` and secured by `firestore.rules`.

## Getting Started

1. **Environment Variables**:
   Fill in your keys in the Settings menu (variables listed in `.env.example`):
   - `GEMINI_API_KEY`

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## API Routes

- `GET /api/health`: Health check
- `GET /api/streams`: Get current live streams
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `GET /api/restaurants`: List all restaurants
- `POST /api/orders`: Place a new order
