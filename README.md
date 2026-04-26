# ReneuBio Homepage

This repository contains the static website files and assets for the ReneuBio homepage, including the main landing page, biological models, and team information.

## Project Structure

The project consists of static HTML, CSS, and JavaScript files:
- `index.html`: The main landing page.
- `aged_biology.html`, `roi_model.html`: Specific model/biology pages.
- `styles.css`, `index.css`: Styling files.
- `main.js`, `model.js`: JavaScript logic.
- `assets/`: Contains images, logos, and team photos used across the site.

## Running the Web Application

The site is served using Python's built-in HTTP server. We provide utility scripts to manage the lifecycle of the web server in the background.

### Start the Server
To start the server in the background on port `3000`:
```bash
./start.sh
```
This will start the server, save the logs to `server.log`, and the process ID to `server.pid`. You can view the site at `http://localhost:3000`.

### Stop the Server
To stop the running server:
```bash
./stop.sh
```
This script reads the `server.pid` and gracefully kills the process.

### Restart the Server
To restart the server (stops and then starts again):
```bash
./restart.sh
```

## Logs
All server access logs and errors are output to `server.log`. You can view them by running:
```bash
tail -f server.log
```
