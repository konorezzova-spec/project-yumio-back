import { Area } from '../models/area.js';
import { Categorie } from '../models/categorie.js';

export let AREA_NAMES = [];
export let CATEGORY_NAMES = [];

export const loadValidationData = async () => {
  const [areas, categories] = await Promise.all([
    Area.find().select('name -_id').lean(),
    Categorie.find().select('name -_id').lean(),
  ]);

  AREA_NAMES = areas.map(({ name }) => name);
  CATEGORY_NAMES = categories.map(({ name }) => name);

  console.log('Validation data loaded successfully');
};
