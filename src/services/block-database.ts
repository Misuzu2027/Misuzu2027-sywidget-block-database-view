import { SettingConfig } from "@/config/setting-config";
import { genAVValueHTML, getIconHtml } from "@/libs/blockAttr";
import { AttributeRowDto, AttributeTableDto } from "@/structures/AttributeTableStructure";
import { isNotBlankStr } from "@/utils/stringUtil";

export function processAttributeData(
    attributeViewKeys: AttributeViewKey[],
): Map<string, AttributeTableDto> {
    let tableDtoMap: Map<string, AttributeTableDto> = new Map();
    if (!attributeViewKeys || attributeViewKeys.length <= 0) {
        return tableDtoMap;
    }

    for (const table of attributeViewKeys) {
        if (!table) {
            continue;
        }

        let tableDto = new AttributeTableDto();
        let attributeDtos: AttributeRowDto[] = [];
        let avId = table.avID;
        let avName = table.avName;

        for (const keyValue of table.keyValues) {
            if (!keyValue) {
                continue;
            }

            let content = genAVValueHTML(keyValue.values[0]);
            let attributeType = keyValue.values[0].type;

            if (contentFilterValid(keyValue.values[0])) {
                // console.log(
                //     `被过滤的属性 content : ${content}, attributeType : ${attributeType} `,
                // );
                continue;
            }

            let iconHtml = getIconHtml(
                keyValue.key.icon,
                keyValue.key.type,
            );

            let atrDto = new AttributeRowDto();
            atrDto.id = keyValue.key.id;
            atrDto.icon = iconHtml;
            atrDto.name = keyValue.key.name;
            atrDto.content = content;
            atrDto.type = attributeType;
            attributeDtos.push(atrDto);
        }
        tableDto.avId = avId;
        tableDto.avName = avName;
        tableDto.attributes = attributeDtos;
        tableDtoMap.set(avId, tableDto);
    }

    return tableDtoMap;
}

function contentFilterValid(cellValue: IAVCellValue): boolean {
    let type: TAVCol = cellValue.type;
    let filterEmpty = SettingConfig.ins.widgetSettingDto.filterEmpty;
    if (!filterEmpty) {
        return false;
    }
    let content: string = null;
    switch (type) {
        case "block":
            content = cellValue.block.content;
            break;
        case "text":
            content = cellValue.text.content;
            break;
        case "number":
            if (cellValue.number.isNotEmpty) {
                content = "1";
            }
            break;
        case "mSelect":
        case "select":
            if (cellValue.mSelect && cellValue.mSelect.length > 0) {
                content = "1";
            }
            break;
        case "mAsset":
            if (cellValue.mAsset && cellValue.mAsset.length > 0) {
                content = "1";
            }
            break;
        case "date":
        case "created":
        case "updated":
            content = (cellValue[type].content || "").toString();
            break;
        case "url":
            content = cellValue.url.content;
            break;
        case "phone":
            content = cellValue.phone.content;
            break;
        case "checkbox":
            content = '1';
            break;
        case "template":
            content = cellValue.template.content.trim();
            if (content == "<no value>") {
                content = null;
            }
            break;
        case "email":
            content = cellValue.email.content;
            break;
        case "relation":
            if (cellValue.relation?.contents
                && cellValue.relation?.contents.length > 0
                && cellValue.relation?.contents[0]) {
                content = "1";
            }
            break;
        case "rollup":
            if (cellValue.rollup?.contents
                && cellValue.rollup?.contents.length > 0) {
                content = "1";
            }
            break;
        case "lineNumber":

            break;
        default:
            content = "1";
            break;
    }
    if (isNotBlankStr(content)) {
        return false;
    } else {
        return true;
    }
}
