import { CheckboxCustomization } from "./check-box";

import { listItemCustomization } from "./list-item";
import { MenuCustomization } from "./menu";
import { SkeletonCustomization } from "./skeleton";
import { TextFieldCustomization } from "./textField";

export const components = {
  ...CheckboxCustomization,
  ...listItemCustomization,
  ...MenuCustomization,
  ...TextFieldCustomization,
  ...SkeletonCustomization,
};
