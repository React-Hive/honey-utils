import type { Nullable } from '~/types';
import { parseJson } from '~/json';

export const DATA_TRANSFER_JSON_MIME = 'application/json';

/**
 * Serializes and stores JSON data in a DataTransfer object.
 *
 * Useful for drag-and-drop communication between elements.
 *
 * @template T - The type of the data.
 *
 * @param dataTransfer - DataTransfer instance from a drag event.
 * @param data - Data to serialize.
 *
 * @example
 * ```ts
 * element.addEventListener('dragstart', event => {
 *   setDataTransferJson(event.dataTransfer, { id: 'card-1' });
 * });
 * ```
 */
export const setDataTransferJson = <T>(dataTransfer: DataTransfer, data: T): void => {
  dataTransfer.setData(DATA_TRANSFER_JSON_MIME, JSON.stringify(data));
};

/**
 * Retrieves and parses JSON data from a DataTransfer object.
 *
 * @template Value - The type the JSON is expected to have.
 *
 * @param dataTransfer - DataTransfer instance from a drop event.
 *
 * @returns Parsed JSON value or null if not present or invalid.
 *
 * @example
 * ```ts
 * element.addEventListener('drop', event => {
 *   const card = getDataTransferJson<{ id: string }>(event.dataTransfer);
 * });
 * ```
 */
export const getDataTransferJson = <Value>(dataTransfer: DataTransfer): Nullable<Value> => {
  const rawData = dataTransfer.getData(DATA_TRANSFER_JSON_MIME);
  if (!rawData) {
    return null;
  }

  return parseJson<Value>(rawData);
};
