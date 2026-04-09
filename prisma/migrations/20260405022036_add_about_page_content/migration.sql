-- CreateTable
CREATE TABLE "AboutPageSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heroTagline" TEXT NOT NULL DEFAULT 'About Us',
    "heroTitle1" TEXT NOT NULL DEFAULT 'Rooted in Passion,',
    "heroTitle2" TEXT NOT NULL DEFAULT 'Grown with Purpose',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'A sole-practitioner landscape and hardscape design studio serving residential properties throughout the Wasatch Front, Utah.',
    "heroImageUrl" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80',
    "storyImageUrl" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    "storyHeading" TEXT NOT NULL DEFAULT 'Where Every Landscape Tells a Story',
    "storyParagraph1" TEXT NOT NULL DEFAULT 'Juniper Ridge Landscape was built on a simple belief: every outdoor space has the potential to become something extraordinary. I started this studio to offer homeowners throughout the Wasatch Front a thoughtful, personal approach to landscape and hardscape design.',
    "storyParagraph2" TEXT NOT NULL DEFAULT 'I spent years studying horticulture and design before establishing Juniper Ridge, bringing a blend of technical knowledge and artistic vision to every project. I believe great landscape design isn''t just about aesthetics — it''s about creating spaces that enhance how you live and suit the unique character of Utah''s environment.',
    "storyParagraph3" TEXT NOT NULL DEFAULT 'As a one-person studio, I''m involved in every project from the very first site visit through the final set of construction drawings. You''ll always work directly with me — no handoffs, no middlemen.',
    "teamSectionLabel" TEXT NOT NULL DEFAULT 'The Designer',
    "teamSectionTitle" TEXT NOT NULL DEFAULT 'Meet the Designer',
    "teamSectionSubtitle" TEXT NOT NULL DEFAULT 'A solo practice — you work directly with me on every project.',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AboutService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iconKey" TEXT NOT NULL DEFAULT 'sustainability',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "AboutTeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);
