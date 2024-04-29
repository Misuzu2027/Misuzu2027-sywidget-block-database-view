export const escapeAttr = (html: string) => {
    return html.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
};