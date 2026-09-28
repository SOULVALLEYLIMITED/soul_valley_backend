// src/types/index.ts

// ============================================
// AUTH TYPES
// ============================================

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

// ============================================
// AI CHAT TYPES
// ============================================

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: {
    response: string;
    model: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  error?: string;
}

export interface ModelsResponse {
  success: boolean;
  data: {
    models: Array<{ id: string; name: string; description: string }>;
  };
}

export interface HealthResponse {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
}

// ============================================
// CONTACT TYPES
// ============================================

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  source: string;
  discoveryDetails?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactStatusRequest {
  status: "new" | "read" | "replied";
}

// ✅ Add ContactsListResponse to shared types
export interface ContactsListResponse {
  success: boolean;
  data?: ContactResponse[];
  error?: string;
}

// ============================================
// DISCOVERY TYPES
// ============================================
// src/types/index.ts - Update SubmitDiscoveryRequest

export interface SubmitDiscoveryRequest {
  organization?: string;
  contact_name: string;
  email: string;
  problem?: string;
  idea?: string;
  current_process?: string;
  target_users?: string[];
  desired_outcome?: string;
  requirements?: string[];
  existing_systems?: string[];
  constraints?: string[];
  timeline?: string;
  budget?: string;
  open_questions?: string[];
  additional_context?: string;
}

export interface SubmitDiscoveryResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface DiscoveryExtractionData {
  organization: string;
  contact_name: string;
  email: string;
  problem: string;
  idea: string;
  current_process: string;
  target_users: string[];
  desired_outcome: string;
  requirements: string[];
  existing_systems: string[];
  constraints: string[];
  timeline: string;
  budget: string;
  open_questions: string[];
  additional_context: string;
  ready_for_submission: boolean;
}

export interface DiscoveryExtractionResponse {
  success: boolean;
  data?: DiscoveryExtractionData;
  error?: string;
}

// ============================================
// COMMUNITY TYPES
// ============================================

export interface CommunityUpdateResponse {
  id: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityUpdatesListResponse {
  success: boolean;
  data?: CommunityUpdateResponse[];
  error?: string;
}

export interface CreateCommunityUpdateRequest {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface UpdateCommunityUpdateRequest {
  title?: string;
  body?: string;
  imageUrl?: string;
}

export interface UploadImageResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// ============================================
// GENERIC TYPES
// ============================================

export interface SimpleResponse {
  success: boolean;
  error?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: any;
}