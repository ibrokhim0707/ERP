const express = require("express");
const path = require("node:path");
const seesion = require("express-session");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const config = require("./shared/config");
const routes = require("./routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use("/static", express.static(path.join(__dirname, "..", "public")));
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(
  seesion({
    name: "session_id",
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true, // faqat http o'qiy oladi, javascript o'qiy olmaydi, xavfsizlik uchun
      maxAge: config.session.duration, // qancha vaqt session davom etsin
      // maxAge: 10 * 1000
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  res.locals.error = req.flash("error");

  next();
});

app.use(routes);

app.use((req, res) => {
  res.render("not-found", { layout: "layouts/auth" });
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
