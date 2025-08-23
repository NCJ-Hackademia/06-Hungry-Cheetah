# 🐄 Smart Animal Management & Marketplace Platform

A revolutionary IoT-powered platform for livestock management, health monitoring, and secure animal trading.

## 🌟 Features

### Core Functionality
- **Real-time Health Monitoring** - IoT sensors track vital signs, feeding, and environmental conditions
- **Smart Analytics Dashboard** - AI-powered insights and predictive health analysis
- **Secure Marketplace** - Escrow-protected transactions with verified animal data
- **Mobile-First Design** - Optimized for farmers using smartphones in the field

### User Roles
- **Farmers** - Monitor animals, create listings, manage health data
- **Buyers** - Browse verified listings, make secure offers
- **Veterinarians** - Access health logs for better treatment decisions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-animal-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Demo Flow

### 3-Minute Demo Path
1. **Landing Page** (`/`) - Overview of platform features
2. **Authentication** (`/auth`) - Sign up as farmer/buyer/vet
3. **Dashboard** (`/dashboard`) - View animal health metrics
4. **Marketplace** (`/marketplace`) - Browse and filter listings
5. **IoT Dashboard** (`/iot`) - Real-time sensor monitoring

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Animations**: Framer Motion

### Database Schema
```sql
-- Users table
users (id, email, role, name, phone, kyc_status, rating)

-- Animals table  
animals (id, owner_id, species, breed, name, dob, health_score, weight)

-- Animal metrics (IoT data)
animal_metrics (id, animal_id, timestamp, temperature, humidity, activity_level)

-- Marketplace
listings (id, animal_id, seller_id, price, status)
offers (id, listing_id, buyer_id, amount, status)
orders (id, listing_id, escrow_status, payment_status)
```

## 🎯 Key Components

### Smart Features
- **Health Score Algorithm** - Calculates animal health based on multiple metrics
- **Real-time Alerts** - Notifications for temperature, feeding, health issues
- **Escrow System** - Secure payment processing for marketplace transactions
- **QR Code Handover** - Digital ownership transfer system

### IoT Integration
- Temperature & humidity sensors
- Activity monitoring
- Automated feeding systems
- Mosquito control systems
- Weather API integration

## 🎨 UI/UX Highlights

### Design System
- **Color Palette**: Farm-themed greens, blues, and earth tones
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Mobile-First**: Responsive design optimized for field use

### Components
- Custom animal health indicators
- Real-time progress bars
- Interactive marketplace cards
- Animated sensor status displays

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── marketplace/    # Marketplace components
│   ├── iot/            # IoT monitoring components
│   └── layout/         # Layout components
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 API Integrations

### External APIs
- **Weather API** - Climate data for environmental monitoring
- **Payment Gateway** - Secure transaction processing
- **QR Code Generation** - Digital handover system

### Supabase Features
- **Real-time Subscriptions** - Live data updates
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless backend logic
- **Storage** - Image and document management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@smartanimalplatform.com
- Documentation: [docs.smartanimalplatform.com](https://docs.smartanimalplatform.com)

---

**Built with ❤️ for the farming community**
