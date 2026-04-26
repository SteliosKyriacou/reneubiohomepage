#!/bin/bash
cd "$(dirname "$0")"
if [ -f server.pid ]; then
  PID=$(cat server.pid)
  if kill -0 $PID 2>/dev/null; then
    kill $PID
    echo "Webapp stopped (PID: $PID)"
  else
    echo "Process with PID $PID is not running."
  fi
  rm server.pid
else
  echo "server.pid not found. Is the webapp running?"
  # Fallback to kill any python http.server on 3000
  pkill -f "python3 -m http.server 3000" && echo "Killed orphaned python http.server processes." || echo "No orphaned processes found."
fi
