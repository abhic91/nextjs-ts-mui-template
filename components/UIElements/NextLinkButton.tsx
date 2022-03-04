import React from 'react';
import Link, { LinkProps as NextLinkProps } from 'next/link';

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as'> {
  linkAs?: NextLinkProps['as'];
  href: NextLinkProps['href'];
}

export const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(function NextLinkComposed(props, ref) {
  const { linkAs, href, replace, scroll, shallow, prefetch, locale, children, ...other } = props;
  return (
    <Link
      href={href}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}>
      <a ref={ref} {...other}>
        {children}
      </a>
    </Link>
  );
});
