<script lang="ts">
    import { SettingConfig } from "@/config/setting-config";
    import { AttributeRowDto } from "@/structures/AttributeTableStructure";
    import { getBlockAttrs } from "@/utils/api";
    import { afterUpdate, onMount } from "svelte";

    let attributeRowDtos: AttributeRowDto[] = [];
    // let builtInAttrName = ["bookmark","name","alias","memo"];
    let rowFlexBasisPercent = "99%";

    onMount(() => {
        init();
    });

    async function init() {
        await initBlockBuiltInAttr();
    }

    async function initBlockBuiltInAttr() {
        let targetBlockId = SettingConfig.ins.widgetSettingDto.targetBlockId;
        let blockAttrMap = await getBlockAttrs(targetBlockId);

        for (const key in blockAttrMap) {
            if (!key.startsWith("custom-")) {
                continue;
            }
            let showName = key;
            let content = blockAttrMap[key];

            let htmlContent = `<textarea rows="2" class="b3-text-field b3-text-field--text fn__flex-1" disabled="">${content}</textarea>`;
            let rowDto = new AttributeRowDto();
            rowDto.name = showName;
            rowDto.content = htmlContent;
            attributeRowDtos.push(rowDto);
        }

        attributeRowDtos = attributeRowDtos;
    }

    $: {
        afterUpdate(afterRender);
    }

    function afterRender() {
        // let columns = SettingConfig.ins.widgetSettingDto.columns;
        // let rowFlexBasis = 100 / columns - 2.1;
        // rowFlexBasisPercent = rowFlexBasis + "%";

        setFrameHeight();
        setTimeout(() => {
            setFrameHeight();
        }, 120);
    }

    function setFrameHeight() {
        let contentHeight = document.getElementById("app").offsetHeight + 20;
        if (SettingConfig.ins.widgetCollapsed) {
            contentHeight =
                document.getElementById("top-navigation-bar").offsetHeight + 20;
        }
        if (contentHeight <= 30) {
            return;
        }
        let frameElement = window.frameElement as HTMLElement;
        frameElement.style.height = contentHeight + "px";
        frameElement.style.width = "2048px";
    }
</script>

<div class="document-properties" style="display:flex;flex-wrap: wrap;">
    {#each attributeRowDtos as item}
        <div
            class="block__icons av__row"
            style="flex-basis:{rowFlexBasisPercent}"
        >
            <div class="block__logo">
                <span class="text-white-space-wrap">{@html item.name}</span>
            </div>
            <div class="fn__flex-1 fn__flex block__logo-content">
                {@html item.content}
                <!-- <div class="fn__flex-1">{@html item.content}</div> -->
            </div>
        </div>
    {/each}
</div>
