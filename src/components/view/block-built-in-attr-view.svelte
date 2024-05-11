<script lang="ts">
    import { SettingConfig } from "@/config/setting-config";
    import {
        AttributeRowDto,
    } from "@/structures/AttributeTableStructure";
    import { getBlockAttrs } from "@/utils/api";
    import { afterUpdate, onMount } from "svelte";

    
    let attributeRowDtos: AttributeRowDto[] = [];
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

        let blockBuiltInAttrMapList = [
            {
                name: "bookmark",
                showName: window.parent.window.siyuan.languages.bookmark,
                content: blockAttrMap["bookmark"],
            },
            {
                name: "name",
                showName: window.parent.window.siyuan.languages.name,
                content: blockAttrMap["name"],
            },
            {
                name: "alias",
                showName: window.parent.window.siyuan.languages.alias,
                content: blockAttrMap["alias"],
            },
            {
                name: "memo",
                showName: window.parent.window.siyuan.languages.memo,
                content: blockAttrMap["memo"],
            },
        ];

        for (const index in blockBuiltInAttrMapList) {
            let attrMap = blockBuiltInAttrMapList[index];
            let showName = attrMap.showName;
            let content = attrMap.content ? attrMap.content : "";
            let htmlContent = `<input value="${content}" type="text" class="b3-text-field b3-text-field--text fn__flex-1" disabled="">`;
            if (attrMap.name == "memo") {
                htmlContent = `<textarea rows="2" class="b3-text-field b3-text-field--text fn__flex-1" disabled="">${content}</textarea>`;
            }
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
