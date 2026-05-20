import type { Nullable } from '~/types';
import { parseJson } from '~/json';

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
 * @returns Parsed JSON value or null if not present or invalid.
 */
export const getDataTransferJson = <Value>(dataTransfer: DataTransfer): Nullable<Value> => {
  const rawData = dataTransfer.getData(DATA_TRANSFER_JSON_MIME);
  if (!rawData) {
    return null;
  }

  return parseJson<Value>(rawData);
};
