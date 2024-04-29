<script lang="ts">
    import { AttributeTableDto } from "@/structures/AttributeTableStructure";
    import { afterUpdate } from "svelte";
    import { SettingConfig } from "@/config/setting-config";

    export let tableDto: AttributeTableDto;
    let rowFlexBasisPercent = "99%";

    $: {
        afterUpdate(afterRender);
    }

    function afterRender() {
        let columns = SettingConfig.ins.widgetSettingDto.columns;
        let rowFlexBasis = 100 / columns - 2.1;
        rowFlexBasisPercent = rowFlexBasis + "%";

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

        let frameElement = window.frameElement as HTMLElement;
        frameElement.style.height = contentHeight + "px";
        frameElement.style.width = "2048px";
    }

    /**
     *
     */
</script>

<div class="document-properties" style="display:flex;flex-wrap: wrap;">
    {#each tableDto.attributes as item (item.id)}
        <div
            class="block__icons av__row"
            style="flex-basis:{rowFlexBasisPercent}"
        >
            <div class="block__logo">
                {@html item.icon}
                <span class="text-white-space-wrap">{@html item.name}</span>
            </div>
            <div class="fn__flex-1 fn__flex block__logo-content">
                {@html item.content}
                <!-- <div class="fn__flex-1">{@html item.content}</div> -->
            </div>
        </div>
    {/each}
</div>

<style>
    .av__row {
        flex: 1 0;
        border-bottom: 1px solid var(--b3-theme-on-background);
        border-image: linear-gradient(
                to right,
                transparent,
                var(--b3-theme-on-background),
                transparent
            )
            1;
        padding-bottom: 4px;
        margin-top: 4px;
    }
    .block__logo-content {
        width: 120px;
        align-self: center;
        margin-top: 2px;
    }
    .text-white-space-wrap {
        white-space: wrap; /* 超出宽度文字换行 */
    }
</style>
