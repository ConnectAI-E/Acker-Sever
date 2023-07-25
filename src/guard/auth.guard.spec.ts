import { SupabaseService } from '../supabase/supabase.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard({} as SupabaseService)).toBeDefined();
  });
});
