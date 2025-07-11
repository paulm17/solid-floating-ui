function getPlatform() {
    const uaData = navigator
        .userAgentData;
    if (uaData?.platform) {
        return uaData.platform;
    }
    return navigator.platform;
}
function getUserAgent() {
    const uaData = navigator
        .userAgentData;
    if (uaData && Array.isArray(uaData.brands)) {
        return uaData.brands
            .map(({ brand, version }) => `${brand}/${version}`)
            .join(" ");
    }
    return navigator.userAgent;
}
function isMac() {
    return (getPlatform().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints);
}
function isSafari() {
    // Chrome DevTools does not complain about navigator.vendor
    return /apple/i.test(navigator.vendor);
}
function isAndroid() {
    const re = /android/i;
    return re.test(getPlatform()) || re.test(getUserAgent());
}
function isJSDOM() {
    return getUserAgent().includes("jsdom/");
}
export { getPlatform, getUserAgent, isMac, isSafari, isAndroid, isJSDOM };
