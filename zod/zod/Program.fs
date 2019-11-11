namespace Zod

// open CommandLine
//open Deploy
open Version
open System
open Argu

module zod =

    type CliError =
        | ArgumentsNotSpecified



    type CommandArgs =
        | [<AltCommandLine("-v")>] Version of path:string
        | [<AltCommandLine("-d")>] Deploy of message:string
    with
        interface IArgParserTemplate with
            member this.Usage =
                match this with
                | Version _ -> "Current Zod Version"
                | Deploy _ -> "Deploy a file"


    let getVersion =
        printfn "0.0.1"
        Ok()

    let getExitCode result =
        match result with
        | Ok () -> 0
        | Error err ->
            match err with
            | ArgumentsNotSpecified -> 1

    [<EntryPoint>]
    let main argv = 
        let errorHandler = ProcessExiter(colorizer = function ErrorCode.HelpText -> None | _ -> Some ConsoleColor.Red)
        let parser = ArgumentParser.Create<CommandArgs>(programName = "zod", errorHandler = errorHandler)

        match parser.ParseCommandLine argv with
        | p when p.Contains(Version) -> getVersion
        | p when p.Contains(Deploy) -> getVersion // (p.GetResult(Deploy))
        | _ ->
            printfn "%s" (parser.PrintUsage())
            Error ArgumentsNotSpecified
        |> getExitCode