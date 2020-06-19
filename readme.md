# Next js with Redux

Default and only export is a generator that you pass your client creation function into. It returns two functions that allow you to access the redux store in the context of a react component or any other context that may have to do with pre-rendering on the server or client in next js.

1. `initRedux` - Function that takes a single optional argument which is initial state to hydrate the cache. This function can be used inside `getServerSideProps`, `getStaticProps`, and `getInitialProps`.
2. `useRedux` - Hook version of initRedux. Used in a react component, typically in `pages/_app.js` to supply the Redux Provider.

This uses the exact concepts from the latest next js examples git repository for using redux with next js. [https://github.com/vercel/next.js/tree/canary/examples/with-redux](https://github.com/vercel/next.js/tree/canary/examples/with-redux) It is packaged up for convienience so you don't have to keep having to re-writing this functionality and only worry about passing in your store creation function and using the redux.

## Example Usage

1. create a file that you will export the two generated functions from your store creation function. example path: `~/lib/redux.js` (where ~ is project root)

   ```js
   import { createStore } from "redux";
   import nextRedux from "@next-tools/redux";
   import reducer from "somewhere";

   export const { initRedux, useRedux } = nextRedux(function (initState) {
     return createStore(reducer, initState);
   });
   ```

2. Provider in `pages/_app.js`

   ```js
   import { useRedux } from "~/lib/redux";
   import { Provider } from "react-redux";

   const App = ({ Component, pageProps }) => {
     const reduxStore = useRedux(pageProps.initReduxState);

     return (
       <Provider store={reduxStore}>
         <Component {...pageProps} />
       </Provider>
     );
   };

   export default App;
   ```

3. Usage for ssr in any of the 3 available functions `getServerSideProps`, `getStaticProps`, or `getInitialProps` on a next js `page`

   ```js
   import { initRedux } from "~/lib/redux";
   import fetchData from "fetchData";
   import actions from "somewhere/actions";

   const Page = ({ something }) => {
     return <div>...</div>;
   };

   // connect to anything with pre-rendered state. here just showing page component for simple example
   export default connect(({ something }) => ({ something }), actions)(Page);

   Page.getInitialProps = async function () {
     const store = initRedux();
     const data = await fetchData();

     store.dispatch(actions.doSomething(data));

     return {
       initReduxState: store.getState()
     };
   };
   ```

   ```js
   import { initRedux } from "~/lib/redux";
   import fetchData from "fetchData";
   import actions from "somewhere/actions";

   const Page = ({ something }) => {
     return <div>...</div>;
   };

   // connect to anything with pre-rendered state. here just showing page component for simple example
   export default connect(({ something }) => ({ something }), actions)(Page);

   export async function getServerSideProps() {
     const store = initRedux();
     const data = await fetchData();

     store.dispatch(actions.doSomething(data));

     return {
       props: {
         initReduxState: store.getState()
       }
     };
   }
   ```

   ```js
   import { initRedux } from "~/lib/redux";
   import fetchData from "fetchData";
   import actions from "somewhere/actions";

   const Page = ({ something }) => {
     return <div>...</div>;
   };

   // connect to anything with pre-rendered state. here just showing page component for simple example
   export default connect(({ something }) => ({ something }), actions)(Page);

   export async function getStaticProps() {
     const store = initRedux();
     const data = await fetchData();

     store.dispatch(actions.doSomething(data));

     return {
       props: {
         initReduxState: store.getState()
       }
     };
   }
   ```
