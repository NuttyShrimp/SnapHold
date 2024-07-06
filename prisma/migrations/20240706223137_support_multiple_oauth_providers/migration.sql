/*
  Warnings:

  - You are about to drop the column `oauthId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `oauthProvider` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "oauthId",
DROP COLUMN "oauthProvider";

-- CreateTable
CREATE TABLE "oauth_users" (
    "user_id" TEXT NOT NULL,
    "oauthId" VARCHAR(255) NOT NULL,
    "oauthProvider" VARCHAR(255) NOT NULL,

    CONSTRAINT "oauth_users_pkey" PRIMARY KEY ("user_id","oauthProvider")
);

-- AddForeignKey
ALTER TABLE "oauth_users" ADD CONSTRAINT "oauth_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
