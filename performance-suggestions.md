# Performance Suggestions

This document outlines potential performance improvements for the codebase.

## O(n²) or worse algorithms

- **`user.service.js`:** The `getUserContacts` method has a potential N+1 problem. It first fetches all the contact documents and then, for each contact, it makes another query to get the user details. This should be optimized by denormalizing the user data and storing it directly in the contact document.

## Unnecessary database queries

- **`user.service.js`:** The `searchUsers` method performs two separate queries and combines the results on the client. This should be optimized by using a more advanced search solution or by denormalizing the data in Firestore to allow for a single, more efficient query.

## Memory Leaks

- **`src/pages/Home.jsx`:** The `addEventListener` calls in this component are not cleaned up in a `useEffect` hook, which will cause a memory leak.
- **`src/service/api/config.js`:** The `setTimeout` used for the abort controller is not cleared if the request completes successfully, which could lead to a memory leak.

## Caching Opportunities

- **User Data:** User data could be cached in the Redux store to avoid unnecessary database queries.
- **React Query/SWR:** Consider using a library like React Query or SWR to manage caching, re-fetching, and synchronization of data from Firebase.

## async/await optimizations

- **`user.service.js`:** The two queries in the `searchUsers` method should be run in parallel using `Promise.all`.

## Resource Cleanup

- **`src/pages/Home.jsx`:** The `addEventListener` calls should be added in a `useEffect` hook with a proper cleanup function.
- **`src/service/api/config.js`:** The `timeoutId` for the abort controller should be cleared in a `finally` block.
