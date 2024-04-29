import { getBlockAttrs, getBlockByID, getCurrentDocId, getCurrentWidgetId, getLocalStorage, setBlockAttrs, setStorageVal } from "@/utils/api";
import { WIDGET_SETTING_ATTRIBUTE_NAME, WIDGET_SETTING_LOCAL_STORAGE_NAME, WidgetAttrSettingDto, WidgetGlobalSettingDto } from "@/structures/WidgetSettingStructure";
import Instance from "@/utils/Instance";

export class SettingConfig {


    widgetCollapsed: boolean;
    widgetBlockId: string;
    widgetBlockInfo: Block;
    widgetSettingDto: WidgetAttrSettingDto;
    widgetGlobalSettingDto: WidgetGlobalSettingDto;

    public static get ins(): SettingConfig {
        return Instance.get(SettingConfig);
    }

    async load() {
        try {
            this.widgetGlobalSettingDto = new WidgetGlobalSettingDto()
            let data = await getLocalStorage();
            let globalSettingDtoNew = data[WIDGET_SETTING_LOCAL_STORAGE_NAME];
            if (globalSettingDtoNew) {
                this.widgetGlobalSettingDto = { ...this.widgetGlobalSettingDto, ...globalSettingDtoNew };
            }

        } catch (e) {

        }

        try {
            this.widgetSettingDto = new WidgetAttrSettingDto(null, this.widgetGlobalSettingDto.defaultColumns, this.widgetGlobalSettingDto.defaultFilterEmpty);

            this.widgetBlockId = getCurrentWidgetId();

            let blockAttrMap = await getBlockAttrs(this.widgetBlockId);
            let settringDtoStr = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
            if (settringDtoStr) {
                this.widgetSettingDto = { ...this.widgetSettingDto, ...JSON.parse(settringDtoStr) };
            }
            if (!this.widgetSettingDto.targetBlockId) {
                let widgetRootId = await getCurrentDocId();
                let defalutTargetBlockId = widgetRootId ? widgetRootId : this.widgetBlockId;
                this.widgetSettingDto.targetBlockId = defalutTargetBlockId;
            }
            this.widgetCollapsed = this.widgetSettingDto.defaultCollapsed;
        } catch (e) {

        }

    }

    async update(WidgetSettingDto: WidgetAttrSettingDto) {
        this.widgetSettingDto = WidgetSettingDto;

        let settringDtoStr = JSON.stringify(this.widgetSettingDto);
        let attrsParam = { [WIDGET_SETTING_ATTRIBUTE_NAME]: settringDtoStr };

        setBlockAttrs(this.widgetBlockId, attrsParam)

    }

    async updateLocalStorage(widgetGlobalSettingDto: WidgetGlobalSettingDto) {
        this.widgetGlobalSettingDto = widgetGlobalSettingDto;

        setStorageVal(WIDGET_SETTING_LOCAL_STORAGE_NAME, widgetGlobalSettingDto);
    }

}
