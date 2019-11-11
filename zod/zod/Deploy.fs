namespace Zod

open Argu
open System

module Deploy =

    type DeployArgs =
        | [<AltCommandLine("-d")>] Deploy of message:string
    with
        interface IArgParserTemplate with
            member this.Usage =
                match this with
                | Deploy _ -> "Deploy a file"

    let deployFile file = 
        printfn "%s" file
        Ok ()