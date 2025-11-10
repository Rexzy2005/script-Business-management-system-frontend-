/*
  # Create Business Profiles and Products Tables

  ## Overview
  This migration creates the core tables for managing business profiles and their product inventory.

  ## New Tables
  
  ### 1. `business_profiles`
  Stores business information for registered users.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `business_name` (text) - Name of the business
  - `business_type` (text) - Either 'product_seller' or 'service_provider'
  - `email` (text) - Business contact email
  - `phone` (text, optional) - Business contact phone
  - `created_at` (timestamptz) - When the profile was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `products`
  Stores product inventory for businesses.
  - `id` (uuid, primary key) - Unique identifier
  - `business_id` (uuid, foreign key) - References business_profiles
  - `name` (text) - Product name
  - `price` (numeric) - Product price
  - `quantity` (integer) - Available quantity
  - `sale_type` (text) - 'bulk', 'pieces', or 'both'
  - `created_at` (timestamptz) - When the product was added
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on both tables
  - Users can only view and manage their own business profile
  - Users can only view and manage products belonging to their business
  
  ### Policies
  1. Business Profiles:
     - Users can read their own profile
     - Users can insert their own profile
     - Users can update their own profile
     - Users can delete their own profile
  
  2. Products:
     - Users can read products from their business
     - Users can insert products to their business
     - Users can update products in their business
     - Users can delete products from their business

  ## Important Notes
  - Default values set for timestamps (now())
  - Default value for quantity is 0
  - Business type restricted to 'product_seller' or 'service_provider'
  - Sale type restricted to 'bulk', 'pieces', or 'both'
  - Foreign key constraints ensure data integrity
*/

-- Create business_profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL CHECK (business_type IN ('product_seller', 'service_provider')),
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0 NOT NULL CHECK (quantity >= 0),
  sale_type text NOT NULL CHECK (sale_type IN ('bulk', 'pieces', 'both')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_profiles

CREATE POLICY "Users can view own business profile"
  ON business_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own business profile"
  ON business_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile"
  ON business_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business profile"
  ON business_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for products

CREATE POLICY "Users can view own business products"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = products.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create products for own business"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = products.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in own business"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = products.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = products.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products from own business"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = products.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );