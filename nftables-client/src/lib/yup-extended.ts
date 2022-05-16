import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";


const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv4WithPortRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/g;

yup.addMethod<yup.StringSchema>(yup.string, "ipv4", function () {
  return this.transform((value) => {
      if (value.match(ipv4Regex)) {
          return value;
      } else {
          return undefined;
      }
  });
});

yup.addMethod<yup.StringSchema>(yup.string, "ipv4WithPort", function() {
    return this.transform((value) => {
        if (value.match(ipv4WithPortRegex)) {
            return value;
        } else {
            return undefined;
        }
    })
})


declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    ipv4(): StringSchema<TType, TContext>,
    ipv4WithPort(): StringSchema<TType, TContext>;
  }
}

export default yup;