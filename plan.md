# Waste Management MVP Implementation Plan

## Core Features
- MapTiler-powered base map with Deck.gl heatmap overlay
- Photo upload with geolocation capture
- Real-time waste report visualization
- Detailed report viewing with photos and timestamps
- Supabase backend for data storage and file management

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Map**: MapTiler API, Deck.gl HeatmapLayer
- **Backend**: Supabase (Database + Storage)
- **Deployment**: Vercel

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://adbhxsrmbpzqhwbnixvp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmh4c3JtYnB6cWh3Ym5peHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjE0ODQsImV4cCI6MjA3MzA5NzQ4NH0.-YF8tBgZllKf_m_aT2m4FfZBhc2U2HpSpZh0VEfGfqw
NEXT_PUBLIC_MAPTILER_API_KEY=bOUN4GVKBLVuhiFxSMfZ
```

## Database Schema

### reports table
```sql
id: uuid (primary key)
latitude: real (required)
longitude: real (required)
photo_url: text (required)
created_at: timestamp (auto)
```

### Storage bucket: waste-photos

## Dependencies to Install
- @supabase/supabase-js
- @deck.gl/core
- @deck.gl/aggregation-layers
- @deck.gl/react
- maplibre-gl
- react-map-gl

## Implementation Flow

### 1. Environment Setup
- Create .env.local with API keys
- Install required dependencies

### 2. Supabase Configuration
- Create reports table
- Set up storage bucket for photos
- Configure RLS policies

### 3. Core Components
- MapComponent: MapTiler base + Deck.gl heatmap
- UploadComponent: Photo capture + geolocation
- ReportModal: Detailed report viewing

### 4. Real-time Features
- Supabase real-time subscriptions
- Automatic heatmap updates
- Live data synchronization

### 5. Main App Flow
1. User sees map with existing waste reports as heatmap
2. User uploads photo → app captures GPS coordinates
3. Data saves to Supabase (reports table + storage)
4. Heatmap updates in real-time
5. Users can click hotspots to see detailed reports

## File Structure
```
src/
├── app/
│   ├── page.tsx (main map view)
│   └── layout.tsx
├── components/
│   ├── MapComponent.tsx
│   ├── UploadComponent.tsx
│   └── ReportModal.tsx
├── lib/
│   ├── supabase.ts
│   └── types.ts
└── utils/
    └── geolocation.ts
```
