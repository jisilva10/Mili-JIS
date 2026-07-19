import { createClient } from '@supabase/supabase-js'

// You should ideally use environment variables (.env) for this in production,
// but we are using the provided keys here directly for quick setup.
const supabaseUrl = 'https://hycylxqmiakyqnzfzgqw.supabase.co'
const supabaseKey = 'sb_publishable_VdUEF0yunji7nhng9DUi3g_wUk_lpm2'

export const supabase = createClient(supabaseUrl, supabaseKey)
