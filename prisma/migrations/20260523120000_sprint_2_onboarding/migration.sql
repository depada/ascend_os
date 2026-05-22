-- CreateTable
CREATE TABLE `user_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `currentIdentity` VARCHAR(191) NOT NULL,
    `desiredIdentity` VARCHAR(191) NOT NULL,
    `weeklyReviewDay` VARCHAR(191) NOT NULL,
    `intensityLevel` VARCHAR(191) NOT NULL,
    `availableTimePerDayMinutes` INTEGER NOT NULL,
    `availableTimePerWeekMinutes` INTEGER NOT NULL,
    `preferredExecutionStyle` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile_items` (
    `id` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `kind` ENUM('PRIMARY_GOAL', 'DOMAIN', 'SKILL', 'LANGUAGE', 'PLATFORM', 'DAILY_MINIMUM', 'CONSTRAINT') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_profile_items_profileId_kind_idx`(`profileId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile_items` ADD CONSTRAINT `user_profile_items_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `user_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;