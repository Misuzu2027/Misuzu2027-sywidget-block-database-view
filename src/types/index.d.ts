/**
 * Copyright (c) 2023 frostime. All rights reserved.
 */

/**
 * Frequently used data structures in SiYuan
 */
type DocumentId = string;
type BlockId = string;
type NotebookId = string;
type PreviousID = BlockId;
type ParentID = BlockId | DocumentId;

type Notebook = {
    id: NotebookId;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

type NotebookConf = {
    name: string;
    closed: boolean;
    refCreateSavePath: string;
    createDocNameTemplate: string;
    dailyNoteSavePath: string;
    dailyNoteTemplatePath: string;
}

type BlockType = "d" | "s" | "h" | "t" | "i" | "p" | "f" | "audio" | "video" | "other";

type BlockSubType = "d1" | "d2" | "s1" | "s2" | "s3" | "t1" | "t2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "table" | "task" | "toggle" | "latex" | "quote" | "html" | "code" | "footnote" | "cite" | "collection" | "bookmark" | "attachment" | "comment" | "mindmap" | "spreadsheet" | "calendar" | "image" | "audio" | "video" | "other";

type Block = {
    id: BlockId;
    parent_id?: BlockId;
    root_id: DocumentId;
    hash: string;
    box: string;
    path: string;
    hpath: string;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent?: string;
    markdown: string;
    length: number;
    type: BlockType;
    subtype: BlockSubType;
    /** string of { [key: string]: string } 
     * For instance: "{: custom-type=\"query-code\" id=\"20230613234017-zkw3pr0\" updated=\"20230613234509\"}" 
     */
    ial?: string;
    sort: number;
    created: string;
    updated: string;
}

type doOperation = {
    action: string;
    data: string;
    id: BlockId;
    parentID: BlockId | DocumentId;
    previousID: BlockId;
    retData: null;
}

interface Window {
    siyuan: {
        notebooks: any;
        menus: any;
        dialogs: any;
        blockPanels: any;
        storage: any;
        user: any;
        ws: any;
        languages: any;
    };
}


type AttributeViewKey = {
    keyValues: {
        key: {
            type: TAVCol,
            name: string,
            icon: string,
            id: string,
            options?: {
                name: string,
                color: string
            }[]
        },
        values: {
            keyID: string,
            id: string,
            blockID: string,
            type: TAVCol & IAVCellValue
        }[]
    }[],
    blockIDs: string[],
    avID: string
    avName: string

}

type TAVCol =
    "text"
    | "date"
    | "number"
    | "relation"
    | "rollup"
    | "select"
    | "block"
    | "mSelect"
    | "url"
    | "email"
    | "phone"
    | "mAsset"
    | "template"
    | "created"
    | "updated"
    | "checkbox"
    | "lineNumber"


interface IAVCellValue {
    id?: string,
    type: TAVCol,
    isDetached?: boolean,
    text?: {
        content: string
    },
    number?: {
        content?: number,
        isNotEmpty: boolean,
        format?: string,
        formattedContent?: string
    },
    mSelect?: IAVCellSelectValue[]
    mAsset?: IAVCellAssetValue[]
    block?: {
        content: string,
        id?: string
    }
    url?: {
        content: string
    }
    phone?: {
        content: string
    }
    email?: {
        content: string
    }
    template?: {
        content: string
    },
    checkbox?: {
        checked: boolean
    }
    relation?: {
        blockIDs: string[]
        contents?: IAVCellValue[]
    }
    rollup?: {
        contents?: IAVCellValue[]
    }
    date?: IAVCellDateValue
    created?: IAVCellDateValue
    updated?: IAVCellDateValue
}

interface IAVCellAssetValue {
    content: string,
    name: string,
    type: "file" | "image"
}


interface IAVCellDateValue {
    content?: number,
    isNotEmpty?: boolean
    content2?: number,
    isNotEmpty2?: boolean
    hasEndDate?: boolean
    formattedContent?: string,
    isNotTime?: boolean // 默认 true
}

interface IAVCellSelectValue {
    content: string,
    color: string
}