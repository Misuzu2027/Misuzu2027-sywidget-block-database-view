

export class WidgetAttrSettingDto {
    targetBlockId: string;
    lastSelectAvId: string;
    columns: number;
    filterEmpty: boolean;
    openDocAutoCollapsed: boolean;

    constructor(targetBlockId: string, columns: number, filterEmpty: boolean,openDocAutoCollapsed:boolean) {
        this.targetBlockId = targetBlockId;
        this.columns = columns;
        this.filterEmpty = filterEmpty;
        this.openDocAutoCollapsed = openDocAutoCollapsed;
    }
}

export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-wideht-database-view-setting"



export class WidgetGlobalSettingDto {
    defaultColumns: number;
    defaultFilterEmpty: boolean;
    useThirdPartyThemeStyles: boolean;
    defaultCollapsed: boolean;

    constructor() {
        this.defaultColumns = 1;
        this.defaultFilterEmpty = false;
        this.useThirdPartyThemeStyles = false;
        this.defaultCollapsed = false;
    }
}


export const WIDGET_SETTING_LOCAL_STORAGE_NAME = "wideht-database-view-setting"