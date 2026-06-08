CREATE TABLE IF NOT EXISTS oracle_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  asset TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('above', 'below')),
  threshold NUMERIC NOT NULL,
  active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  triggered_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oracle_alerts_wallet ON oracle_alerts(wallet_address);
CREATE INDEX IF NOT EXISTS idx_oracle_alerts_active ON oracle_alerts(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_oracle_alerts_asset ON oracle_alerts(asset);

ALTER TABLE oracle_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read oracle alerts"
  ON oracle_alerts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert oracle alerts"
  ON oracle_alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update oracle alerts"
  ON oracle_alerts FOR UPDATE
  USING (true);
