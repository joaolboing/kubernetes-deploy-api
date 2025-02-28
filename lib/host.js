const cluster = process.env.CLUSTER;
var exec = require("child_process").exec;

async function deleteHost(req, res) {
  try {
    const body = req.body;
    const message = JSON.parse(body.Message);
    const instanceId = message.EC2InstanceId;

    const node = await getKubectlNode(instanceId);
    const nodeName = node.metadata.name;
    await removeNode(nodeName);
    res.status(200).json({ status: 200, message: "ok", node });
  } catch (e) {
    res.status(500).json({ status: 500, message: "error" });
  }
}

function removeNode(nodeName) {
  return new Promise((resolve, reject) => {
    exec(
      `kubectl --kubeconfig=${cluster} delete node ${nodeName}`,
      function (err, stdout) {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

async function getKubectlNode(instanceId) {
  const nodes = await getKubectlNodes();

  const node = nodes.find((node) => {
    return node.metadata.labels["instanceId"] === instanceId;
  });

  return node;
}

function getKubectlNodes() {
  return new Promise((resolve, reject) => {
    exec(
      `kubectl --kubeconfig=${cluster} get nodes -o json`,
      function (err, stdout) {
        if (err) {
          reject(err);
        } else {
          const nodes = JSON.parse(stdout);
          resolve(nodes.items);
        }
      }
    );
  });
}
module.exports = { deleteHost };
