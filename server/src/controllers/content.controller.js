const { OK } = require("../core/success.response");
const Content = require("../models/content.model");
const { BadRequestError } = require("../core/error.response");

class ContentController {
  getAll = async (req, res) => {
    const contents = await Content.find().sort({ key: 1 });
    return new OK({ message: "OK", metadata: contents }).send(res);
  };

  getByKey = async (req, res) => {
    const { key } = req.params;
    const entry = await Content.findOne({ key });
    return new OK({ message: "OK", metadata: entry }).send(res);
  };

  update = async (req, res) => {
    const { key } = req.params;
    const { title, text, image, subtext, image2, image3, steps, items } = req.body;
    if (!key) throw new BadRequestError("Key is required");
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (text !== undefined) updateData.text = text;
    if (image !== undefined) updateData.image = image;
    if (subtext !== undefined) updateData.subtext = subtext;
    if (image2 !== undefined) updateData.image2 = image2;
    if (image3 !== undefined) updateData.image3 = image3;
    if (steps !== undefined) updateData.steps = steps;
    if (items !== undefined) updateData.items = items;
    const updated = await Content.findOneAndUpdate(
      { key }, updateData,
      { upsert: true, new: true }
    );
    return new OK({ message: "Updated", metadata: updated }).send(res);
  };
}

module.exports = new ContentController();
