function styleObjectToString(styleObject) {
    return Object.entries(styleObject)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");
}
export { styleObjectToString };
