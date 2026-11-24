-- Insert the sample records only when their titles are not already present.
INSERT INTO records (title, category, description, status)
SELECT sample.title, sample.category, sample.description, sample.status
FROM (VALUES
  ('Cannot connect to campus Wi-Fi', 'Network', 'My laptop cannot connect to the campus wireless network.', 'Pending'),
  ('Printer not responding', 'Hardware', 'The printer in the computer laboratory is not responding.', 'In progress'),
  ('Forgotten student portal password', 'Account', 'I cannot sign in to the student portal because I forgot my password.', 'Pending'),
  ('Computer running slowly', 'Hardware', 'The laboratory computer takes a long time to open applications.', 'Completed'),
  ('Software installation request', 'Software', 'I need the approved programming software installed for coursework.', 'Pending'),
  ('Email access problem', 'Account', 'I cannot access my university email account.', 'In progress'),
  ('Network cable damaged', 'Network', 'The network cable at my workstation appears to be faulty.', 'Pending'),
  ('Projector display issue', 'Hardware', 'The classroom projector is not displaying the computer screen.', 'Completed')
) AS sample(title, category, description, status)
WHERE NOT EXISTS (
  SELECT 1 FROM records existing WHERE existing.title = sample.title
);
