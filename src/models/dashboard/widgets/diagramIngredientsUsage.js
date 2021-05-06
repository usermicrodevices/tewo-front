import { computed, observable, reaction } from 'mobx';
import { getIngredientsConsumption } from 'services/ingredients';
import { daterangeToArgs } from 'utils/date';

class DiagramIngredientsUsage {
  generic;

  session;

  @observable ingredients;

  @computed get chart() {
    if (typeof this.ingredients === 'undefined') {
      return undefined;
    }
    const ingredients = this.ingredients.sort(({ data: { count: a } }, { data: { count: b } }) => b - a);
    const { ingredients: ingredientsStorage } = this.session;
    const result = ingredients.map(({ ingredientId, data: { count } }) => {
      const ingredient = ingredientsStorage.get(ingredientId);
      return {
        label: ingredient?.name,
        count,
        id: ingredientId,
        measure: ingredient?.measureUnit,
      };
    });
    return result;
  }

  @computed get isLoaded() {
    return typeof this.ingredients !== 'undefined';
  }

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    const updateValue = () => {
      this.ingredients = undefined;
      const dateRangeArg = daterangeToArgs(this.generic.dateRange, 'device_date');
      const pontsArg = this.generic.getPointsFilter('device__sale_point__id');
      const filter = [dateRangeArg.slice(1), pontsArg].filter(Boolean).join('&');
      getIngredientsConsumption(session)(null, null, filter).then(({ results }) => { this.ingredients = results; });
    };
    reaction(() => [this.generic.salePointsId, this.generic.dateRange], updateValue);
    updateValue();
  }
}

export default DiagramIngredientsUsage;
