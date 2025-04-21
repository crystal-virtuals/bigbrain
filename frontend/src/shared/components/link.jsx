/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import * as Headless from '@headlessui/react';
import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Link = forwardRef(function Link(props, ref) {
  // Destructure to separate external links from router props
  const { external, href, to, ...rest } = props;

  return (
    <Headless.DataInteractive>
      {external ? (
        // Handle external links with regular <a> tag
        <a
          href={href}
          ref={ref}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        />
      ) : (
        // Handle internal routes with React Router
        <RouterLink
          to={to || href}
          ref={ref}
          {...rest}
        />
      )}
    </Headless.DataInteractive>
  );
});
