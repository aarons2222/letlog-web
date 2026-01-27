-- LetLog Migration: Add Quotes and Contractor Profiles
-- For tender/quote system

-- Trade categories enum
CREATE TYPE trade_category AS ENUM (
    'plumbing',
    'electrical',
    'gas',
    'heating',
    'roofing',
    'carpentry',
    'painting',
    'locksmith',
    'appliances',
    'cleaning',
    'gardening',
    'pest_control',
    'glazing',
    'flooring',
    'general'
);

-- Quote status enum
CREATE TYPE quote_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'withdrawn',
    'expired'
);

-- Issue tender status (extends issue workflow)
CREATE TYPE tender_status AS ENUM (
    'not_tendered',
    'open',
    'quoted',
    'assigned',
    'completed'
);

-- Contractor profiles table
CREATE TABLE contractor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_name TEXT,
    description TEXT,
    trades trade_category[] NOT NULL DEFAULT '{}',
    coverage_postcodes TEXT[] DEFAULT '{}', -- Areas they cover
    hourly_rate DECIMAL(10, 2),
    call_out_fee DECIMAL(10, 2),
    insurance_number TEXT,
    insurance_expiry DATE,
    gas_safe_number TEXT, -- For gas engineers
    gas_safe_expiry DATE,
    rating DECIMAL(3, 2) DEFAULT 0, -- 0-5 stars
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trade_category to issues for matching contractors
ALTER TABLE issues ADD COLUMN trade_category trade_category;
ALTER TABLE issues ADD COLUMN tender_status tender_status DEFAULT 'not_tendered';
ALTER TABLE issues ADD COLUMN tender_deadline TIMESTAMPTZ;
ALTER TABLE issues ADD COLUMN budget_min DECIMAL(10, 2);
ALTER TABLE issues ADD COLUMN budget_max DECIMAL(10, 2);

-- Quotes table
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE NOT NULL,
    contractor_id UUID REFERENCES contractor_profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    estimated_hours DECIMAL(5, 2),
    materials_included BOOLEAN DEFAULT false,
    materials_cost DECIMAL(10, 2),
    availability_date DATE,
    availability_notes TEXT,
    warranty_days INTEGER DEFAULT 0,
    status quote_status DEFAULT 'pending',
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    landlord_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Prevent duplicate quotes from same contractor on same issue
    UNIQUE(issue_id, contractor_id)
);

-- Reviews table (landlords review contractors after job completion)
CREATE TABLE contractor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractor_profiles(id) ON DELETE CASCADE NOT NULL,
    issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    would_recommend BOOLEAN DEFAULT true,
    response TEXT, -- Contractor can respond
    response_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contractor_trades ON contractor_profiles USING GIN (trades);
CREATE INDEX idx_contractor_postcodes ON contractor_profiles USING GIN (coverage_postcodes);
CREATE INDEX idx_contractor_available ON contractor_profiles(available) WHERE available = true;
CREATE INDEX idx_contractor_verified ON contractor_profiles(verified) WHERE verified = true;
CREATE INDEX idx_quotes_issue ON quotes(issue_id);
CREATE INDEX idx_quotes_contractor ON quotes(contractor_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_issues_tender ON issues(tender_status) WHERE tender_status != 'not_tendered';
CREATE INDEX idx_issues_trade ON issues(trade_category);
CREATE INDEX idx_reviews_contractor ON contractor_reviews(contractor_id);

-- RLS Policies
ALTER TABLE contractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_reviews ENABLE ROW LEVEL SECURITY;

-- Contractor profiles: public read for matching, own write
CREATE POLICY "Anyone can view available contractors" ON contractor_profiles 
    FOR SELECT USING (available = true);
CREATE POLICY "Contractors can manage own profile" ON contractor_profiles 
    FOR ALL USING (auth.uid() = user_id);

-- Quotes: contractors can create/view own, landlords can view for their issues
CREATE POLICY "Contractors can view own quotes" ON quotes 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM contractor_profiles WHERE contractor_profiles.id = quotes.contractor_id AND contractor_profiles.user_id = auth.uid())
    );
CREATE POLICY "Contractors can create quotes for open tenders" ON quotes 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM contractor_profiles WHERE contractor_profiles.id = quotes.contractor_id AND contractor_profiles.user_id = auth.uid())
        AND EXISTS (SELECT 1 FROM issues WHERE issues.id = quotes.issue_id AND issues.tender_status = 'open')
    );
CREATE POLICY "Contractors can update own pending quotes" ON quotes 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM contractor_profiles WHERE contractor_profiles.id = quotes.contractor_id AND contractor_profiles.user_id = auth.uid())
        AND status = 'pending'
    );
CREATE POLICY "Landlords can view quotes for their issues" ON quotes 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM issues 
            JOIN properties ON properties.id = issues.property_id 
            WHERE issues.id = quotes.issue_id AND properties.user_id = auth.uid()
        )
    );
CREATE POLICY "Landlords can accept/reject quotes" ON quotes 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM issues 
            JOIN properties ON properties.id = issues.property_id 
            WHERE issues.id = quotes.issue_id AND properties.user_id = auth.uid()
        )
    );

-- Reviews: anyone can read, only past clients can write
CREATE POLICY "Anyone can view reviews" ON contractor_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed jobs" ON contractor_reviews 
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Contractors can respond to reviews" ON contractor_reviews 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM contractor_profiles WHERE contractor_profiles.id = contractor_reviews.contractor_id AND contractor_profiles.user_id = auth.uid())
        AND response IS NULL -- Can only respond once
    );

-- Function to update contractor rating after new review
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE contractor_profiles
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM contractor_reviews 
            WHERE contractor_id = NEW.contractor_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM contractor_reviews 
            WHERE contractor_id = NEW.contractor_id
        )
    WHERE id = NEW.contractor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_rating_on_review
    AFTER INSERT OR UPDATE ON contractor_reviews
    FOR EACH ROW EXECUTE FUNCTION update_contractor_rating();

-- Triggers for updated_at
CREATE TRIGGER update_contractor_profiles_updated_at 
    BEFORE UPDATE ON contractor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
