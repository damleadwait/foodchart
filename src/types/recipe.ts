export interface Recipe {
  id: string;
  name: string;
  normalizedName: string;
  ingredients: string[];
  isArchived?: boolean;
}