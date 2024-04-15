ALTER TABLE video ADD `transcript` text DEFAULT '';--> statement-breakpoint
ALTER TABLE video ADD `categories` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `video` DROP COLUMN `teachers`;