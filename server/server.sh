#save to variable boolean
express_server=$(ls | grep express-server | wc -l)
if [ $express_server -eq "1" ]; then
  echo "[DEBUG] 'express-server' exists. Removing old express-server"
  rm -rf express-server
else
  echo "[DEBUG] 'express-server' does not exist."
fi

# remove old server
echo "[DEBUG] Removing old server"
mkdir express-server
mv server.tar express-server
cd express-server
tar -xvf server.tar
rm server.tar

# remove old docker container
echo "[DEBUG] Removing old docker container"
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# build and run new docker container
echo "[DEBUG] Building and running new docker container"
docker build -t d-vision-server .
docker run --publish 3000:3000 --detach d-vision-server

# send a curl request to the server, if it returns a 200, then the server is up
echo "[DEBUG] Sending curl request to server"
# wait 2 seconds for server to start
sleep 2
response=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:3000/ping)
if [ $response -eq "200" ]; then
  echo "Server is up"
else
  echo "Server is down"
  exit
fi