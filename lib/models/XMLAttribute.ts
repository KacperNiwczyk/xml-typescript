import {XMLElement} from "./XMLElement";
import {IXMLAttributeOptions} from "../interfaces/IXMLAttributeOptions";
import {IFullXMLAttributeOptions} from "../interfaces/IFullXMLAttributeOptions";

export class XMLAttribute {

  private name: string;

  static process(target: any,
                 key: string,
                 options: IXMLAttributeOptions = {},
                 descriptor?: TypedPropertyDescriptor<any>): void {

    const element = XMLElement.getOrCreateIfNotExists(target);
    const fullOptions = Object.assign({
      getter(entity: any): any {
        if (descriptor && descriptor.get) {
          return descriptor.get.call(entity);
        }
        return entity[key];
      }
    }, options);

    fullOptions.name = options.name || key;

    element.addAttribute(new XMLAttribute(fullOptions as IFullXMLAttributeOptions));
  }

  setSchema(target: any, entity: any): void {

    const value = this.options.getter.call(null, entity);

    if (value !== void 0) {
      target[this.name] = value;
    } else if (this.options.required) {

      throw new Error(`Attribute ${this.name} is required, but empty.`);
    }
  }

  private constructor(private options: IFullXMLAttributeOptions) {

    this.name = options.name;

    if (options.namespace) {

      this.name = options.namespace + ':' + this.name;
    }
  }
}
