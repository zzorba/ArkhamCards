import React from 'react';
import { PlayerCardProviderCached } from './PlayerCardProviderCached';

/**
 * Higher-Order Component that wraps a component with PlayerCardProviderCached.
 * This provides a per-screen card cache to prevent unnecessary reloads.
 *
 * Usage:
 *   const MyComponentWithCache = withCachedCards(MyComponent);
 */
export function withCachedCards<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  const WithCachedCards = (props: P) => {
    return (
      <PlayerCardProviderCached>
        <WrappedComponent {...props} />
      </PlayerCardProviderCached>
    );
  };

  WithCachedCards.displayName = `withCachedCards(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithCachedCards;
}
