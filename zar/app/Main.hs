module Main where

import Data.List
import Data.Monoid
import Deploy
import Options.Applicative

sample :: Parser Sample
sample =
  subparser
    (command "hello" (info hello (progDesc "Print greeting")) <>
     command "goodbye" (info (pure Goodbye) (progDesc "Say goodbye"))) <|>
  deployCommand

run :: Sample -> IO ()
run (Hello targets) = putStrLn $ "Hello, " ++ intercalate ", " targets ++ "!"
run Goodbye = putStrLn "Goodbye."

opts :: ParserInfo Sample
opts = info (sample <**> helper) idm

main :: IO ()
main = execParser opts >>= run