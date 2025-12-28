-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "tgUserId" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublicWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PublicWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrivateWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "PrivateWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "privateWalletPublicKey" TEXT NOT NULL,
    "privateWalletPrivateKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PublicWalletTransaction" (
    "id" TEXT NOT NULL,
    "publicWalletId" TEXT NOT NULL,

    CONSTRAINT "PublicWalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrivateWalletTransaction" (
    "id" TEXT NOT NULL,
    "privateWalletId" TEXT NOT NULL,

    CONSTRAINT "PrivateWalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_tgUserId_key" ON "public"."Users"("tgUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicWallet_userId_key" ON "public"."PublicWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateWallet_UserId_key" ON "public"."PrivateWallet"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_secret_key" ON "public"."Coupon"("secret");

-- AddForeignKey
ALTER TABLE "public"."PublicWallet" ADD CONSTRAINT "PublicWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateWallet" ADD CONSTRAINT "PrivateWallet_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PublicWalletTransaction" ADD CONSTRAINT "PublicWalletTransaction_publicWalletId_fkey" FOREIGN KEY ("publicWalletId") REFERENCES "public"."PublicWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrivateWalletTransaction" ADD CONSTRAINT "PrivateWalletTransaction_privateWalletId_fkey" FOREIGN KEY ("privateWalletId") REFERENCES "public"."PrivateWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
