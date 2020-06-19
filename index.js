var express = require('express')
var bodyParser = require('body-parser')
var exec = require('child_process').exec
var app = new express()

var cluster = process.env.CLUSTER

app.use(bodyParser.json())

var router = new express.Router()

router.get('/', function (req, res) {
  res.send(
    'Usage: curl -X POST /{namespace}/{deployment} -H "Content-Type: application/json" -d \'{"image":}\'"<image:tag>" '
  )
})
router.post('/:ns/:deploy', function (req, res) {
  var ns = req.params.ns
  var deploy = req.params.deploy
  var image = req.body.image

  if (!ns || !deploy || !image) {
    return res
      .status(500)
      .json({ status: 500, message: 'You must pass all params' })
  }

  var deploymentSpec = {
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: deploy,
              image: image,
              env: [{ name: 'DEPLOY_DATE', value: Date().toString() }]
            }
          ]
        }
      }
    }
  }

  exec(
    `kubectl --kubeconfig=${cluster} --namespace ${ns} patch deploy ${deploy} -p '${JSON.stringify(deploymentSpec)}' --record`,
    function (err) {
      if (err) {
        console.log(err)
        res.status(500).json(err)
      } else {
        res.status(200).json({ status: 200, ns, deploy, image })
      }
    }
  )
})

app.use(router)

app.listen(3000, function () {
  console.log('App listening on port 3000')
})
