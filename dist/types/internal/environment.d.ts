declare function getPlatform(): string;
interface NavigatorUAData {
    brands: Array<{
        brand: string;
        version: string;
    }>;
    mobile: boolean;
    platform: string;
}
declare function getUserAgent(): string;
declare function isMac(): boolean;
declare function isSafari(): boolean;
declare function isAndroid(): boolean;
declare function isJSDOM(): boolean;
export type { NavigatorUAData };
export { getPlatform, getUserAgent, isMac, isSafari, isAndroid, isJSDOM };
