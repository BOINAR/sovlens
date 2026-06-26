-- =====================================================
-- Sovlens
-- Script SQL de création de la base de données
-- PostgreSQL 18
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE storage_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    mode VARCHAR(20) NOT NULL,
    endpoint TEXT,
    bucket VARCHAR(255),
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_storage_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE photos (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    object_key TEXT NOT NULL,
    storage_mode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_photo_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE albums (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_album_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE album_photos (
    album_id UUID NOT NULL,
    photo_id UUID NOT NULL,

    PRIMARY KEY (album_id, photo_id),

    CONSTRAINT fk_albumphoto_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_albumphoto_photo
        FOREIGN KEY (photo_id)
        REFERENCES photos(id)
        ON DELETE CASCADE
);

CREATE TABLE share_links (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    photo_id UUID,
    album_id UUID,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_share_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_share_photo
        FOREIGN KEY (photo_id)
        REFERENCES photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_share_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Index
-- =====================================================

CREATE INDEX idx_photos_user
ON photos(user_id);

CREATE INDEX idx_photos_storage
ON photos(storage_mode);

CREATE INDEX idx_albums_user
ON albums(user_id);

CREATE INDEX idx_album_photos_album
ON album_photos(album_id);

CREATE INDEX idx_album_photos_photo
ON album_photos(photo_id);

CREATE INDEX idx_share_links_user
ON share_links(user_id);

CREATE INDEX idx_share_links_photo
ON share_links(photo_id);

CREATE INDEX idx_share_links_album
ON share_links(album_id);

CREATE INDEX idx_storage_profiles_mode
ON storage_profiles(mode);