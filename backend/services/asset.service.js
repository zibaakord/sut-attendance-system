const fs = require("fs/promises");
const path = require("path");
const db = require("../config/database");

const TABLE_NAME = "media_assets";

const DEFAULT_ASSETS = [
  {
    key: "logo",
    mimeType: "image/png",
    filePath: path.resolve(__dirname, "../../frontend/assets/images/logos/sut-logo.png"),
  },
  {
    key: "favicon",
    mimeType: "image/png",
    filePath: path.resolve(__dirname, "../../frontend/assets/images/logos/favicon.png"),
  },
  {
    key: "hero-background",
    mimeType: "image/jpeg",
    filePath: path.resolve(__dirname, "../../frontend/assets/images/backgrounds/by-night.jpg"),
  },
];

const ensureTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS public.${TABLE_NAME} (
      id SERIAL PRIMARY KEY,
      asset_key VARCHAR(100) NOT NULL UNIQUE,
      mime_type VARCHAR(100) NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const assetExists = async (key) => {
  const result = await db.query(
    `SELECT 1 FROM public.${TABLE_NAME} WHERE asset_key = $1 LIMIT 1`,
    [key]
  );
  return result.rows.length > 0;
};

const upsertAsset = async ({ key, mimeType, data }) => {
  await db.query(
    `
    INSERT INTO public.${TABLE_NAME} (asset_key, mime_type, data, updated_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (asset_key)
    DO UPDATE SET
      mime_type = EXCLUDED.mime_type,
      data = EXCLUDED.data,
      updated_at = NOW()
  `,
    [key, mimeType, data]
  );
};

const seedDefaultAssets = async () => {
  await ensureTable();

  for (const asset of DEFAULT_ASSETS) {
    const alreadyExists = await assetExists(asset.key);

    try {
      const data = await fs.readFile(asset.filePath);
      await upsertAsset({
        key: asset.key,
        mimeType: asset.mimeType,
        data,
      });
    } catch (error) {
      // If local files are removed after first seed, keep serving already-stored DB assets.
      if (error.code === "ENOENT" && alreadyExists) {
        continue;
      }
      if (error.code === "ENOENT" && !alreadyExists) {
        throw new Error(`Missing source file for asset "${asset.key}": ${asset.filePath}`);
      }
      throw error;
    }
  }
};

const getAssetByKey = async (key) => {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) return null;

  const result = await db.query(
    `SELECT asset_key, mime_type, data FROM public.${TABLE_NAME} WHERE asset_key = $1`,
    [normalizedKey]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0];
};

module.exports = {
  seedDefaultAssets,
  getAssetByKey,
};
