import {instance, mock, when} from "ts-mockito";
import ICdnDeploy from "../../../interfaces/deploy/cdn";

export const cdnMock = () => {

    const MockedCdn = mock<ICdnDeploy>();

    when(MockedCdn.upload('path/to/file', 'fileName.txt')).thenResolve([true, 'File uploaded']);

    return instance(MockedCdn);
}