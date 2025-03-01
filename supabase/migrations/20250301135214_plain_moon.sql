/*
  # Create flowcharts schema

  1. New Tables
    - `flowcharts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `flowcharts` table
    - Add policies for authenticated users to manage their own flowcharts
*/

CREATE TABLE IF NOT EXISTS flowcharts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flowcharts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own flowcharts"
  ON flowcharts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own flowcharts"
  ON flowcharts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own flowcharts"
  ON flowcharts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flowcharts"
  ON flowcharts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX flowcharts_user_id_idx ON flowcharts (user_id);