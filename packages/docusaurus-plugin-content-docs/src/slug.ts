/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  addLeadingSlash,
  addTrailingSlash,
  isValidPathname,
  resolvePathname,
} from '@docusaurus/utils';
import {stripPathNumberPrefixes} from './numberPrefix';

export default function getSlug({
  baseID,
  frontmatterSlug,
  dirName,
  stripDirNumberPrefixes = true,
}: {
  baseID: string;
  frontmatterSlug?: string;
  dirName: string;
  stripDirNumberPrefixes?: boolean;
}): string {
  const baseSlug = frontmatterSlug || baseID;
  let slug: string;
  if (baseSlug.startsWith('/')) {
    slug = baseSlug;
  } else {
    const dirNameStripped = stripDirNumberPrefixes
      ? stripPathNumberPrefixes(dirName)
      : dirName;
    const resolveDirname =
      dirName === '.'
        ? '/'
        : addLeadingSlash(addTrailingSlash(dirNameStripped));
    slug = resolvePathname(baseSlug, resolveDirname);
  }

  if (!isValidPathname(slug)) {
    throw new Error(
      `We couldn't compute a valid slug for document with id=${baseID} in folder=${dirName}
The slug we computed looks invalid: ${slug}
Maybe your slug frontmatter is incorrect or you use weird chars in the file path?
By using the slug frontmatter, you should be able to fix this error, by using the slug of your choice:

Example =>
---
slug: /my/customDocPath
---
`,
    );
  }

  return slug;
}
