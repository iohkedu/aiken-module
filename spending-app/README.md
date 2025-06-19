# Project Name

This project requires setting up some dependencies before it can run. Follow the steps below to get everything up and running.

## Requirements

**Blockfrost API Key**:
You'll need a Blockfrost API key. You can obtain one by creating an account at [Blockfrost.io](https://blockfrost.io/).

## Setup Steps

1. **Configure the .env.local file**:

   Create a `.env.local` file in the `spending-app` directory and add the following variable:
```
NEXT_PUBLIC_BLOCKFROST_API_KEY=YOUR_BLOCKFROST_API_KEY
```

   Make sure to replace `YOUR_BLOCKFROST_API_KEY` with the real key you obtained from Blockfrost.

2. **Install dependencies**:

``` bash
npm install
```

3. **Start the server**:

``` bash
npm run dev
```

## Usage

Once the server is running, open your browser and go to http://localhost:3000.
