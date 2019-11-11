namespace Zod

open Argu
open System

module CommandLine =

    type CliError =
        | ArgumentsNotSpecified

    let getExitCode result =
        match result with
        | Ok () -> 0
        | Error err ->
            match err with
            | ArgumentsNotSpecified -> 1