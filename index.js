const express = require("express");
const { deploy } = require("./lib/deploy");
const { deleteHost } = require("./lib/host");
const app = new express();

var router = new express.Router();

router.get("/", function (req, res) {
  res.send(
    'Usage: curl -X POST /{namespace}/{deployment} -H "Content-Type: application/json" -d \'{"image":}\'"<image:tag>" '
  );
});

router.use(function (req, res, nxt) {
  const json_parser_options = {
    type: ["json", "*+json", "*/json", "application/json"],
    strict: true,
    limit: "5mb",
  };
  if (/Amazon/i.test(req.header("user-agent"))) {
    json_parser_options.type.push("text/*");
  }
  express.json(json_parser_options)(req, res, nxt);
});

router.post("/host/delete", deleteHost);
router.post("/:ns/:deploy", deploy);

app.use(router);

var server = app.listen(3000, function () {
  console.log("App listening on port 3000");
});

process.on("SIGINT", function () {
  server.close();
});
