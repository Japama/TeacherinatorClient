export class Activity {
    _id: string | undefined;
    name: string = '';
    sport_id: number = 0;
    category: string = '';
    description: string = '';
    multimedia_links: string[] = [];
    rating: number = 0;
    reviews: number = 0;
    tags: string[] = [];
    user_id: number = 0;
  
    get isNew(): boolean {
      return this._id === undefined;
    }
  
    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer._id) this._id = initializer._id;
      if (initializer.name) this.name = initializer.name;
      if (initializer.sport_id) this.sport_id = initializer.sport_id;
      if (initializer.category) this.category = initializer.category;
      if (initializer.description) this.description = initializer.description;
      if (initializer.multimedia_links) this.multimedia_links = initializer.multimedia_links;
      if (initializer.rating) this.rating = initializer.rating;
      if (initializer.reviews) this.reviews = initializer.reviews;
      if (initializer.tags) this.tags = initializer.tags;
      if (initializer.user_id) this.user_id = initializer.user_id;
    }
  }
  