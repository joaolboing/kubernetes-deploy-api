var exec = require("child_process").exec;

function deleteHost(req, res) {
  const body = req.body;

  console.log(body);

  res.status(200).json({ status: 200, message: "ok" });
}

module.exports = { deleteHost };
