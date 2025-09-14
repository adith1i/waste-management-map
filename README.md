# Waste Management MVP

A real-time waste reporting and visualization system built with Next.js, MapTiler, Deck.gl, and Supabase.

## Features

- **Interactive Map**: MapTiler-powered base map with dynamic waste report visualization
- **Heatmap Visualization**: Deck.gl HeatmapLayer shows waste concentration hotspots
- **Photo Upload**: Users can report waste issues by uploading photos
- **Geolocation**: Automatic GPS coordinate capture for precise location tracking
- **Real-time Updates**: Live synchronization using Supabase real-time subscriptions
- **Detailed Reports**: Click on hotspots to view photos, timestamps, and coordinates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Map & Visualization**: MapTiler API, Deck.gl, MapLibre GL
- **Backend**: Supabase (PostgreSQL database + Storage)
- **Real-time**: Supabase real-time subscriptions
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- MapTiler account and API key

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd waste-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key
   ```

4. **Set up Supabase database**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create reports table
   CREATE TABLE reports (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     latitude REAL NOT NULL,
     longitude REAL NOT NULL,
     photo_url TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS and create policies
   ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow public read access" ON reports FOR SELECT USING (true);
   CREATE POLICY "Allow public insert access" ON reports FOR INSERT WITH CHECK (true);

   -- Create storage bucket
   INSERT INTO storage.buckets (id, name, public) VALUES ('waste-photos', 'waste-photos', true);
   CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'waste-photos');
   CREATE POLICY "Allow public read access to waste photos" ON storage.objects FOR SELECT USING (bucket_id = 'waste-photos');
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:3000`

## Usage

### Reporting Waste Issues

1. **Upload Photo**: Click on "Report Waste Issue" panel and select a photo
2. **Grant Location Access**: Allow the app to access your current location
3. **Submit Report**: Click "Submit Report" to upload the photo and save coordinates
4. **View on Map**: The report appears instantly on the heatmap

### Viewing Reports

1. **Heatmap View**: Colored areas on the map show waste concentration
2. **Click Hotspots**: Click on heat areas to see detailed reports
3. **Report Details**: View full-size photos, timestamps, and exact coordinates
4. **Open in Maps**: Get directions to report locations

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles and map CSS
├── components/
│   ├── MapComponent.tsx      # MapTiler + Deck.gl map
│   ├── UploadComponent.tsx   # Photo upload with geolocation
│   └── ReportModal.tsx       # Detailed report viewer
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── types.ts             # TypeScript type definitions
└── utils/
    └── geolocation.ts       # Browser geolocation utilities
```

## Configuration

### Supabase Setup

The application requires:
- `reports` table for storing waste report data
- `waste-photos` storage bucket for photo uploads
- Real-time subscriptions enabled
- Row Level Security (RLS) policies configured

### MapTiler Setup

- Create account at [MapTiler](https://www.maptiler.com/)
- Generate API key
- Add key to environment variables

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | MapTiler API key | Yes |

## Deployment

### Vercel Deployment

1. **Connect Repository**: Link your Git repository to Vercel
2. **Add Environment Variables**: Configure the required environment variables
3. **Deploy**: Automatic deployment on every push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Features in Detail

### Real-time Synchronization

- Uses Supabase real-time subscriptions
- Automatic heatmap updates when new reports are submitted
- No page refresh required for live data

### Geolocation Integration

- Browser Geolocation API for precise coordinates
- High accuracy GPS positioning
- Error handling for location access denied

### Photo Management

- Supabase Storage for secure photo hosting
- Image validation (type and size)
- Automatic URL generation for stored photos

### Heatmap Visualization

- Deck.gl HeatmapLayer for performance
- Custom color gradients for intensity
- Configurable radius and aggregation settings

## Browser Support

- Modern browsers with WebGL support
- HTTPS required for geolocation access
- Mobile-responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
