source .env

echo "[DEBUG] Deploying to Digital Ocean"
tar -cvf server.tar --exclude=node_modules .
scp -i $SSH_KEY server.tar server.sh $SSH_USER@$SSH_HOST:~/

ssh $SSH_USER@$SSH_HOST -i $SSH_KEY << EOF
  chmod +x server.sh
  ./server.sh
  rm server.sh
EOF