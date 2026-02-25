const { getAssetByKey } = require("../services/asset.service");

const getAsset = async (req, res) => {
  try {
    const asset = await getAssetByKey(req.params.key);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.setHeader("Content-Type", asset.mime_type);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(asset.data);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAsset };

