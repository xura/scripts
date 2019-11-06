import {Toolbox} from "gluegun/build/types/domain/toolbox";

export default (command: (toolbox: Toolbox) => void) => {
    return () => command;
}