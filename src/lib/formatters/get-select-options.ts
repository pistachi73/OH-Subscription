import type { Option } from "@/components/ui/admin/admin-multiple-select";

export const getSelectOptions = <
  O extends {
    [key in V | L]: string | number;
  }[],
  V extends keyof O[0],
  L extends keyof O[0],
>({
  objectArr,
  valueKey,
  labelKey,
}: {
  objectArr: O;
  valueKey: V;
  labelKey: L;
}): Option[] => {
  return objectArr.map((obj) => ({
    value: obj[valueKey].toString(),
    label: obj[labelKey].toString(),
  }));
};
