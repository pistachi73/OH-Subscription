import type { Option } from "../components/ui/admin/admin-multiple-select";

export const getMappedOptions = (options: Option[]): Record<string, string> => {
  return options.reduce((acc, { value, label }) => {
    Object.assign(acc, { [value]: label });
    return acc;
  }, {});
};
