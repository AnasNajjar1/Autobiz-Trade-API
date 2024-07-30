import { PlateRecognizer } from './PlateRecognizer';

const visionAPI = new PlateRecognizer();

export { visionAPI };

/** This Service is no longer used by AutobizTrade to hide registration plates
 *
 * the Vision API is not specialized enough in plate recognition (more generalist), you must now use the platerecognizer API
 */
