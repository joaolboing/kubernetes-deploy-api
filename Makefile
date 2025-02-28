IMAGE=docker.conectra.com.br/conectra/kubernetes-deploy-api:latest


build:
	docker build --rm -t $(IMAGE) .
	docker push $(IMAGE)

deploy:
	curl -k -X POST -H "Content-Type: application/json" -d '{"image": "$(IMAGE)"}' "https://kub.conectra.com.br/default/kube-deploy-api"
