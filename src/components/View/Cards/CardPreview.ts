import { ensureElement } from "../../../utils/utils";
import { ProductCard, ProductCardData } from "./ProductCard";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap

interface CardPreviewData extends ProductCardData {
    description: string
    image: string
    buttonText: string
    buttonDisabled: boolean
}

interface CardPreviewActions {
  onClick: () => void;
}

export class CardPreview extends ProductCard<CardPreviewData> {
    protected previewImage: HTMLImageElement
    protected previewButton: HTMLButtonElement
    protected descriptionCard: HTMLParagraphElement
    protected cardCategory: HTMLElement

    constructor(protected actions: CardPreviewActions, container: HTMLElement) {
        super(container)


        this.previewImage = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.previewButton = ensureElement<HTMLButtonElement>('.card__button', this.container)
        this.descriptionCard = ensureElement<HTMLParagraphElement>('.card__text', this.container)
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container)

        this.previewButton.addEventListener('click', actions.onClick)
    }

    set image(value: string) {
        this.setImage(this.previewImage, CDN_URL + value)
    }

    set description(value: string) {
        this.descriptionCard.textContent = value
    }

    set buttonText(value: string) {
        this.previewButton.textContent = value
    }

    set buttonDisabled(value: boolean) {
        this.previewButton.disabled = value
    }

    set category(value: string) {
        this.cardCategory.textContent = value

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            )
        }
    }
}