
export interface Movies {
    title: string;
    shortDescription: string;
    longDescription: string;
    year: number;
    rating: number;
    img: string;
    uid: string;
}

export interface MovieWithRating {
    title: string;
    shortDescription: string;
    longDescription: string;
    year: number;
    rating: Array<string>;
    img: string;
    uid: string;
}

