export class AttributeTableDto {

    avId: string;
    avName: string;
    attributes: AttributeRowDto[]

}

export class AttributeRowDto {
    id: string;
    name: string;
    type: TAVCol;
    content: string;
    icon: string;
}


export enum TabType {
    REFRESH_TAB = "REFRESH_TAB",
    COLLAPSED_TAB = "COLLAPSED_TAB",
    SETTINGS_TAB = "SETTINGS_TAB",
    ATTRIBUTE_TAB = "ATTRIBUTE_TAB",

}