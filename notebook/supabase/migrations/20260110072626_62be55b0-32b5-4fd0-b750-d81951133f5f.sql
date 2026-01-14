-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own notes
CREATE POLICY "Users can view their own notes"
ON public.notes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own notes
CREATE POLICY "Users can insert their own notes"
ON public.notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own notes
CREATE POLICY "Users can update their own notes"
ON public.notes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
ON public.notes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);