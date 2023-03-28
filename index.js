require("dotenv").config();
const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-body");
const koaStatic = require("koa-static");
const morgan = require("koa-morgan");
const respond = require("koa-respond");
const { initDatabase } = require("./database");
const router = require("./routes");
const app = new Koa();

app.use(morgan("dev"));
app.use(
  bodyParser({
    formLimit: "5mb",
    formidable: { uploadDir: "./uploads" },
    multipart: true,
    urlencoded: true,
  })
);
app.use(respond());
app.use(koaStatic(path.join(__dirname, "uploads")));
app.use(koaStatic(path.join(__dirname, "public")));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, async () => {
  console.log("Server up on http://localhost:4000");
  initDatabase();
});
