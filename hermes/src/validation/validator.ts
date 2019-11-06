import {Toolbox} from "gluegun/build/types/domain/toolbox";
import {TCommandValidators, VALIDATOR} from "../commands/deploy";

export type TValidator = (command: ((toolbox: Toolbox) => void)) => void;

export const validations: { [key: string]: (argument: string, value: string) => [boolean, string] } = {
    [VALIDATOR.string]: (argument, value) => {
        return [false, `'${argument}' must be a string`]
    }
};

export default (validators: TCommandValidators, toolbox: Toolbox): TValidator => {

    // @ts-ignore
    const validated = validators
        .arguments
        .find(
            argument => {
                const c =  argument[1].find(
                    validator => {
                        const b = validations[validator](argument[0], toolbox.parameters.options[argument[0]])[0] === false;
                        return b;
                    }
                );
                // NOTE this has to be an explicit check because c may be 0 and that would screw up the find
                // although, this may turn into a reduce method anyways....
                return c !== undefined;
            }
        );
    //@ts-ignore
    const b = validated;

    return (command) => command(toolbox);
}