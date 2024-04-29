

export class WidgetAttrSettingDto {
    targetBlockId: string;
    lastSelectAvId: string;
    columns: number;
    filterEmpty: boolean;
    defaultCollapsed: boolean;

    constructor(targetBlockId: string, columns: number, filterEmpty: boolean) {
        this.targetBlockId = targetBlockId;
        this.columns = columns;
        this.filterEmpty = filterEmpty;
        this.defaultCollapsed = false;
    }
}

export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-wideht-database-view-setting"



export class WidgetGlobalSettingDto {
    defaultColumns: number;
    defaultFilterEmpty: boolean;
    useThirdPartyThemeStyles: boolean;

    constructor() {
        this.defaultColumns = 1;
        this.defaultFilterEmpty = false;
        this.useThirdPartyThemeStyles = false;
    }
}


export const WIDGET_SETTING_LOCAL_STORAGE_NAME = "wideht-database-view-setting"