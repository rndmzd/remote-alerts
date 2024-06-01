# remote-alerts

`remote-alerts` is a project that consists of a server-side Node.js application with Socket.IO and Express.js, a client-side React application, and an AWS Lambda function (to be added later). The server establishes connections with clients, handles countdown timer commands, and broadcasts the remaining time to all connected clients.

## Project Structure

```plaintext
remote-alerts/
├── README.md
├── amplify/                   # Amplify specific configuration and backend
├── package.json
├── packages/
│   ├── server/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── countdownTimer.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.js
│   ├── client/
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── index.tsx
│   │   │   ├── Countdown.tsx
│   │   │   └── styles.css
│   │   ├── public/
│   │   │   ├── index.html
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.js
├── .eslintrc.js
├── .prettierrc
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/remote-alerts.git
cd remote-alerts
```

2. Install dependencies for the root project and packages:

```bash
npm install
cd packages/server
npm install
cd ../client
npm install
```

### Running the Server

Navigate to the `server` directory and start the server in development mode:

```bash
cd packages/server
npm run dev
```

The server will start on `http://localhost:3000`.

### Running the Client

Navigate to the `client` directory and start the React application:

```bash
cd packages/client
npm start
```

The client will start on `http://localhost:4000` and connect to the Socket.IO server at `http://localhost:3000`.

## Usage

1. Open the client application in your browser at `http://localhost:4000`.
2. Click the "Connect to Server" button.
3. Click the "Start Countdown" button to start a 10-second countdown timer.
4. The server will broadcast the remaining time to all connected clients every second.

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- React
- TypeScript
- Webpack
- ESLint
- Prettier

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Future Plans

- Add AWS Lambda function code.
- Set up AWS Amplify for deployment.
- Implement additional features and improvements.

```

This README.md file provides an overview of the project, its structure, installation steps, and usage instructions. Adjust the repository URL and any other details as needed.
