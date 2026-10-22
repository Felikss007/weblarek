import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface GalleryData {
    catalog: HTMLElement[]
}

export class Gallery extends Component<GalleryData> {
    protected catalogElement: HTMLElement

    constructor(container: HTMLElement) {
        super(container)

        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container)
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items)
    }
}

