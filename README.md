# Remote Alerts

## Overview

Remote Alerts is a project designed to manage and trigger alerts through a web interface. It includes a countdown timer, basic authentication, and the ability to handle alerts via an ESP32-S3 microcontroller. The project is structured as a monorepo containing a server-side Node.js script, a client-side React frontend, and code for an ESP32-S3 microcontroller.

## Project Structure

```markdown
remote-alerts/
│
├── packages/
│ ├── server/
│ │ ├── src/
│ │ │ ├── index.ts
│ │ │ └── ... (other server files)
│ │ ├── package.json
│ │ └── ... (other server configuration files)
│ ├── client/
│ │ ├── src/
│ │ │ ├── App.tsx
│ │ │ ├── Countdown.tsx
│ │ │ ├── index.tsx
│ │ │ └── ... (other client files)
│ │ ├── public/
│ │ │ ├── index.html
│ │ │ └── ... (other public files)
│ │ ├── package.json
│ │ └── ... (other client configuration files)
│ └── esp32/
│ ├── device.py
│ └── ... (other ESP32 files)
│
├── README.md
└── ... (other root files)
```

## Features

### Server

- **Node.js with Express and Socket.io**: The server uses Express for handling HTTP requests and Socket.io for real-time communication with the client.
- **Countdown Timer**: The server manages a countdown timer that can be started, stopped, and reset by the client.
- **Basic Authentication**: The server uses basic authentication to protect endpoints.

### Client

- **React Frontend**: The client is built using React and communicates with the server via Socket.io.
- **Responsive Design**: The client interface is responsive and includes features such as a countdown timer and authentication forms.
- **Start Countdown Delay**: After an alert is triggered or the countdown is stopped, the "Start Countdown" button is disabled for 10 seconds, showing the remaining wait time.

### ESP32-S3

- **MicroPython with Microdot**: The ESP32-S3 runs a MicroPython script using the Microdot library to handle HTTP requests.
- **GPIO Control**: The ESP32-S3 can trigger alerts by controlling GPIO pins.
- **Basic Authentication**: The ESP32-S3 server uses basic authentication for all routes.

## Installation and Setup

### Prerequisites

- Node.js (for server and client)
- Python with MicroPython (for ESP32-S3)
- npm (Node Package Manager)

### Setting Up the Server

1. Navigate to the server directory:

   ```bash
   cd remote-alerts/packages/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in the server directory and add environment variables

   ```
   CORS_ORIGIN=client_app_url
   JWT_SECRET=jwt_secret_for_user_authentication
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Setting Up the Client

1. Navigate to the client directory:

   ```bash
   cd remote-alerts/packages/client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in the client directory and add environment variables

   ```
   SOCKETIO_HOST=socketid_host
   DEVICE_URL=ngrok_agent_url
   NGROK_USERNAME=your_ngrok_username
   NGROK_PASSWORD=your_ngrok_password
   ```

4. Start the client:
   ```bash
   npm start
   ```

### Setting Up the ESP32-S3

1. Flash MicroPython firmware to the ESP32-S3.
2. Upload `device.py` and other necessary files to the ESP32-S3. Rename to `main.py` if you would like the device code to run automatically.
3. Ensure the Ngrok agent is configured to point to the ESP32-S3.

## Usage

1. **Start the Server**: Run the server to handle client requests and manage the countdown timer.
2. **Start the Client**: Open the client in a web browser to interact with the server.
3. **Start the Ngrok agent**: Configure and start the Ngrok agent on the same network as the hardware device.
4. **Control the ESP32-S3**: The ESP32-S3 will handle HTTP requests to trigger alerts based on the server's commands.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributions

Contributions are welcome! Please create a pull request with detailed information about your changes.

## Changelog

### v1.0.1

- Added delay functionality to the "Start Countdown" button after an alert is triggered or the countdown is stopped.
- Implemented basic authentication for the ESP32-S3 server.
- Enhanced client interface to display the remaining wait time on the "Start Countdown" button.

### v1.0.0

- Initial release with server, client, and ESP32-S3 functionality.
