export type PropertyType = 'house' | 'flat' | 'studio' | 'room' | 'other'
export type UserRole = 'landlord' | 'tenant' | 'contractor'

export const UserRoleInfo: Record<UserRole, { displayName: string; description: string; icon: string }> = {
  landlord: {
    displayName: 'Landlord',
    description: 'Property owner with full management access',
    icon: 'Building2'
  },
  tenant: {
    displayName: 'Tenant',
    description: 'Renter with view access and issue reporting',
    icon: 'User'
  },
  contractor: {
    displayName: 'Contractor',
    description: 'Tradesperson with access to assigned work',
    icon: 'Wrench'
  }
}

export type Permission = 
  | 'view_property' | 'edit_property' | 'manage_rooms' | 'manage_tenancies'
  | 'manage_documents' | 'manage_reminders' | 'view_issues' | 'manage_issues'
  | 'report_issues' | 'view_assigned_issues' | 'update_issue_status'
  | 'take_photos' | 'view_documents' | 'export_pdf' | 'invite_users' | 'messaging'

export const RolePermissions: Record<UserRole, Permission[]> = {
  landlord: [
    'view_property', 'edit_property', 'manage_rooms', 'manage_tenancies',
    'manage_documents', 'manage_reminders', 'view_issues', 'manage_issues',
    'take_photos', 'export_pdf', 'invite_users', 'messaging'
  ],
  tenant: [
    'view_property', 'view_issues', 'report_issues', 'take_photos',
    'view_documents', 'messaging'
  ],
  contractor: [
    'view_assigned_issues', 'update_issue_status', 'take_photos', 'messaging'
  ]
}
export type RentFrequency = 'weekly' | 'monthly'
export type DepositScheme = 'dps' | 'tds' | 'mydeposits' | 'other'
export type TenancyStatus = 'active' | 'pending' | 'ended'
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent'
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type ReminderType = 'gas_safety' | 'eicr' | 'epc' | 'smoke_alarm' | 'co_alarm' | 'boiler_service' | 'insurance' | 'custom'
export type DocumentType = 'tenancy_agreement' | 'inventory' | 'gas_certificate' | 'eicr' | 'epc' | 'insurance' | 'receipt' | 'other'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  default_role: UserRole
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  user_id: string
  address_line1: string
  address_line2: string | null
  city: string
  postcode: string
  property_type: PropertyType
  bedrooms: number
  bathrooms: number
  user_role: UserRole
  notes: string | null
  created_at: string
  updated_at: string
  // Relations
  rooms?: Room[]
  tenancies?: Tenancy[]
  photos?: Photo[]
  issues?: Issue[]
  documents?: Document[]
  compliance_reminders?: ComplianceReminder[]
}

export interface Room {
  id: string
  property_id: string
  name: string
  description: string | null
  sort_order: number
  created_at: string
}

export interface Tenancy {
  id: string
  property_id: string
  tenant_name: string | null
  tenant_email: string | null
  tenant_phone: string | null
  start_date: string
  end_date: string | null
  rent_amount: number
  rent_frequency: RentFrequency
  deposit_amount: number | null
  deposit_scheme: DepositScheme | null
  deposit_reference: string | null
  status: TenancyStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  property_id: string
  room_id: string | null
  storage_path: string
  thumbnail_path: string | null
  caption: string | null
  taken_at: string | null
  latitude: number | null
  longitude: number | null
  is_before: boolean
  created_at: string
}

export interface Issue {
  id: string
  property_id: string
  room_id: string | null
  title: string
  description: string | null
  priority: IssuePriority
  status: IssueStatus
  reported_by: string | null
  assigned_to: string | null
  resolved_at: string | null
  resolution_notes: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  property_id: string
  tenancy_id: string | null
  document_type: DocumentType
  name: string
  storage_path: string
  file_size: number | null
  mime_type: string | null
  valid_from: string | null
  valid_until: string | null
  notes: string | null
  created_at: string
}

export interface ComplianceReminder {
  id: string
  property_id: string
  reminder_type: ReminderType
  title: string
  description: string | null
  due_date: string
  reminder_days: number[]
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  property_id: string
  sender_id: string | null
  content: string
  is_read: boolean
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'rooms' | 'tenancies' | 'photos' | 'issues' | 'documents' | 'compliance_reminders'>
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'rooms' | 'tenancies' | 'photos' | 'issues' | 'documents' | 'compliance_reminders'>>
      }
      rooms: {
        Row: Room
        Insert: Omit<Room, 'id' | 'created_at'>
        Update: Partial<Omit<Room, 'id' | 'created_at'>>
      }
      tenancies: {
        Row: Tenancy
        Insert: Omit<Tenancy, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tenancy, 'id' | 'created_at'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'>
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
      }
      issues: {
        Row: Issue
        Insert: Omit<Issue, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Issue, 'id' | 'created_at'>>
      }
      documents: {
        Row: Document
        Insert: Omit<Document, 'id' | 'created_at'>
        Update: Partial<Omit<Document, 'id' | 'created_at'>>
      }
      compliance_reminders: {
        Row: ComplianceReminder
        Insert: Omit<ComplianceReminder, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ComplianceReminder, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
    }
  }
}
