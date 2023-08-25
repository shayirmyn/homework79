export interface Category {
    id: number;
    name: string;
    description: string;
}

export type CategoryWithoutId = Omit<Category, 'id'>;

export interface Place {
    id: number;
    name: string;
    description: string;
}

export type PlaceWithoutId = Omit<Place, 'id'>;

export interface Item {
    id: number;
    category_id: number;
    place_id: number;
    name: string;
    description: string;
    photo: string | null;
}

export type ItemWithoutId = Omit<Item, 'id'>;

export interface existCategoryID {
    category_id: number;
}
export interface existPlaceID {
    place_id: number;
}