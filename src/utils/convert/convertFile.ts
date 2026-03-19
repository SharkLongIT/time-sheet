import RNFS from "react-native-fs";
import { toByteArray } from "base64-js";

export const getFileBytes = async (uri: string) => {

    const base64 = await RNFS.readFile(uri, "base64");

    const byteArray = Array.from(toByteArray(base64));

    return byteArray;

};

