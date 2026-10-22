import { ensureElement } from "../../../utils/utils";
import { ProductCard, ProductCardData } from "./ProductCard";
import { categoryMap,CDN_URL } from "../../../utils/constants";

type CategorKey = keyof typeof categoryMap

interface CardCatalogData extends ProductCardData {
     category: string
     image: string 
}

interface CardCategoryAction {
    onClick: () => void
}

export class CardCatalog extends ProductCard<CardCatalogData> {
    cardCatalogButton: HTMLButtonElement
    cardImage: HTMLImageElement
    cardCategory: HTMLSpanElement

    constructor(actions: CardCategoryAction, container: HTMLElement) {
        super(container)

        this.cardCatalogButton = this.container as HTMLButtonElement
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container)


        if (actions?.onClick) {
        this.cardCatalogButton.addEventListener('click', actions.onClick)
        }
    }

    set category(value: string) {
        this.cardCategory.textContent = value

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategorKey],
                key === value
            )
        }
    }

    set image(value: string) {
        this.setImage(this.cardImage, CDN_URL + value)
    }
}