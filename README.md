# Hidden Eats 🍔🥘

**Discovering and delivering the best local culinary secrets across Tamil Nadu. Fast, reliable, and always hot.**

Hidden Eats is a modern food discovery and delivery platform dedicated to uncovering the hidden gems of local cuisine. We connect food lovers with authentic, hard-to-find eateries that aren't on traditional platforms.

## 🌟 Features

- **Discover Hidden Gems**: Find the best local and street food across Tamil Nadu.
- **Multiple User Roles**:
  - **Foodies**: Browse, search, and order from hidden culinary spots.
  - **Drivers**: Dedicated driver dashboard to manage deliveries seamlessly.
- **Modern UI/UX**: A sleek, dark-themed responsive interface built with Tailwind CSS and Framer Motion for smooth micro-interactions.
- **Real-time Delivery Tracking**: (Coming Soon) Track your orders in real-time from the kitchen to your doorstep.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/DB**: [Supabase](https://supabase.com/)

## 📂 Project Structure

This project is set up as a Turborepo monorepo:

- `apps/web`: The main Next.js front-end application (User, Driver, and Admin portals).
- `apps/mobile`: (If applicable) Mobile application codebase.
- `packages/shared`: Shared utilities, components, and types.
- `packages/supabase-client`: Centralized Supabase client and database schemas.

## 🛠️ Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- npm (v10+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Skryyyyyy/Hidden-Eats.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables for Supabase (Create a `.env.local` in `apps/web`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running Locally

Start the development server across all packages:

```bash
npm run dev
```

The web application will typically run at `http://localhost:3000` (or `3001` if `3000` is in use).

## 📜 Scripts

- `npm run dev`: Starts the development servers.
- `npm run build`: Builds the applications for production.
- `npm run lint`: Lints the codebase.
- `npm run format`: Formats code using Prettier.

## 🤝 Contributing

We welcome contributions! Please open an issue or submit a pull request with your suggested changes or features.

## 📄 License

© 2026 Hidden Eats. All rights reserved.
