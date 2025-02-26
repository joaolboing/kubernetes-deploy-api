const exec = require("child_process").exec;
const cluster = process.env.CLUSTER;

function deploy(req, res) {
  const ns = req.params.ns;
  const deployment = req.params.deploy;
  const image = req.body.image;

  if (!ns || !deployment || !image) {
    return res
      .status(500)
      .json({ status: 500, message: "You must pass all params" });
  }

  const deploymentSpec = {
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: deployment,
              image: image,
              env: [{ name: "DEPLOY_DATE", value: Date().toString() }],
            },
          ],
        },
      },
    },
  };

  exec(
    `kubectl --kubeconfig=${cluster} --namespace ${ns} patch deploy ${deployment} -p '${JSON.stringify(
      deploymentSpec
    )}' --record`,
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.status(200).json({ status: 200, ns, deploy: deployment, image });
      }
    }
  );
}

module.exports = { deploy };
