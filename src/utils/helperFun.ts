import * as bcrypt from "bcrypt";

export const bCrypt = async (val: string): Promise<string> => {
  return await bcrypt.hash(val, 10);
};

export const bCryptCompare = async (
  val1: string,
  val2: string,
): Promise<boolean> => {
  return await bcrypt.compare(val1, val2);
};
