CREATE TABLE IF NOT EXISTS "art" (
  "id" INTEGER,
  "createdAt" INTEGER,
  "mediaId" INTEGER NOT NULL,
  "url" TEXT NOT NULL UNIQUE,
  "type" TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT),
  FOREIGN KEY("mediaId") REFERENCES "media"("id")
);

CREATE TABLE IF NOT EXISTS "media_streams" (
  "id" INTEGER,
  "mediaId" INTEGER NOT NULL,
  "index" INTEGER NOT NULL,
  "aspectRatio" TEXT,
  "channelLayout" TEXT,
  "channels" INTEGER,
  "codec" TEXT NOT NULL,
  "frameRate" INTEGER,
  "height" INTEGER,
  "lang" TEXT,
  "level" INTEGER,
  "pixelFormat" TEXT,
  "profile" TEXT,
  "sampleRate" INTEGER,
  "timeBase" TEXT,
  "type" TEXT NOT NULL,
  "width" INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT),
  FOREIGN KEY("mediaId") REFERENCES "media"("id")
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" INTEGER,
  "parentId" INTEGER,
  "createdAt" INTEGER NOT NULL,
  "lastUpdatedAt" INTEGER,
  "importedAt" INTEGER NOT NULL,
  "url" TEXT NOT NULL UNIQUE,
  "title" TEXT,
  "mediaType" TEXT NOT NULL,
  "mimeType" TEXT,
  "size" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "container" TEXT,
  "bitRate" INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT),
  FOREIGN KEY("parentId") REFERENCES "media"("id")
);
