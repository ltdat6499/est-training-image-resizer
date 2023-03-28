const VERSION = "v1";
const { Op } = require("sequelize");
const fs = require("fs");
const faker = require("faker");
const sharp = require("sharp");
const Router = require("koa-router");
const db = require("../database/models");
const router = new Router();

const resizer = async (file, name) => {
  const path = file.path;
  await sharp(path)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(async (data) => {
      await fs.writeFileSync(__dirname + `/../images/originals/${name}`, data);
    });
  await sharp(path)
    .resize(512)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(async (data) => {
      await fs.writeFileSync(__dirname + `/../images/converted/${name}`, data);
      await fs.writeFileSync(__dirname + `/../public/${name}`, data);
    });
};

router.post(`/${VERSION}/images`, async (ctx, next) => {
  const files = [].concat(ctx.request.files[""]);
  const results = [];
  for (const file of files) {
    if (file.type === "image/jpeg") {
      const imageName = faker.internet.password() + ".jpg";
      await resizer(file, imageName);
      const _dataInfo = {
        size: file.size,
        name: file.name,
        type: file.type,
        lastModifiedDate: file.lastModifiedDate,
        tempPath: file.path,
      };
      const data = await db.Image.create({
        name: imageName,
        dataInfo: _dataInfo,
      });
      results.push(data.dataValues);
    }
    await fs.unlinkSync(file.path);
  }

  ctx.body = {
    message: `update complete ${results.length}, failed ${
      files.length - results.length
    }`,
    data: results,
  };
});

router.get(`/${VERSION}/images/:name`, async (ctx, next) => {
  const imageName = ctx.params.name;
  if (!imageName) {
    ctx.status = 400;
    ctx.body = { error: { message: "invalid image name" } };
    return;
  }
  const result = await db.Image.findOne({ where: { name: ctx.params.name } });
  if (!result) {
    ctx.status = 404;
    ctx.body = { error: { message: "image not found" } };
    return;
  }
  ctx.attachment(__dirname + `/../public/${imageName}`);
  ctx.type = "application/image";
  const stream = fs.createReadStream(`${process.cwd()}/public/${imageName}`);
  ctx.ok(stream);
});

module.exports = router;
