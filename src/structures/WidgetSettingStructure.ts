import { TabType } from "./AttributeTableStructure";


export class WidgetAttrSettingDto {
    targetBlockId: string;
    lastSelectTabType: TabType;
    lastSelectAvId: string;
    columns: number;
    filterEmpty: boolean;
    openDocAutoCollapsed: boolean;
    showBuiltInAttr: boolean;
    showCustomAttr: boolean;

    constructor(globalSettingDto: WidgetGlobalSettingDto) {
        this.targetBlockId = null;
        this.columns = globalSettingDto.defaultColumns;
        this.filterEmpty = globalSettingDto.defaultFilterEmpty;
        this.openDocAutoCollapsed = globalSettingDto.defaultCollapsed;
        this.showBuiltInAttr = globalSettingDto.defaultShowBuiltInAttr;
        this.showCustomAttr = globalSettingDto.defaultShowCustomAttr;
    }
}

export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-wideht-database-view-setting"



export class WidgetGlobalSettingDto {
    defaultGetTargetBlockMethod: "RootBlock" | "PreviousBlock" | "NextBlock";
    defaultColumns: number;
    defaultFilterEmpty: boolean;
    defaultCollapsed: boolean;
    defaultShowBuiltInAttr: boolean;
    defaultShowCustomAttr: boolean;
    useThirdPartyThemeStyles: boolean;

    constructor() {
        this.defaultGetTargetBlockMethod = "RootBlock";
        this.defaultColumns = 1;
        this.defaultFilterEmpty = false;
        this.defaultCollapsed = false;
        this.defaultShowBuiltInAttr = false;
        this.defaultShowCustomAttr = false;
        this.useThirdPartyThemeStyles = false;
    }
}


export const WIDGET_SETTING_LOCAL_STORAGE_NAME = "wideht-database-view-setting"