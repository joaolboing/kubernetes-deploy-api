const exec = require("child_process").exec;
const cluster = process.env.CLUSTER;

function scale(req, res) {
  const ns = req.params.ns;
  const deployment = req.params.deploy;
  const replicas = req.body.replicas;

  if (!ns || !deployment || !replicas) {
    return res
      .status(500)
      .json({ status: 500, message: "You must pass all params" });
  }

  exec(
    `kubectl --kubeconfig=${cluster} --namespace ${ns} scale deploy ${deployment} --replicas=${replicas}`,
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.status(200).json({ status: 200, ns, deploy: deployment, replicas });
      }
    }
  );
}

module.exports = { scale };
