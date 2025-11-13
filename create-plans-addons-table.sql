-- Create plans_addons table
CREATE TABLE IF NOT EXISTS plans_addons (
    plans_addon_id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL,
    addon_id INTEGER NOT NULL,
    paid INTEGER NOT NULL,
    value INTEGER NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    status BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);