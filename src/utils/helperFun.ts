import * as bcrypt from "bcrypt";
import * as bwipjs from "bwip-js";
import { msg } from "./msg";
import { throwCustomError } from "src/exceptions/customException";
import * as pdf from "html-pdf";
import * as ejs from "ejs";

export const bCrypt = async (val: string): Promise<string> => {
  return await bcrypt.hash(val, 10);
};

export const bCryptCompare = async (
  val1: string,
  val2: string,
): Promise<boolean> => {
  return await bcrypt.compare(val1, val2);
};

export const getBase64FromEjsContent = async (
  templatePath: string,
  data: any,
): Promise<string> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const htmlContent = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(templatePath, data, {}, (err, str) => {
        if (err || !str) return reject(new Error(msg.ejsFileNotFound));
        resolve(str);
      });
    });

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const options: pdf.CreateOptions = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
      };
      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err || !buffer) return reject(new Error(msg.errGenPdf));
        resolve(buffer);
      });
    });

    return pdfBuffer.toString("base64");
  } catch (error) {
    throw error;
  }
};

export const generateBarcodeBase64 = async (
  text: string,
  altText?: string,
  showText: boolean = false,
) => {
  try {
    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: text,
      scale: 3,
      height: 10,
      includetext: showText,
      backgroundcolor: "FFFFFF",
      paddingwidth: 4,
      paddingtop: 2,
      alttext: altText,
    });

    return pngBuffer.toString("base64");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throwCustomError(msg.failToGenBarcode);
  }
};
