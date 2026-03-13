export const DATA_TRANSFER_JSON_MIME = 'application/json';

/**
 * Serializes and stores JSON data in a DataTransfer object.
 *
 * Useful for drag-and-drop communication between elements.
 *
 * @param dataTransfer DataTransfer instance from a drag event.
 * @param data Data to serialize.
 */
export const setDataTransferJson = <T>(dataTransfer: DataTransfer, data: T): void => {
  dataTransfer.setData(DATA_TRANSFER_JSON_MIME, JSON.stringify(data));
};

/**
 * Retrieves and parses JSON data from a DataTransfer object.
 *
 * @param dataTransfer DataTransfer instance from a drop event.
 *
 * @returns Parsed JSON value or undefined if not present or invalid.
 */
export const getDataTransferJson = <T>(dataTransfer: DataTransfer): T | undefined => {
  const rawData = dataTransfer.getData(DATA_TRANSFER_JSON_MIME);
  if (!rawData) {
    return undefined;
  }

  try {
    return JSON.parse(rawData) as T;
  } catch {
    return undefined;
  }
};
