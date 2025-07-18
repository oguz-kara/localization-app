-- Seed common languages
INSERT INTO "Language" (id, code, name, "nativeName", "isActive", "createdAt", "updatedAt")
VALUES 
  ('clzp1000000', 'en', 'English', 'English', true, NOW(), NOW()),
  ('clzp1000001', 'es', 'Spanish', 'Español', true, NOW(), NOW()),
  ('clzp1000002', 'fr', 'French', 'Français', true, NOW(), NOW()),
  ('clzp1000003', 'de', 'German', 'Deutsch', true, NOW(), NOW()),
  ('clzp1000004', 'it', 'Italian', 'Italiano', true, NOW(), NOW()),
  ('clzp1000005', 'pt', 'Portuguese', 'Português', true, NOW(), NOW()),
  ('clzp1000006', 'ru', 'Russian', 'Русский', true, NOW(), NOW()),
  ('clzp1000007', 'ja', 'Japanese', '日本語', true, NOW(), NOW()),
  ('clzp1000008', 'ko', 'Korean', '한국어', true, NOW(), NOW()),
  ('clzp1000009', 'zh', 'Chinese', '中文', true, NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  "nativeName" = EXCLUDED."nativeName",
  "updatedAt" = NOW();