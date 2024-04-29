import { getColIconByType } from "./col";
import { formatDate } from "./dateUtil";

const genAVRollupHTML = (value: IAVCellValue) => {
    let html = "";
    switch (value.type) {
        case "block":
            if (value?.isDetached) {
                html = `<span data-id="${value.block?.id}">${value.block?.content || "未命名"}</span>`;
            } else {
                html = `<span data-type="block-ref" data-id="${value.block?.id}" data-subtype="s" class="av__celltext--ref">${value.block?.content || "未命名"}</span>`;
            }
            break;
        case "text":
            html = value.text.content;
            break;
        case "number":
            html = value.number.formattedContent || value.number.content.toString();
            break;
        case "date":
            if (value[value.type] && value[value.type].isNotEmpty) {
                html = formatDate(value[value.type].content, value[value.type].isNotTime);
            }
            if (value[value.type] && value[value.type].hasEndDate && value[value.type].isNotEmpty && value[value.type].isNotEmpty2) {
                html += `<svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>${formatDate(value[value.type].content2, value[value.type].isNotTime)}`;
            }
            if (html) {
                html = `<span class="av__celltext">${html}</span>`;
            }
            break;
        case "url":
            html = value.url.content ? `<a class="fn__a" href="${value.url.content}" target="_blank">${value.url.content}</a>` : "";
            break;
        case "phone":
            html = value.phone.content ? `<a class="fn__a" href="tel:${value.phone.content}" target="_blank">${value.phone.content}</a>` : "";
            break;
        case "email":
            html = value.email.content ? `<a class="fn__a" href="mailto:${value.email.content}" target="_blank">${value.email.content}</a>` : "";
            break;
    }
    return html;
};

export const genAVValueHTML = (value: IAVCellValue) => {
    let html = "";
    switch (value.type) {
        case "block":
            html = `<div class="fn__flex-1">${value.block.content}</div>`;
            break;
        case "text":
            html = `<textarea rows="${value.text.content.split("\n").length}" class="b3-text-field b3-text-field--text fn__flex-1" disabled>${value.text.content}</textarea>`;
            break;
        case "number":
            html = `<input value="${value.number.isNotEmpty ? value.number.content : ""}" type="number" class="b3-text-field b3-text-field--text fn__flex-1" disabled>`;
            break;
        case "mSelect":
        case "select":
            value.mSelect?.forEach(item => {
                html += `<span class="b3-chip b3-chip--middle" style="background-color:var(--b3-font-background${item.color});color:var(--b3-font-color${item.color})">${item.content}</span>`;
                html += `<span class="fn__space"></span>`;
            });
            break;
        case "mAsset":
            value.mAsset?.forEach(item => {
                if (item.type === "image") {
                    html += `<img class="av__cellassetimg" src="/${item.content}">`;
                } else {
                    html += `<span class="b3-chip b3-chip--middle av__celltext--url" data-url="${item.content}">${item.name}</span>`;
                }
                html += `<span class="fn__space"></span>`;
            });
            break;
        case "date":
            html = `<span class="av__celltext" data-value='${JSON.stringify(value[value.type])}'>`;
            if (value[value.type] && value[value.type].isNotEmpty) {
                html += formatDate(value[value.type].content, value[value.type].isNotTime);
            }
            if (value[value.type] && value[value.type].hasEndDate && value[value.type].isNotEmpty && value[value.type].isNotEmpty2) {
                html += `<svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>${formatDate(value[value.type].content2, value[value.type].isNotTime)}`;
            }
            html += "</span>";
            break;
        case "created":
        case "updated":
            if (value[value.type].isNotEmpty) {
                html = `<span data-content="${value[value.type].content}">${formatDate(value[value.type].content, false)}</span>`;
            }
            break;
        case "url":
            html = `<input value="${value.url.content}" class="b3-text-field b3-text-field--text fn__flex-1" disabled><span class="fn__space"></span><a href="${value.url.content}" target="_blank" aria-label="打开" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconLink"></use></svg></a>`;
            break;
        case "phone":
            html = `<input value="${value.phone.content}" class="b3-text-field b3-text-field--text fn__flex-1" disabled>
<span class="fn__space"></span>
<a href="tel:${value.phone.content}" target="_blank" aria-label="打开" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconPhone"></use></svg></a>`;
            break;
        case "checkbox":
            html = `<svg class="av__checkbox"><use xlink:href="#icon${value.checkbox.checked ? "Check" : "Uncheck"}"></use></svg>`;
            break;
        case "template":
            html = `<div class="fn__flex-1">${value.template.content}</div>`;
            break;
        case "email":
            html = `<input value="${value.email.content}" class="b3-text-field b3-text-field--text fn__flex-1" disabled>
<span class="fn__space"></span>
<a href="mailto:${value.email.content}" target="_blank" aria-label="打开" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconEmail"></use></svg></a>`;
            break;
        case "relation":
            value?.relation?.contents?.forEach((item) => {
                if (item) {
                    const rollupText = genAVRollupHTML(item);
                    if (rollupText) {
                        html += rollupText + ",&nbsp;";
                    }
                }
            });
            if (html && html.endsWith(",&nbsp;")) {
                html = html.substring(0, html.length - 7);
            }
            break;
        case "rollup":
            value?.rollup?.contents?.forEach((item) => {
                const rollupText = ["select", "mSelect", "mAsset", "checkbox", "relation"].includes(item.type) ? genAVValueHTML(item) : genAVRollupHTML(item);
                if (rollupText) {
                    html += rollupText + ",&nbsp;";
                }
            });
            if (html && html.endsWith(",&nbsp;")) {
                html = html.substring(0, html.length - 7);
            }
            break;
    }
    return html;
};



export const unicode2Emoji = (unicode: string, className = "", needSpan = false, lazy = false) => {
    if (!unicode) {
        return "";
    }
    let emoji = "";
    if (unicode.indexOf(".") > -1) {
        emoji = `<img class="${className}" ${lazy ? "data-" : ""}src="/emojis/${unicode}"/>`;
    } else {
        try {
            unicode.split("-").forEach(item => {
                if (item.length < 5) {
                    emoji += String.fromCodePoint(parseInt("0" + item, 16));
                } else {
                    emoji += String.fromCodePoint(parseInt(item, 16));
                }
            });
            if (needSpan) {
                emoji = `<span class="${className}">${emoji}</span>`;
            }
        } catch (e) {
            // 自定义表情搜索报错 https://github.com/siyuan-note/siyuan/issues/5883
            // 这里忽略错误不做处理
        }
    }
    return emoji;
};


export function getIconHtml(icon: string, type: TAVCol): string {
    let result: string;
    if (icon) {
        result = unicode2Emoji(
            icon,
            "block__logoicon custom-emoji",
            true,
        )
    } else {
        result = `<svg class="block__logoicon"><use xlink:href="#${getColIconByType(type)}"></use></svg>`;
    }

    return result;
}