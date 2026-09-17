-- Public content policies reference is_content_editor() in an OR condition.
-- Granting EXECUTE to anon keeps published rows readable while the function
-- still returns false for users without an authenticated editor profile.
grant execute on function public.is_content_editor() to anon, authenticated;
