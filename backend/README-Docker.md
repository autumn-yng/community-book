# How I used Docker without Docker Desktop
brew install docker, colima, Docker-credential-helper, buildx

docker build didn't work until I added add  "credsStore": "osxkeychain" to the docker config file as suggested in https://docs.altinn.studio/community/contributing/handbook/docker/without-docker-desktop/macos/

To get an image URL to deploy on Render, I need to push the docker image to Docker Hub. So I need to create an account on Docker Hub website, then docker login in Terminal and authenticate myself.

# Commands
The command that resulted in the first successful image: 
docker build --platform linux/amd64 -t comm-book:1 
Note: 
- build on amd64 even when the base image and other layers are built on arm64, because Render requires docker images to be built with linux/amd64.
- we have to wait longer than usual, probably because of the platform emulation; even if we already see the image in docker images, docker image history comm-book:1 may fail if the image actually hasn’t finished running yet, so wait a bit and try again.


The command that resulted in the first container that successfully connects to database and doesn't quite immediately:
docker run --rm --name 1244pm \
  --env-file .env \
  -e DB_HOST=host.docker.internal \
  --platform linux/amd64 \
  -p 8080:8080 \
  autumnyng/comm-book:1
Note: 
— --rm will make this container be removed after it runs


docker push autumnyng/comm-book:1


# Solution to issue: docker container unable to connect to database
1) Need to allow connection from outside localhost (i.e. from the Docker container of the backend instead of the local backend):
- psql postgres, then SHOW config_file, then copy the path, then nano /opt/homebrew/var/postgresql@16/postgresql.conf, then change listen_addresses from “localhost” to “*”.
-  nano /opt/homebrew/var/postgresql@16/pg_hba.conf then add host    all             all             0.0.0.0/0           md5 to the list at the end of the file. 

2) Need to ensure database credentials are correct in environment variables -- one option is to set them explicitly like in the docker run command above.