-- ============================================================================
-- Atlas Protocol - Database Indexes for Performance Optimization
-- Script: 018_create_database_indexes.sql
-- Purpose: Add indexes for common queries across all tables
-- ============================================================================

-- Provider Discovery Indexes
-- Used for filtering and listing provider offerings
CREATE INDEX IF NOT EXISTS idx_provider_listings_category 
  ON provider_listings(category) 
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_provider_listings_status 
  ON provider_listings(status);

CREATE INDEX IF NOT EXISTS idx_provider_listings_featured 
  ON provider_listings(featured) 
  WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_provider_listings_provider_id 
  ON provider_listings(provider_id);

-- Composite index for provider discovery with sort
CREATE INDEX IF NOT EXISTS idx_provider_listings_category_featured 
  ON provider_listings(category, featured DESC);

-- API Key Lookup Indexes
-- Used for authentication and rate limiting
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id 
  ON api_keys(user_id);

CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash 
  ON api_keys(key_hash) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_api_keys_user_active 
  ON api_keys(user_id, is_active);

-- Usage Tracking Indexes
-- Used for quota tracking and analytics
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key_created 
  ON usage_logs(api_key_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_logs_endpoint_date 
  ON usage_logs(endpoint, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_logs_status_code 
  ON usage_logs(status_code, created_at DESC);

-- Quota Usage Indexes
CREATE INDEX IF NOT EXISTS idx_quota_usage_api_key_month 
  ON quota_usage(api_key_id, month DESC);

CREATE INDEX IF NOT EXISTS idx_quota_usage_status 
  ON quota_usage(status);

-- Entitlement Lookups
-- Used for subscription management and access control
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id 
  ON entitlements(user_id);

CREATE INDEX IF NOT EXISTS idx_entitlements_provider_id 
  ON entitlements(provider_id);

CREATE INDEX IF NOT EXISTS idx_entitlements_status 
  ON entitlements(status) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_entitlements_transaction_digest 
  ON entitlements(transaction_digest);

CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at 
  ON entitlements(expires_at DESC) 
  WHERE status = 'active';

-- Provider Usage Analytics
-- Used for performance and usage metrics
CREATE INDEX IF NOT EXISTS idx_provider_usage_entitlement_period 
  ON provider_usage(entitlement_id, period_date DESC);

CREATE INDEX IF NOT EXISTS idx_provider_usage_period_date 
  ON provider_usage(period_date DESC);

-- Transaction History Indexes
-- Used for user transaction tracking
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
  ON transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash 
  ON transactions(tx_hash);

CREATE INDEX IF NOT EXISTS idx_transactions_status 
  ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_type 
  ON transactions(tx_type, created_at DESC);

-- Moderation and Admin Indexes
CREATE INDEX IF NOT EXISTS idx_moderation_logs_admin_id 
  ON moderation_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_provider_id 
  ON moderation_logs(provider_id);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at 
  ON moderation_logs(created_at DESC);

-- Revenue Tracking Indexes
CREATE INDEX IF NOT EXISTS idx_revenue_records_entitlement_id 
  ON revenue_records(entitlement_id);

CREATE INDEX IF NOT EXISTS idx_revenue_records_period_month 
  ON revenue_records(period_month DESC);

CREATE INDEX IF NOT EXISTS idx_revenue_records_status 
  ON revenue_records(status);

-- User Data Indexes
CREATE INDEX IF NOT EXISTS idx_user_data_user_id 
  ON user_data(user_id, data_type);

CREATE INDEX IF NOT EXISTS idx_user_data_asset 
  ON user_data(asset_id, asset_type);

CREATE INDEX IF NOT EXISTS idx_user_data_created 
  ON user_data(created_at DESC);

-- Wallet Session Indexes
CREATE INDEX IF NOT EXISTS idx_wallet_sessions_wallet_address 
  ON wallet_sessions(wallet_address);

CREATE INDEX IF NOT EXISTS idx_wallet_sessions_token 
  ON wallet_sessions(session_token);

CREATE INDEX IF NOT EXISTS idx_wallet_sessions_expires 
  ON wallet_sessions(expires_at DESC);

-- Wallet Users Indexes
CREATE INDEX IF NOT EXISTS idx_wallet_users_wallet_address 
  ON wallet_users(wallet_address);

CREATE INDEX IF NOT EXISTS idx_wallet_users_created_at 
  ON wallet_users(created_at DESC);

-- Provider Indexes
CREATE INDEX IF NOT EXISTS idx_providers_user_id 
  ON providers(user_id);

CREATE INDEX IF NOT EXISTS idx_providers_status 
  ON providers(status);

CREATE INDEX IF NOT EXISTS idx_providers_category 
  ON providers(category);

-- Feedback Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id 
  ON feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at 
  ON feedback(created_at DESC);

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address 
  ON user_profiles(wallet_address);

-- ============================================================================
-- Performance Tuning: Analyze Tables
-- ============================================================================
-- This helps PostgreSQL optimizer make better decisions
ANALYZE provider_listings;
ANALYZE api_keys;
ANALYZE usage_logs;
ANALYZE quota_usage;
ANALYZE entitlements;
ANALYZE transactions;
ANALYZE moderation_logs;
ANALYZE revenue_records;
ANALYZE user_data;
ANALYZE wallet_sessions;
ANALYZE wallet_users;
ANALYZE providers;
ANALYZE feedback;
ANALYZE user_profiles;
ANALYZE provider_usage;

-- ============================================================================
-- Script completed successfully
-- All indexes have been created for production performance
-- ============================================================================
