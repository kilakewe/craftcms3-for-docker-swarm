# Craft CMS for Docker Swarm

## How it works?

When you run `docker-conmpose build`, docvker will install all the required packages from php/nginx torun and serve up the website. It then copies all of the files from the **src** folder into the nginx image (for lignting fast asset serving) and php.

If you run `docker-compose push` the images are pushed into the registry for the docker swarm servers to call (or automatically re-deploy).

## Setting up your local environment

To get started with your local environment, simply run docker-compose up. This will run a local instance of CraftCMS, Nginx, MariaDB and phpmyadmin.

Just run `docker-compose up` (add -d to run it in the background) to start the containers. You will need to visit the craft cms install page to set the databse up for the first time.

If you run `docker ps`, it will show you any containers that you have running and what ports are being mapped to localhost. Find your new nginx container and the port that it automatically assigned, and then appened it to the end of your localhost url e.g. *http://localhost:**32123**/admin/install*

## Only the database is persistent

Due to the nature of coloud computing, only the database will survuve container upgrades. This is to allow better scaling across the docker swarm servers. So how do you let your users upload their own content? Use AWS S3 storage.

By default, the aws s3 plugin will be installed. This will require an access key, secret token and a bucket with the correct policy to allow you to access it. Remember, access tokens should **NEVER** be shared between environments. This is also to prevent accidentally exposing information that was only meant for testing and to keep our client's data secure.

## Craft CMS plugins

Craft CMS plugins will need to be added as a part of the deployment process so that all our scaled nodes will have access to the same modules. To include a new plugin, add it to the compose.json file in the root directory.
