import { isString } from '../../string';
import { assert, isUndefined } from '../../guards';

export type Downloadable = Blob | MediaSource | string;

export interface DownloadFileOptions {
  /**
   * Suggested filename for the downloaded file.
   *
   * When provided, the browser will attempt to save the file using this name.
   * If omitted and the source is a URL string, the browser may infer the name
   * from the URL.
   */
  fileName?: string;
  /**
   * Target browsing context for the download link.
   */
  target?: '_self' | '_blank';
}

/**
 * Initiates a file download in a browser environment.
 *
 * This utility supports downloading from:
 * - a URL string
 * - a `Blob`
 * - a `MediaSource`
 *
 * For non-string inputs, an object URL is created temporarily and
 * automatically revoked after the download is triggered.
 *
 * @remarks
 * - This function performs direct DOM manipulation and must be executed  in a browser environment.
 * - In non-DOM contexts (e.g. SSR), the function exits without side effects.
 * - Object URLs are revoked asynchronously to avoid Safari-related issues.
 *
 * @param file - The file source to download (URL string or binary object).
 * @param options - Optional configuration controlling filename and link target.
 */
export const downloadFile = (
  file: Downloadable,
  { fileName, target }: DownloadFileOptions = {},
): void => {
  // Browser guard (SSR / non-DOM environments)
  if (isUndefined(document)) {
    return;
  }

  const link = document.createElement('a');
  let objectUrl: string | null = null;

  try {
    const href = isString(file) ? file : (objectUrl = URL.createObjectURL(file));
    link.href = href;

    if (fileName) {
      link.download = fileName;
    }

    if (target) {
      link.target = target;
    }

    // Required for Firefox / Safari
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();

    if (objectUrl) {
      // Delay revocation to avoid Safari issues
      setTimeout(() => {
        assert(objectUrl, 'Object URL should not be null');

        URL.revokeObjectURL(objectUrl);
      }, 0);
    }
  }
};
