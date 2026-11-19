# tinyrsc

A simple, some might say simplistic, React Server Components micro-framework, based on [Vite's RSC plugin, `@vitejs/plugin-rsc`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc).

## Why

I have been developing a learning tool, [lilt](https://github.com/nickw1/lilt), for a while. Originally using JSON APIs and client-side React, I subsequently decided to incorporate RSCs and server functions making use of [`@lazarv/react-server`](https://github.com/lazarv/react-server), a great independently-developed RSC framework. Unfortunately earlier this year, this framework moved to read-only mode, and being concerned about maintenance issues I decided to eventually look into other options.

## `@vitejs/plugin-rsc` - Vite's RSC plugin

Rather than use another, larger framework such as Next.js I discovered Vite's low level RSC plugin, which provides a firm foundation on which to develop your own framework. I thought it might be a fun exercise to find out more about RSCs in more detail by making use of `@vitejs/plugin-rsc` and building upon it to produce a micro-framework featuring all the key RSC features - RSCs themselves, client components, server functions (server actions) and a filesystem-based router. An invaluable starting-point was [this article](https://www.aha.io/engineering/articles/why-we-rolled-our-own-rsc-framework) from Josh Wilson of Aha! Engineering which discusses the fundamentals of getting started with the Vite RSC plugin. After playing around for quite a while and encountering a number of issues along the way, I finally produced something which would fulfil my own needs for a micro-framework. You can find the experiments [at this repo](https://github.com/nickw1/vite-rsc-expts).


## Features of tinyrsc

As stated above, `tinyrsc` is a very small and minimalist micro-framework. It does not try to do more than what I'd consider the absolute fundamentals of RSCs, i.e. RSCs themselves, server-side rendering, client components, server functions, a filesystem router (easy due to the Vite plugin's globbing API) and component refresh.

It's intended to be used not as something to handle all your app needs, but to focus on the RSC and React part of your app and that alone. It's intended to be used with a standard server framework (it works nicely with Express) and the philosophy is to leave that standard server framework to handle common app tasks such as authentication, middleware, and so on.


## Sample code

Full documentation will follow. For now, here is a sample using Express. Note that you add your React components to the `src` directory; in future, this will be configurable, but not
just yet. So if you create an `index.tsx` RSC in `src`, this will become your app's main
index page, and any subdirectories are mapped to URLs with filesystem routing. So for example an `index.tsx` inside the subdirectory `about` will be accessible via the `/about` endpoint.

```typescript
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { init } from 'tinyrsc';
import { createRequest, sendResponse } from '@remix-run/node-fetch-server';

const PORT = 3000;

const app = express();

// Serve generated assets
app.get(/assets\/.*$/, express.static('dist/client'));

// Initialise tinyrsc. This will check whether NODE_ENV is "development" or "production".
// If "development", it will spin up a Vite dev server to handle your requests.
// If "production", it will return an object containing a tinyrsc RequestHandler.
const { requestHandler } = await init(app);
// If we have a request handler (i.e. we are in production mode...)
if (requestHandler) {
    app.use('/', async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            // @vitejs/plugin-rsc, and by extension tinyrsc, make use of standard Web
            // fetch Request and Response objects. Thus we need to convert our Express
            // Request to a fetch Request. This makes use of the third-party package
            // @remix-run/node-fetch-server
            const request = createRequest(req, res, { host: process.env.HOST });

            // Send the request to the tinyrsc request handler. This will be received by 
            // the RSC entry point.
            const response = await requestHandler(request);

            // Convert the fetch Response received back into an Express Response.
            return sendResponse(res, response);
        } catch (e: any) {
            console.error(`ERROR: ${e}`);
        }
    });
}

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
})

```

To build your app, use `npx tinyrsc build`.

At the moment, `tinyrsc` is not on NPM so you'll need to clone this repo and build the tarball: `npm run build`, as always.

## How well does it work and what problems may arise?

I have now moved my [lilt](https://github.com/nickw1/lilt) tool, which is a non-trivial medium-sized app, to `tinyrsc` and have had no problems so far. This app makes use of RSCs, client components, and server functions, and works with a few third-party npm packages. In particular, it uses all of the following React-based packages, and all work fine:

- [`markdown-to-jsx`](https://github.com/quantizor/markdown-to-jsx)
- [`html-react-parser`](https://github.com/remarkablemark/html-react-parser)
- [`react-modal`](https://github.com/reactjs/react-modal)
- [`react-feather`](https://github.com/feathericons/react-feather)

Problems may arise with a library which uses browser-based APIs (such as `window`) in the global scope. This code will be processed by Server-Side Rendering and thus will cause errors due to `window` not existing server-side. Please open an issue if you find a third-party library which doesn't play nicely with `tinyrsc`.