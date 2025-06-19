import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load key-value pairs from .properties
 */
function loadPropertiesFrom(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const properties = {};

    content.split('\n').forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith('#')) return;
        const [key, ...rest] = line.split('=');
        properties[key.trim()] = rest.join('=').trim();
    });

    return properties;
}

/**
 * Inject dynamic WebdriverIO element getters via Proxy
 */
export function withDynamicElements(instance) {
    // Get the caller file name
    const error = new Error();
    const stackLine = error.stack.split('\n')[2];
    const match = stackLine.match(/at\s(?:file:\/\/)?(.+\.js)/);
    const pageFilePath = match ? match[1] : null;

    if (!pageFilePath) throw new Error('Cannot detect caller path');

    const baseName = path.basename(pageFilePath, '.js');
    const elementFileName = baseName.replace('.page', '.element') + '.properties';
    const elementFilePath = path.resolve(__dirname, '../resources', elementFileName);

    if (!fs.existsSync(elementFilePath)) {
        throw new Error(`Properties file not found: ${elementFilePath}`);
    }

    const locators = loadPropertiesFrom(elementFilePath);

    return new Proxy(instance, {
        get(target, prop) {
            if (prop in target) return target[prop];

            const key = prop.toString().toUpperCase();

            // Special dynamic access method: getLocator('CALENDAR_DATE_ELEMENT', '19')
            if (key === 'GETLOCATOR') {
                return (locatorKey, ...args) => {
                    const raw = locators[locatorKey.toUpperCase()];
                    if (!raw) throw new Error(`Locator '${locatorKey}' not found`);
                    const formatted = args.reduce((str, val) => str.replace('%s', val), raw);
                    return $(formatted);
                };
            }

            const selector = locators[key];
            if (selector) return $(selector);
            return undefined;
        }
    });
}
