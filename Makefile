all:
	docker-compose -f ./docker/docker-compose.yml up

clean:
	docker-compose -f ./docker/docker-compose.yml down

fclean:
	rm -rf ./data/database/*
	docker-compose -f ./docker/docker-compose.yml down --volumes --rmi all

re: fclean all

stop:
	docker kill $$(docker ps -q)

delete:
	docker container prune -f
	docker rmi $$(docker images -q)

show:
	docker container ls -a
	docker image ls -a