/**
 * Replaces the query string of the current URL without navigating or adding a history entry.
 *
 * The path and the hash are kept, and so is the history entry's state, which routers such as
 * React Router keep their own bookkeeping in. Empty search params remove the query string
 * altogether rather than leaving a bare `?`.
 *
 * `history.replaceState()` fires no event, so a router listening for navigation is not told: its
 * own location keeps the previous query until it next navigates.
 *
 * @param searchParams - The search params the URL should carry.
 *
 * @example
 * ```ts
 * // https://example.com/products?page=1#reviews
 * const searchParams = new URLSearchParams(window.location.search);
 *
 * searchParams.set('page', '2');
 *
 * replaceHistorySearchParams(searchParams);
 * // ➜ https://example.com/products?page=2#reviews
 * ```
 */
export const replaceHistorySearchParams = (searchParams: URLSearchParams): void => {
  const search = searchParams.toString();

  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`,
  );
};
