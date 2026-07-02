export type Role = 'owner' | 'employee' | 'business_owner' | 'staff' | 'customer'

export interface OrgBranding {
  primaryColor?: string
  accentColor?: string
  logoUrl?: string
  fontFamily?: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  product: string
  branding: OrgBranding
  created_at: string
}

export interface Membership {
  id: string
  user_id: string
  organization_id: string | null
  role: Role
  permissions: Record<string, boolean>
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}
