# LetLog Web Dashboard

Property management web application built with Next.js 14 and Supabase.

## Features

- 🏠 **Property Management** - Track unlimited properties with details, photos, and documents
- 📸 **Photo Inventories** - Before/after photos with timestamps and geolocation
- 👥 **Tenancy Tracking** - Manage tenants, rent, deposits, and agreements
- 🔧 **Issue Management** - Log, assign, and track maintenance issues
- ⏰ **Compliance Reminders** - Gas safety, EICR, EPC, and custom reminders
- 📄 **Document Storage** - Securely store certificates and agreements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/aarons2222/letlog-web.git
cd letlog-web
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your Supabase credentials.

4. Set up the database:
   - Go to your Supabase dashboard
   - Open SQL Editor
   - Run the SQL from \`supabase/schema.sql\`

5. Create a storage bucket:
   - Go to Storage in Supabase dashboard
   - Create a new bucket called \`letlog-files\`
   - Set it to private

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## API Routes

### Properties
- \`GET /api/properties\` - List all properties
- \`POST /api/properties\` - Create a property
- \`GET /api/properties/[id]\` - Get property details
- \`PUT /api/properties/[id]\` - Update a property
- \`DELETE /api/properties/[id]\` - Delete a property

### Nested Resources
- \`GET/POST /api/properties/[id]/rooms\` - Property rooms
- \`GET/POST /api/properties/[id]/issues\` - Property issues
- \`GET/POST /api/properties/[id]/tenancies\` - Property tenancies

## Project Structure

\`\`\`
letlog-web/
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # Authenticated dashboard routes
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       └── properties/
│   │   ├── api/             # API routes
│   │   ├── page.tsx         # Landing page
│   │   └── layout.tsx
│   └── lib/
│       └── supabase/        # Supabase client & types
├── supabase/
│   └── schema.sql           # Database schema
└── public/
\`\`\`

## Database Schema

See \`supabase/schema.sql\` for the complete database schema including:
- Profiles (users)
- Properties
- Rooms
- Tenancies
- Photos
- Issues
- Documents
- Compliance Reminders
- Messages

All tables have Row Level Security (RLS) enabled.

## Deployment

Deploy to Vercel:

\`\`\`bash
npm run build
vercel
\`\`\`

## Related Projects

- [LetLog iOS](../LetLog) - iOS app
- [LetLog Android](../LetLog-Android) - Android app
- [LetLog Landing](../LetLog/landing) - Marketing landing page

## License

MIT
