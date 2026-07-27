-- Script de migration MongoDB → Supabase (PostgreSQL)
-- Exécute ce script dans le SQL Editor du dashboard Supabase
-- (Supabase Dashboard → SQL Editor → New query → Coller → Run)

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Actor
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "cv" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Video
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Photocard
CREATE TABLE "Photocard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photocard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: User unique constraints
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insérer les admins (password: admin123)
INSERT INTO "User" ("id", "username", "email", "password", "role")
VALUES
  (gen_random_uuid()::text, 'admin', 'admin@grct-cinema.com', '$2a$10$bJMpC4OnPWZ2iSOHoUIYiO9FlCgazFFuUIJpLqdo1YMpt.53rWgkq', 'admin'),
  (gen_random_uuid()::text, 'admin2', 'admin2@grct-cinema.com', '$2a$10$bJMpC4OnPWZ2iSOHoUIYiO9FlCgazFFuUIJpLqdo1YMpt.53rWgkq', 'admin')
ON CONFLICT (username) DO NOTHING;
