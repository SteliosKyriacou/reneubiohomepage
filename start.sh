#!/bin/bash
cd "$(dirname "$0")"
nohup python3 -m http.server 3000 > server.log 2>&1 &
echo $! > server.pid
echo "Webapp started on port 3000 in the background. PID: $(cat server.pid)"
