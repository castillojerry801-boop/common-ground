create policy "contact_submissions_delete_authenticated"
  on contact_submissions for delete
  using (auth.uid() is not null);
