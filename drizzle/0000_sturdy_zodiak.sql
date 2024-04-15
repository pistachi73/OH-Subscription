CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `passwordResetToken` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`role` text NOT NULL,
	`totalChapters` integer DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT false,
	`teachers` text DEFAULT '',
	`categories` text DEFAULT '',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programsVideos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`programId` text NOT NULL,
	`videoId` text NOT NULL,
	`chapterNumber` integer NOT NULL,
	FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`bio` text NOT NULL,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `twoFactorConfirmation` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `twoFactorToken` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`image` text,
	`password` text,
	`role` text DEFAULT 'USER',
	`isTwoFactorEnabled` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `video` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`url` text DEFAULT '',
	`teachers` text DEFAULT '',
	`duration` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ss` ON `passwordResetToken` (`email`,`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `programsVideos_videoId_programId_chapterNumber_unique` ON `programsVideos` (`videoId`,`programId`,`chapterNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `twoFactorToken_email_token_unique` ON `twoFactorToken` (`email`,`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `verificationToken_email_token_unique` ON `verificationToken` (`email`,`token`);