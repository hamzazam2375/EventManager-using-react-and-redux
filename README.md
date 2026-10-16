# Event Manager

This is a simple Event Management app made with React, Redux Toolkit and React Router. Events are loaded from the Ticketmaster Discovery API.

You can sign up, log in, browse events, open event details, register for an event, and see your registered events on the My Events page.

## How to run

1. Clone the repo and open the folder.

2. Install the packages using:

```
npm install
```

3. Get a Ticketmaster API key from:
https://developer.ticketmaster.com/

4. Create a `.env` file in the root folder (same place as `package.json`) and add your key:

```
VITE_TICKETMASTER_API_KEY=your_api_key_here
```

You can also copy `.env.example` and paste your key there.

5. Start the app:

```
npm run dev
```

Then open the link shown in the terminal (usually http://localhost:5173).

## Notes

- Login is frontend only. Users are saved in local storage, there is no real backend.
- Don’t commit the `.env` file. It contains your API key.
