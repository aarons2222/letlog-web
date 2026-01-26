-- LetLog Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE property_type AS ENUM ('house', 'flat', 'studio', 'room', 'other');
CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'agent', 'contractor');
CREATE TYPE rent_frequency AS ENUM ('weekly', 'monthly');
CREATE TYPE deposit_scheme AS ENUM ('dps', 'tds', 'mydeposits', 'other');
CREATE TYPE tenancy_status AS ENUM ('active', 'pending', 'ended');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE reminder_type AS ENUM ('gas_safety', 'eicr', 'epc', 'smoke_alarm', 'co_alarm', 'boiler_service', 'insurance', 'custom');
CREATE TYPE document_type AS ENUM ('tenancy_agreement', 'inventory', 'gas_certificate', 'eicr', 'epc', 'insurance', 'receipt', 'other');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    default_role user_role DEFAULT 'tenant',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    postcode TEXT NOT NULL,
    property_type property_type DEFAULT 'flat',
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    user_role user_role DEFAULT 'tenant',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenancies table
CREATE TABLE tenancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    tenant_name TEXT,
    tenant_email TEXT,
    tenant_phone TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    rent_amount DECIMAL(10, 2) NOT NULL,
    rent_frequency rent_frequency DEFAULT 'monthly',
    deposit_amount DECIMAL(10, 2),
    deposit_scheme deposit_scheme,
    deposit_reference TEXT,
    status tenancy_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    thumbnail_path TEXT,
    caption TEXT,
    taken_at TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_before BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issues table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority issue_priority DEFAULT 'medium',
    status issue_status DEFAULT 'open',
    reported_by UUID REFERENCES profiles(id),
    assigned_to UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    tenancy_id UUID REFERENCES tenancies(id) ON DELETE SET NULL,
    document_type document_type DEFAULT 'other',
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    valid_from DATE,
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Reminders table
CREATE TABLE compliance_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    reminder_type reminder_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    reminder_days INTEGER[] DEFAULT '{30, 14, 7, 1}',
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (for in-app messaging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_tenancies_property ON tenancies(property_id);
CREATE INDEX idx_tenancies_status ON tenancies(status);
CREATE INDEX idx_photos_property ON photos(property_id);
CREATE INDEX idx_photos_room ON photos(room_id);
CREATE INDEX idx_issues_property ON issues(property_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_compliance_property ON compliance_reminders(property_id);
CREATE INDEX idx_compliance_due ON compliance_reminders(due_date);
CREATE INDEX idx_messages_property ON messages(property_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties: users can CRUD their own properties
CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Rooms: access via property ownership
CREATE POLICY "Users can view rooms of own properties" ON rooms FOR SELECT 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = rooms.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can create rooms in own properties" ON rooms FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM properties WHERE properties.id = rooms.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can update rooms in own properties" ON rooms FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = rooms.property_id AND properties.user_id = auth.uid()));
CREATE POLICY "Users can delete rooms in own properties" ON rooms FOR DELETE 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = rooms.property_id AND properties.user_id = auth.uid()));

-- Similar policies for other tables
CREATE POLICY "Users can manage own tenancies" ON tenancies FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = tenancies.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage own photos" ON photos FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = photos.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage own issues" ON issues FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = issues.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage own documents" ON documents FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = documents.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage own reminders" ON compliance_reminders FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = compliance_reminders.property_id AND properties.user_id = auth.uid()));

CREATE POLICY "Users can manage messages for own properties" ON messages FOR ALL 
    USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = messages.property_id AND properties.user_id = auth.uid()));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tenancies_updated_at BEFORE UPDATE ON tenancies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_compliance_updated_at BEFORE UPDATE ON compliance_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for files
-- Run in Supabase dashboard: Storage > Create bucket "letlog-files" (private)
